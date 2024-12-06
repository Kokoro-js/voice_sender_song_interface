import {
  GetPlayListPayload,
  UpdatePlayListPayload,
} from "./generated/PlayList";
import { OrderItem } from "./generated/Base";
import { Request } from "./generated/Request";

export function getPlayList(streamId: string) {
  // 创建 Path 类型数据
  const getPlayListPayload: GetPlayListPayload = {
    info: { streamId: streamId },
  };
  const data: Request = {
    payload: {
      oneofKind: "getPlayListPayload",
      getPlayListPayload: getPlayListPayload,
    },
  };

  return Request.toBinary(data);
}

export function updatePlayList(streamId: string, list: OrderItem[]) {
  // 创建 Path 类型数据
  const updatePlayListPayload: UpdatePlayListPayload = {
    orderList: list,
    info: { streamId: streamId },
  };
  const data: Request = {
    payload: {
      oneofKind: "updatePlayListPayload",
      updatePlayListPayload: updatePlayListPayload,
    },
  };

  return Request.toBinary(data);
}
