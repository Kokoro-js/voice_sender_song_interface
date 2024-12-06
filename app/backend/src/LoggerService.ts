import { Service } from "./service";
import pino, { Logger as PinoLogger } from "pino";

@Service()
export class LoggerService {
  private readonly baseLogger: PinoLogger;

  constructor() {
    this.baseLogger = pino({
      mixin() {
        return { appName: "Backend" }; // 基础 mixin 配置
      },
      level: "debug",
    });
  }

  // 返回基础 logger 实例
  public getLogger(): PinoLogger {
    return this.baseLogger;
  }

  // 生成新的扩展 logger 实例
  public createExtendedLogger(options: { [key: string]: any }): PinoLogger {
    return this.baseLogger.child(options);
  }
}

export default LoggerService;
