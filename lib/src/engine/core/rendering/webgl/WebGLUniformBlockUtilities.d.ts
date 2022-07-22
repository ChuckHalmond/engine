import { Uniform } from "./WebGLUniformUtilities";
import { Buffer, BufferDataUsage } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type UniformBlock = {
    name: string;
    blockIndex: number;
    program: Program;
    layout: Record<string, {
        byteOffset: number;
    }>;
    blockSize: number;
    bindingPoint?: number;
    buffer?: UniformBuffer;
};
export declare type UniformBlockProperties = {
    buffer?: number;
    uniforms?: Record<string, Uniform>;
};
export declare type UniformBuffer = Buffer & {
    bindingPoint?: number;
    rangeOffset?: number;
    rangeSize?: number;
};
export declare type UniformBufferProperties = {
    usage: BufferDataUsage;
};
export declare type UniformBlocksProperties = {
    buffers: (UniformBuffer | UniformBufferProperties)[];
    blocks: Record<string, {
        buffer: number;
        uniforms: Record<string, Uniform>;
    }>;
};
export declare class WebGLUniformBlockUtilities {
    #private;
    static getBindingPointsEntries(): IterableIterator<[string, number]>;
    static createUniformBlock(gl: WebGL2RenderingContext, program: Program, name: string): UniformBlock | null;
    static createUniformBuffer(gl: WebGL2RenderingContext, byteLength: number, bind?: boolean, usage?: BufferDataUsage): UniformBuffer | null;
    static createRangedUniformBuffers(gl: WebGL2RenderingContext, blocks: UniformBlock[], bind?: boolean, usage?: BufferDataUsage): UniformBuffer[] | null;
    static setUniformBufferValues(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer, uniforms: Record<string, Uniform>): void;
    static setUniformBufferData(gl: WebGL2RenderingContext, buffer: UniformBuffer, data: ArrayBufferView, dstByteOffset?: number, srcOffset?: number, length?: number): void;
    static lastBindingPoint: number;
    static bindUniformBuffer(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer): void;
}
