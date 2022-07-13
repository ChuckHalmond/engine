import { VertexArray, VertexArrayValues, VertexArrayProperties, DrawMode } from "./WebGLVertexArrayUtilities";
import { Texture, TextureProperties } from "./WebGLTextureUtilities";
import { UniformBlock, UniformBlockBuffer, UniformBufferProperties } from "./WebGLUniformBlockUtilities";
import { UniformsList, UniformsListSetter } from "./WebGLUniformUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type PacketProperties = {
    vertexArray: VertexArrayProperties;
    uniforms?: UniformsList;
    uniformBlocks?: {
        block: UniformBlock;
        buffer?: UniformBlockBuffer | UniformBufferProperties;
        uniforms?: UniformsList;
    }[];
    options?: {
        drawMode?: DrawMode;
        instanceCount?: number;
    };
};
export declare type PacketValues = {
    vertexArray?: VertexArrayValues;
    uniforms?: UniformsList;
    uniformBlocks?: {
        block: UniformBlock;
        buffer: UniformBlockBuffer;
        uniforms: UniformsList;
    }[];
};
export declare type Packet = {
    vertexArray?: VertexArray;
    uniformsSetter?: UniformsListSetter;
    uniformBlocks?: {
        [name: string]: {
            block: UniformBlock;
            buffer: UniformBlockBuffer;
        };
    };
    drawMode: DrawMode;
    instanceCount?: number;
};
export declare class WebGLPacketUtilities {
    static createTextures(gl: WebGL2RenderingContext, textures: {
        [name: string]: TextureProperties;
    }): {
        [name: string]: Texture;
    };
    static createUniformBlocks(gl: WebGL2RenderingContext, program: Program, uniformBlocks: string[]): {
        [name: string]: UniformBlock;
    };
    static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null;
    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void;
    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void;
}
