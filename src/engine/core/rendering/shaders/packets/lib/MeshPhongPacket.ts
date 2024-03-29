/*import { AbstractPacket } from "../Packet";
import { TextureReference } from "../../textures/TextureReference";
import { WorldViewUBO } from "../../ubos/lib/WorldViewUBO";
import { LightsUBO } from "../../ubos/lib/LightsUBO";
import { Camera } from "../../../scenes/cameras/Camera";
import { PhongMesh } from "../../../scenes/objects/meshes/PhongMesh";
import { Scene } from "../../../scenes/Scene";
import { PacketBindingsProperties, PacketBindings, Packet } from "../../../webgl/WebGLPacketUtilities";
import { PhongUBO } from "../../ubos/lib/PhongUBO";
import { PhongVAO } from "../../vaos/lib/PhongVAO";

export type MeshPhongPacketReferences = {
  mesh: PhongMesh;
  camera: Camera;
  scene: Scene;
}

type TMeshPhongPacketTextures = {
  albedoMap?: TextureReference;
  normalMap?: TextureReference;
}

export class MeshPhongPacket extends AbstractPacket {

  references: MeshPhongPacketReferences;

  textures: TMeshPhongPacketTextures;

  phongVAO: PhongVAO;
  phongUBO: PhongUBO;
  worldViewUBO: WorldViewUBO;
  lightsUBO: LightsUBO;

  constructor(references: MeshPhongPacketReferences) {
    super();

    this.references = references;
    this.textures = {};

    const mesh = references.mesh;
    const geometry = mesh.geometry;
    const material = mesh.material;
    const camera = references.camera;
    const scene = references.scene;

    this.phongVAO = PhongVAO.getInstance({geometry: geometry});
    this.phongUBO = PhongUBO.getInstance({material: material});
    this.worldViewUBO = WorldViewUBO.getInstance({meshTransform: mesh.transform, camera: camera});
    this.lightsUBO = LightsUBO.getInstance({scene: scene});
    
    if (material.albedoMap) {
      //this.textures.albedoMap = TextureReference.getInstance(material.albedoMap);
    }

    if (material.normalMap) {
      //this.textures.normalMap = TextureReference.getInstance(material.normalMap);
    }
  }
  
  getPacketBindingsProperties(): PacketBindingsProperties {

    const packetBindingsProps: List = {
      texturesProps: {},
      blocksProps: {
        worldViewBlock: {name: this.worldViewUBO.name},
        lightsBlock: {name: this.lightsUBO.name},
        phongBlock: {name: this.phongUBO.name }
      }
    };

    if (this.textures.albedoMap) {
      packetBindingsProps.texturesProps.albedoMap = this.textures.albedoMap;
    }

    if (this.textures.normalMap) {
      packetBindingsProps.texturesProps.normalMap = this.textures.normalMap;
    }

    return packetBindingsProps;
  }

  getPacketValues(bindings: PacketBindings): Packet {
    
    const packetValues: Packet = {

      attributes: this.phongVAO.getAttributeValues(),
  
      uniformBlocks: {
        worldViewBlock: {
          block: bindings.blocks.worldViewBlock,
          list: this.worldViewUBO.getUniformValues()
        },
        lightsBlock: {
          block: bindings.blocks.lightsBlock,
          list: this.lightsUBO.getUniformValues()
        },
        phongBlock: {
          block: bindings.blocks.phongBlock,
          list: this.phongUBO.getUniformValues()
        }
      },
      
      uniforms: {
        u_diffuseMap: { value: bindings.textures.albedoMap },
        u_normalMap: { value: bindings.textures.normalMap }
      }
    };

    return packetValues;
  }

  enableDelta(): void {
    throw new Error("Method not implemented.");
  }
  disableDelta(): void {
    throw new Error("Method not implemented.");
  }


  getDeltaPacketValues(bindings: PacketBindings): Packet {

    const phongAttributesDelta = this.phongVAO.getDeltaAttributeValues();
    const worldViewDelta = this.worldViewUBO.getDeltaUniformValues();
    const lightsDelta = this.lightsUBO.getDeltaUniformValues();
    const phongDelta = this.phongUBO.getDeltaUniformValues();

    let packetValues: List = {
      uniformBlocks: {},
      uniforms: {}
    };

    if (phongAttributesDelta) {
      packetValues.attributes = phongAttributesDelta;
    }

    //packetValues.uniformBlocks = {};

    if (worldViewDelta) {
      //packetValues.uniformBlocks = packetValues.uniformBlocks || {};
      packetValues.uniformBlocks.worldViewBlock = {
        block: bindings.blocks.worldViewBlock,
        list: worldViewDelta
      };
    }

    if (lightsDelta) {
      //packetValues.uniformBlocks = packetValues.uniformBlocks || {};
      packetValues.uniformBlocks.lightsBlock = {
        block: bindings.blocks.lightsBlock,
        list: lightsDelta
      };
    }
  
    if (phongDelta) {
      //packetValues.uniformBlocks = packetValues.uniformBlocks || {};
      packetValues.uniformBlocks.phongBlock = {
        block: bindings.blocks.phongBlock,
        list: phongDelta
      };
    }

    return packetValues;
  }
}*/