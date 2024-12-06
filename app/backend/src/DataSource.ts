import { Service } from "./service";
import * as zmq from "zeromq";
import { EventEmitter2 } from "eventemitter2";
import { getStream, Response } from "api";
import { StatusCode } from "api/src/generated/Response";
import LoggerService from "./LoggerService";
import { IPlayerState, SongInfo } from "@/music/type";
import { MusicSourceService } from "@/music";

/**
 * 定义 DataSource 类可能触发的事件类型。
 */
export interface FetcherEvents {
  /**
   * 当播放器状态更新时触发。
   * @param data 包含流ID和响应数据。
   */
  player_update: (data: {
    id: string;
    response: { player?: IPlayerState; list?: SongInfo[] };
  }) => void;

  /**
   * 当发生错误时触发。
   * @param error 包含错误相关信息。
   */
  error: (error: { id: string; error: Error }) => void;

  /**
   * 当添加任务时触发。
   * @param id 任务的标识符。
   */
  taskAdded: (id: string) => void;

  /**
   * 当移除任务时触发。
   * @param id 任务的标识符。
   */
  taskRemoved: (id: string) => void;

  /**
   * 当任务启动时触发。
   * @param id 任务的标识符。
   */
  taskStarted: (id: string) => void;

  /**
   * 当任务停止时触发。
   * @param id 任务的标识符。
   */
  taskStopped: (id: string) => void;

  /**
   * 当所有任务停止时触发。
   */
  allTasksStopped: () => void;
}

/**
 * ZeroMQ 的配置接口。
 */
export interface ZeroMQConfig {
  address: string; // ZeroMQ 的连接地址
  subAddr: string; // ZeroMQ 的订阅地址
}

/**
 * DataSource 类负责管理 ZeroMQ 连接，并通过事件发出相应的通知。
 * 继承自 EventEmitter2，并通过方法重载实现事件类型的安全性。
 */

@Service()
class DataSource extends EventEmitter2 {
  public dealer: zmq.Dealer; // ZeroMQ Dealer 套接字
  private isRunning: boolean = true; // 控制数据接收的运行状态
  private tasks: Map<string, NodeJS.Timer> = new Map(); // 存储周期性任务
  private logger; // 日志服务实例

  /**
   * 构造函数，初始化 ZeroMQ 连接和日志服务。
   * @param config ZeroMQ 的配置
   * @param musicsourceService 音乐源服务
   * @param loggerService 日志服务
   */
  constructor(
    config: ZeroMQConfig,
    private musicsourceService: MusicSourceService,
    private loggerService: LoggerService
  ) {
    super(); // 调用 EventEmitter2 的构造函数
    this.dealer = new zmq.Dealer();
    this.dealer.connect(config.address); // 连接到 ZeroMQ 地址
    this.logger = this.loggerService.createExtendedLogger({
      name: "ZeroMQFetcher",
    });
    this.on_data(); // 开始监听数据
  }

  /**
   * 发送请求并处理响应数据。
   * @param streamId 流的标识符
   */
  private async fetchPlayerStateData(streamId: string): Promise<void> {
    try {
      const streamRequest = await getStream(streamId); // 获取请求数据
      await this.dealer.send(streamRequest); // 发送请求到 ZeroMQ
    } catch (error) {
      this.logger.error(`发送请求失败，ID: ${streamId}`, error);
      this.emit("error", { id: streamId, error: error as Error }); // 触发错误事件
    }
  }

