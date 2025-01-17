// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "PlayList.proto" (package "OMNI.Instance", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
import { OrderItem } from "./Base";
import { BaseInfo } from "./Base";
/**
 * @generated from protobuf message OMNI.Instance.GetPlayListPayload
 */
export interface GetPlayListPayload {
    /**
     * @generated from protobuf field: OMNI.BaseInfo info = 1;
     */
    info?: BaseInfo;
}
/**
 * @generated from protobuf message OMNI.Instance.UpdatePlayListPayload
 */
export interface UpdatePlayListPayload {
    /**
     * @generated from protobuf field: OMNI.BaseInfo info = 1;
     */
    info?: BaseInfo;
    /**
     * @generated from protobuf field: repeated OMNI.OrderItem order_list = 2;
     */
    orderList: OrderItem[];
}
// @generated message type with reflection information, may provide speed optimized methods
class GetPlayListPayload$Type extends MessageType<GetPlayListPayload> {
    constructor() {
        super("OMNI.Instance.GetPlayListPayload", [
            { no: 1, name: "info", kind: "message", T: () => BaseInfo }
        ]);
    }
    create(value?: PartialMessage<GetPlayListPayload>): GetPlayListPayload {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<GetPlayListPayload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: GetPlayListPayload): GetPlayListPayload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* OMNI.BaseInfo info */ 1:
                    message.info = BaseInfo.internalBinaryRead(reader, reader.uint32(), options, message.info);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: GetPlayListPayload, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* OMNI.BaseInfo info = 1; */
        if (message.info)
            BaseInfo.internalBinaryWrite(message.info, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OMNI.Instance.GetPlayListPayload
 */
export const GetPlayListPayload = new GetPlayListPayload$Type();
// @generated message type with reflection information, may provide speed optimized methods
class UpdatePlayListPayload$Type extends MessageType<UpdatePlayListPayload> {
    constructor() {
        super("OMNI.Instance.UpdatePlayListPayload", [
            { no: 1, name: "info", kind: "message", T: () => BaseInfo },
            { no: 2, name: "order_list", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => OrderItem }
        ]);
    }
    create(value?: PartialMessage<UpdatePlayListPayload>): UpdatePlayListPayload {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.orderList = [];
        if (value !== undefined)
            reflectionMergePartial<UpdatePlayListPayload>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: UpdatePlayListPayload): UpdatePlayListPayload {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* OMNI.BaseInfo info */ 1:
                    message.info = BaseInfo.internalBinaryRead(reader, reader.uint32(), options, message.info);
                    break;
                case /* repeated OMNI.OrderItem order_list */ 2:
                    message.orderList.push(OrderItem.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: UpdatePlayListPayload, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* OMNI.BaseInfo info = 1; */
        if (message.info)
            BaseInfo.internalBinaryWrite(message.info, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* repeated OMNI.OrderItem order_list = 2; */
        for (let i = 0; i < message.orderList.length; i++)
            OrderItem.internalBinaryWrite(message.orderList[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message OMNI.Instance.UpdatePlayListPayload
 */
export const UpdatePlayListPayload = new UpdatePlayListPayload$Type();
