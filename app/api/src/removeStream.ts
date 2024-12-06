import { RemoveStreamPayload } from "./generated/Stream";
import { Request } from "./generated/Request";

export function removeStream(streamId: string) {
  // 创建 Path 类型数据
  const removeStreamPayload: RemoveStreamPayload = {
    info: { streamId: streamId },
  };
  const data: Request = {
    payload: {
      oneofKind: "removeStreamPayload",
      removeStreamPayload: removeStreamPayload,
    },
  };

  return Request.toBinary(data);
}