  /**
   * 持续监听 ZeroMQ 接收的数据，并处理相应的事件。
   */
  private async on_data() {
    while (this.isRunning) {
      try {
        // 接收来自 ZeroMQ 的消息
        const [msg] = (await this.dealer.receive()) as unknown as Uint8Array[];
        const res = Response.fromBinary(msg); // 解析响应
        this.logger.debug(res); // 记录调试日志

        if (res.code !== StatusCode.SUCCESS) {
          this.logger.error(
            `响应错误，代码: ${res.code}, 信息: ${res.message}`
          );
          this.emit("error", { id: "unknown", error: new Error(res.message) }); // 触发错误事件
          continue;
        }

        const data = res.data;
        if (data.oneofKind === "getStreamResponse") {
          const getStreamResponse = data.getStreamResponse;
          const streamId = getStreamResponse.streamId;
          const musicId = getStreamResponse.currentPlay!.taskId; // 假设不为 undefined

          const musicSource =
            this.musicsourceService.getSourceByFullId(musicId);
          if (!musicSource) {
            this.logger.error(`后端返回了未知的音乐ID: ${musicId}`);
            this.emit("error", {
              id: streamId,
              error: new Error(`未知的音乐ID: ${musicId}`),
            });
            continue;
          }

          const { title, artist, cover } = await musicSource.getById(musicId);
          this.emit("player_update", {
            // 触发播放器更新事件
            id: streamId,
            response: {
              player: {
                currentMS: getStreamResponse.timePlayed,
                totalMS: getStreamResponse.timeTotal,
                volume: 100,
                state: getStreamResponse.state,
                musicId: musicId,
                title: title,
                artist: artist,
                cover: cover,
              },
            },
          });
        }
      } catch (error) {
        this.logger.error("接收数据时发生错误:", error);
        this.emit("error", { id: "unknown", error: error as Error }); // 触发错误事件
      }
    }
  }

  /**
   * 添加一个周期性任务，用于定时获取播放器状态数据。
   * @param id 任务的标识符
   * @param intervalMs 执行间隔（毫秒）
   */
  public addPeriodicTask(id: string, intervalMs: number): void {
    if (this.tasks.has(id)) {
      this.logger.warn(`任务已存在，ID: ${id}`);
      return;
    }
    const task = setInterval(() => this.fetchPlayerStateData(id), intervalMs);
    this.tasks.set(id, task);
    this.emit("taskAdded", id); // 触发任务添加事件
    this.emit("taskStarted", id); // 触发任务启动事件
  }

  /**
   * 移除一个周期性任务。
   * @param id 任务的标识符
   */
  public removePeriodicTask(id: string): void {
    const task = this.tasks.get(id);
    if (!task) {
      this.logger.warn(`未找到任务，ID: ${id}`);
      return;
    }
    clearInterval(task); // 清除定时器
    this.tasks.delete(id); // 从任务映射中移除
    this.emit("taskStopped", id); // 触发任务停止事件
    this.emit("taskRemoved", id); // 触发任务移除事件
  }

  /**
   * 检查指定的任务是否存在。
   * @param id 任务的标识符
   * @returns 如果任务存在，返回 true；否则，返回 false。
   */
  public isTaskExist(id: string): boolean {
    return this.tasks.has(id);
  }

  /**
   * 停止所有正在运行的任务。
   */
  public stopAllTasks(): void {
    this.tasks.forEach((task, id) => {
      clearInterval(task); // 清除定时器
      this.emit("taskStopped", id); // 触发任务停止事件
    });
    this.tasks.clear(); // 清空任务映射
    this.emit("allTasksStopped"); // 触发所有任务停止事件
  }

  /**
   * 列出所有任务的ID。
   * @returns 一个包含所有任务ID的数组。
   */
  public listAllTasks(): string[] {
    return Array.from(this.tasks.keys());
  }

  /**
   * 重载 `on` 方法，添加类型安全。
   * @param event 事件名称
   * @param listener 监听器函数
   * @returns 当前实例，便于链式调用
   */
  public on<U extends keyof FetcherEvents>(
    event: U,
    listener: FetcherEvents[U]
  ) {
    return super.on(event, listener);
  }

  /**
   * 重载 `emit` 方法，添加类型安全。
   * @param event 事件名称
   * @param args 事件参数
   * @returns 如果事件有监听器，返回 true；否则，返回 false。
   */
  public emit<U extends keyof FetcherEvents>(
    event: U,
    ...args: Parameters<FetcherEvents[U]>
  ): boolean {
    return super.emit(event, ...args);
  }
}

// 使用命名导出而非默认导出
export default DataSource;
