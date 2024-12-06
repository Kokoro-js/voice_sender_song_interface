import { Service } from "./service";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";
import DataSource from "./DataSource";
import * as zmq from "zeromq";

const EVENT_NAME = "progress";

// global.d.ts
declare global {
  interface Variables {
    instanceId: string;
    dealer: zmq.Dealer;
  }
}

import { HTTPException } from "hono/http-exception";
import action from "./router";
import { createMiddleware } from "hono/factory";
import { Listener } from "eventemitter2";
@Service()
export default class HonoService {
  private readonly app = new Hono<{ Variables: Variables }>();

  constructor(private source: DataSource) {
    const instanceIdMiddleware = createMiddleware((c, next) => {
      const id = c.req.query("instanceId");
      if (!id || !source.isTaskExist(id)) {
        throw new HTTPException(401, { message: "Cannot find such instance." });
      }
      c.set("instanceId", id);
      c.set("dealer", source.dealer);
      return next();
    });
    this.app.use("/action", instanceIdMiddleware);
    this.app.route("/action", action);
    this.app.use("/data", instanceIdMiddleware);
    this.app.get("/data", (c) => {
      const instanceId = c.get("instanceId");

      return streamSSE(c, async (stream) => {
        // 保存监听器引用
        // 注册 `data` 事件监听器
        const listener = source.on("player_update", ({ id, response }) => {
          if (instanceId !== id) {
            return;
          }
          stream.writeSSE({
            event: EVENT_NAME,
            data: JSON.stringify(response),
          });
        }) as Listener;

        // 创建一个 `Promise`，用于在接收到 `taskRemoved` 事件时结束 SSE 流
        const exitPromise = new Promise<void>((resolve) => {
          source.once("taskRemoved", (id) => {
            if (instanceId === id) {
              listener.off(); // 触发退出
            }
          });
        });

        // 等待 `exitPromise` 触发
        await exitPromise;
      });
    });
  }

  public getApp() {
    return this.app;
  }

  public start(port: number) {
    this.app.fire();
    console.log(`Server is running on port ${port}`);
  }
}
