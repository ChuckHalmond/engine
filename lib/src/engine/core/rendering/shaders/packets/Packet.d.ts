import { PacketBindingsProperties, PacketBindings, Packet } from "../../webgl/WebGLPacketUtilities";
export declare abstract class AbstractPacket {
    abstract getPacketBindingsProperties(...args: any): PacketBindingsProperties;
    abstract enableDelta(): void;
    abstract disableDelta(): void;
    abstract getPacketValues(bindings: PacketBindings, ...args: any): Packet;
    abstract getDeltaPacketValues(bindings: PacketBindings, ...args: any): Packet;
}
