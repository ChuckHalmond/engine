import { VertexArray, VertexArrayValues, VertexArrayProperties, DrawMode } from "./WebGLVertexArrayUtilities";
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
    drawCommand: {
        mode: DrawMode;
        elementsCount?: number;
        instanceCount?: number;
        multiDraw?: {
            firstsList?: Iterable<number> | Int32Array;
            firstsOffset?: number;
            countsList?: Iterable<number> | Int32Array;
            countsOffset?: number;
            offsetsList?: Iterable<number> | Int32Array;
            offsetsOffset?: number;
            instanceCountsList?: Iterable<number> | Int32Array;
            instanceCountsOffset?: number;
            drawCount?: number;
        };
    };
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
    drawCommand: PacketDrawCommand;
};
export interface PacketDrawCommand {
    mode: DrawMode;
    elementsCount?: number;
    instanceCount?: number;
    multiDraw?: {
        firstsList?: Iterable<number> | Int32Array;
        firstsOffset?: number;
        countsList?: Iterable<number> | Int32Array;
        countsOffset?: number;
        offsetsList?: Iterable<number> | Int32Array;
        offsetsOffset?: number;
        instanceCountsList?: Iterable<number> | Int32Array;
        instanceCountsOffset?: number;
        drawCount?: number;
    };
}
export declare class WebGLPacketUtilities {
    #private;
    static createTextures(gl: WebGL2RenderingContext, textures: Record<string, TextureProperties>): Record<string, Texture>;
    static createPacket(gl: WebGL2RenderingContext, packet: PacketProperties): Packet | null;
    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void;
    static enableMultidrawExtension(gl: WebGL2RenderingContext): void;
    static drawPacket(gl: WebGL2RenderingContext, packet: Packet, drawCommand?: PacketDrawCommand): void;
}
