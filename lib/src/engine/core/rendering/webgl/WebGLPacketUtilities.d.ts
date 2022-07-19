import { VertexArray, VertexArrayValues, VertexArrayProperties } from "./WebGLVertexArrayUtilities";
import { Texture, TextureProperties } from "./WebGLTextureUtilities";
import { UniformBlock, UniformBlockProperties, UniformBuffer, UniformBufferProperties } from "./WebGLUniformBlockUtilities";
import { Uniform, UniformsListSetter } from "./WebGLUniformUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type PacketProperties = {
    program: Program;
    vertexArray: VertexArrayProperties;
    uniformBuffers?: (UniformBufferProperties | UniformBuffer)[];
    uniformBlocks?: Record<string, UniformBlockProperties>;
    uniforms?: Record<string, Uniform>;
};
export declare type PacketValues = {
    vertexArray?: VertexArrayValues;
    uniforms?: Record<string, Uniform>;
    uniformBlocks?: Record<string, {
        uniforms: Record<string, Uniform>;
    }>;
};
export declare type Packet = {
    program: Program;
    vertexArray: VertexArray;
    uniforms?: UniformsListSetter;
    uniformBlocks?: Record<string, UniformBlock>;
};
export declare class WebGLPacketUtilities {
    static createTextures(gl: WebGL2RenderingContext, textures: Record<string, TextureProperties>): Record<string, Texture>;
    static createPacket(gl: WebGL2RenderingContext, packet: PacketProperties): Packet | null;
    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void;
    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void;
}
