import { VertexArray, VertexArrayValues, VertexArrayProperties, DrawMode } from "./WebGLVertexArrayUtilities";
import { Texture, TextureProperties } from "./WebGLTextureUtilities";
import { UniformBlock, UniformBlockBuffer, UniformBufferProperties } from "./WebGLUniformBlockUtilities";
import { Uniform, UniformsListSetter } from "./WebGLUniformUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type PacketProperties = {
    vertexArray: VertexArrayProperties;
    uniforms?: Record<string, Uniform>;
    uniformBlocks?: {
        block: UniformBlock;
        buffer?: UniformBlockBuffer | UniformBufferProperties;
        uniforms?: Record<string, Uniform>;
    }[];
    options?: {
        drawMode?: DrawMode;
        instanceCount?: number;
    };
};
export declare type PacketValues = {
    vertexArray?: VertexArrayValues;
    uniforms?: Record<string, Uniform>;
    uniformBlocks?: {
        block: UniformBlock;
        buffer: UniformBlockBuffer;
        uniforms: Record<string, Uniform>;
    }[];
};
export declare type Packet = {
    vertexArray: VertexArray;
    uniformsSetter?: UniformsListSetter;
    uniformBlocks?: Record<string, {
        block: UniformBlock;
        buffer: UniformBlockBuffer;
    }>;
    drawMode: DrawMode;
    instanceCount?: number;
};
export declare class WebGLPacketUtilities {
    static createTextures(gl: WebGL2RenderingContext, textures: Record<string, TextureProperties>): Record<string, Texture>;
    static createUniformBlocks(gl: WebGL2RenderingContext, program: Program, uniformBlocks: string[]): Record<string, UniformBlock>;
    static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null;
    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void;
    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void;
}
