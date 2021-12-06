import { PacketBindingsProperties, PacketBindings, Packet } from "../../webgl/WebGLPacketUtilities";

export abstract class AbstractPacket {
    public abstract getPacketBindingsProperties(...args: any): PacketBindingsProperties;
    public abstract enableDelta(): void;
    public abstract disableDelta(): void;
    public abstract getPacketValues(bindings: PacketBindings, ...args: any): Packet;
    public abstract getDeltaPacketValues(bindings: PacketBindings, ...args: any): Packet;
}