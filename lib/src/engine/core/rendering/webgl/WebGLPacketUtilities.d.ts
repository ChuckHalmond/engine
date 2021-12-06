import { AttributesList, AttributesSettersList } from "./WebGLAttributeUtilities";
import { Texture, TextureProperties, TexturesUnitsContext } from "./WebGLTextureUtilities";
import { UniformBlock, UniformBlockProperties, UniformBlocksBindingsContext, UniformBlockSetter } from "./WebGLUniformBlockUtilities";
import { UniformsList, UniformsSettersList } from "./WebGLUniformUtilities";
import { DrawMode } from "./WebGLConstants";
export { Packet };
export { PacketBindingsProperties };
export { PacketBindings };
export { PacketOptions };
export { PacketSetter };
export { WebGLPacketUtilities };
declare type Packet = {
    attributes?: AttributesList;
    uniforms?: UniformsList;
    uniformBlocks?: List<{
        block: UniformBlock;
        list: UniformsList;
    }>;
    options?: PacketOptions;
};
declare type PacketBindingsProperties = {
    texturesProps?: List<TextureProperties>;
    blocksProps?: List<UniformBlockProperties>;
    texturesCtx?: TexturesUnitsContext;
    blocksCtx?: UniformBlocksBindingsContext;
};
declare type PacketBindings = {
    textures: List<Texture>;
    blocks: List<UniformBlock>;
    texturesCtx?: TexturesUnitsContext;
    blocksCtx?: UniformBlocksBindingsContext;
};
declare type PacketOptions = {
    drawMode?: DrawMode;
    instanced?: boolean;
    instanceCount?: number;
};
declare type PacketSetter = {
    attributesSetter?: AttributesSettersList;
    uniformsSetter?: UniformsSettersList;
    uniformBlockSetters?: List<UniformBlockSetter>;
    drawMode: DrawMode;
    instanced: boolean;
    instanceCount: number;
};
declare class WebGLPacketUtilities {
    private constructor();
    static createPacketBindings(gl: WebGL2RenderingContext, props: PacketBindingsProperties): PacketBindings | null;
    static getPacketSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, packet: Packet): PacketSetter | null;
    static setPacketValues(gl: WebGL2RenderingContext, setter: PacketSetter, packet: Packet): void;
    static drawPacket(gl: WebGL2RenderingContext, setter: PacketSetter): void;
}
