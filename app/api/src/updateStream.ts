import { UpdateStreamPayload } from "./generated/Stream";
import { Request } from "./generated/Request";

export function seekSecond(streamId: string, second: number) {
  // 创建 Path 类型数据
  const updateStreamPayload: UpdateStreamPayload = {
    action: { oneofKind: "seekPayload", seekPayload: { second } },
    streamInfo: undefined,
    info: { streamId: streamId },
  };
  const data: Request = {
    payload: {
      oneofKind: "updateStreamPayload",
      updateStreamPayload: updateStreamPayload,
    },
  };

  return Request.toBinary(data);
}

export function skipCurrent(streamId: string, next?: string) {
  // 创建 Path 类型数据
  const updateStreamPayload: UpdateStreamPayload = {
    action: { oneofKind: "skipPayload", skipPayload: { next } },
    streamInfo: undefined,
    info: { streamId: streamId },
  };
  const data: Request = {
    payload: {
      oneofKind: "updateStreamPayload",
      updateStreamPayload: updateStreamPayload,
    },
  };

  return Request.toBinary(data);
}

export function switchState(streamId: string, state: number) {
  // 创建 Path 类型数据
  const updateStreamPayload: UpdateStreamPayload = {
    action: {
      oneofKind: "switchPlayStatePayload",
      switchPlayStatePayload: { state },
    },
    streamInfo: undefined,
    info: { streamId: streamId },
  };
  const data: Request = {
    payload: {
      oneofKind: "updateStreamPayload",
      updateStreamPayload: updateStreamPayload,
    },
  };

  return Request.toBinary(data);
}
