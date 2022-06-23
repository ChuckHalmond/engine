import { VertexArray, VertexArrayValues, VertexArrayProperties, DrawMode } from "./WebGLVertexArrayUtilities";
import { Texture, TextureParameters, TextureProperties } from "./WebGLTextureUtilities";
import { UniformBlock, UniformBuffer, UniformBufferProperties } from "./WebGLUniformBlockUtilities";
import { UniformsList, UniformsListSetter } from "./WebGLUniformUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type PacketProperties = {
    vertexArray?: VertexArrayProperties;
    uniforms?: UniformsList;
    textures?: {
        texture: Texture;
        props?: TextureProperties;
        params?: TextureParameters;
    }[];
    uniformBlocks?: {
        block: UniformBlock;
        buffer?: UniformBuffer | UniformBufferProperties;
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
    textures?: {
        texture: Texture;
        props?: TextureProperties;
        params?: TextureParameters;
    }[];
    uniformBlocks?: {
        block: UniformBlock;
        buffer: UniformBuffer;
        uniforms: UniformsList;
    }[];
};
export declare type PacketBindingsProperties = {
    program: Program;
    textures?: {
        [name: string]: TextureProperties & TextureParameters;
    };
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
    static createBindings(gl: WebGL2RenderingContext, props: PacketBindingsProperties): PacketBindings;
    static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null;
    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void;
    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void;
}
