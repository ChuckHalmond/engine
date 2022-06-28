import { VertexArray, VertexArrayValues, VertexArrayProperties, DrawMode } from "./WebGLVertexArrayUtilities";
import { Texture, TextureProperties } from "./WebGLTextureUtilities";
import { UniformBlock, UniformBuffer, UniformBufferProperties } from "./WebGLUniformBlockUtilities";
import { UniformsList, UniformsListSetter } from "./WebGLUniformUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type PacketProperties = {
    vertexArray: VertexArrayProperties;
    uniforms?: UniformsList;
    textures?: {
        texture: Texture;
        properties: TextureProperties;
    }[];
    uniformBlocks?: {
        block: UniformBlock;
        buffer?: UniformBuffer | UniformBufferProperties;
        uniforms: UniformsList;
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
        buffer: UniformBuffer;
        uniforms: UniformsList;
    }[];
};
export declare type PacketBindingsProperties = {
    program: Program;
    textures?: string[];
    uniformBlocks?: string[];
};
export declare type PacketBindings = {
    textures: {
        [name: string]: Texture;
    };
    uniformBlocks: {
        [name: string]: UniformBlock;
    };
};
export declare type Packet = {
    vertexArray?: VertexArray;
    uniformsSetter?: UniformsListSetter;
    uniformBlocks?: {
        [name: string]: {
            block: UniformBlock;
            buffer: UniformBuffer;
        };
    };
    bindings?: PacketBindings;
    drawMode: DrawMode;
    instanceCount?: number;
};
export declare class WebGLPacketUtilities {
    static createBindings(gl: WebGL2RenderingContext, properties: PacketBindingsProperties): PacketBindings;
    static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null;
    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void;
    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void;
}
