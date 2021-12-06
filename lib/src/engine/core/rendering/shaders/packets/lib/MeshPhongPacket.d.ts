import { AbstractPacket } from "../Packet";
import { TextureReference } from "../../textures/TextureReference";
import { WorldViewUBO } from "../../ubos/lib/WorldViewUBO";
import { LightsUBO } from "../../ubos/lib/LightsUBO";
import { Camera } from "../../../scenes/cameras/Camera";
import { PhongMesh } from "../../../scenes/objects/meshes/PhongMesh";
import { Scene } from "../../../scenes/Scene";
import { PacketBindingsProperties, PacketBindings, Packet } from "../../../webgl/WebGLPacketUtilities";
import { PhongUBO } from "../../ubos/lib/PhongUBO";
import { PhongVAO } from "../../vaos/lib/PhongVAO";
export declare type MeshPhongPacketReferences = {
    mesh: PhongMesh;
    camera: Camera;
    scene: Scene;
};
declare type TMeshPhongPacketTextures = {
    albedoMap?: TextureReference;
    normalMap?: TextureReference;
};
export declare class MeshPhongPacket extends AbstractPacket {
    references: MeshPhongPacketReferences;
    textures: TMeshPhongPacketTextures;
    phongVAO: PhongVAO;
    phongUBO: PhongUBO;
    worldViewUBO: WorldViewUBO;
    lightsUBO: LightsUBO;
    constructor(references: MeshPhongPacketReferences);
    getPacketBindingsProperties(): PacketBindingsProperties;
    getPacketValues(bindings: PacketBindings): Packet;
    enableDelta(): void;
    disableDelta(): void;
    getDeltaPacketValues(bindings: PacketBindings): Packet;
}
export {};
