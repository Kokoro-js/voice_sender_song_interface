import { getMp3Links } from './getter';
import { BaseExtra_IMPL, OrderItem } from './generated/Base';
import { StartStreamPayload } from './generated/Stream';
import { Request } from './generated/Request';

export async function startStream(channelId: string) {
  const orderList: OrderItem[] = await getMp3Links();

    const body = JSON.stringify({ "channel_id": channelId })
    const response = await fetch("https://www.kookapp.cn/api/v3/voice/join", {
      headers: {
        "Authorization": "Bot 1/MTY3NDQ=/RCrcaEYYX5StFgxEtR+IqQ==",
        "Content-Type": "application/json"
      },
      body: body,
      method: "POST"
    })
    const { data: d } = await response.json();

    // 创建 Path 类型数据
    const startStreamPayload: StartStreamPayload = {
      info: { streamId: channelId, extra: { name: "test", impl: BaseExtra_IMPL.KOOK } },
      streamInfo: {
        ip: d.ip,
        port: d.port,
        audioPt: 111,
        rtcpPort: 5005,
        audioSsrc: 1111,
        bitrate: 320,
        rtcpMux: false
      },
      orderList: orderList
    }
    const data: Request = { payload: { oneofKind: 'startStreamPayload', startStreamPayload: startStreamPayload } }

    return Request.toBinary(data);
}