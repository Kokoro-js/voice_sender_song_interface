import { GetStreamPayload } from "./generated/Stream";
import { Request } from "./generated/Request";

export function getStream(streamId: string) {
  // 创建 Path 类型数据
  const getStreamPayload: GetStreamPayload = {
    info: { streamId: streamId },
  };
  const data: Request = {
    payload: {
      oneofKind: "getStreamPayload",
      getStreamPayload: getStreamPayload,
    },
  };

  return Request.toBinary(data);
}
