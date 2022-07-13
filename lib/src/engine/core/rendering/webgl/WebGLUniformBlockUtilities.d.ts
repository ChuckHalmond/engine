import { UniformsList } from "./WebGLUniformUtilities";
import { Buffer, BufferDataUsage } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type UniformBlock = {
    name: string;
    blockIndex: number;
    program: Program;
    layout: UniformBlockLayout;
    blockSize: number;
    bindingPoint: number;
};
export declare type UniformBlockLayout = {
    [name: string]: {
        offset: number;
    };
};
export declare type UniformBlockBuffer = Buffer & {
    rangeOffset?: number;
    rangeSize?: number;
};
export declare type RangedUniformBlockBuffer = UniformBlockBuffer & {
    rangeOffset: number;
    rangeSize: number;
};
export declare type UniformBufferProperties = {
    usage: BufferDataUsage;
};
export declare class WebGLUniformBlockUtilities {
    #private;
    static getBindingPointsEntries(): IterableIterator<[string, number]>;
    static createUniformBlock(gl: WebGL2RenderingContext, program: Program, name: string): UniformBlock | null;
    static createUniformBuffer(gl: WebGL2RenderingContext, byteLength: number, usage?: BufferDataUsage): UniformBlockBuffer | null;
    static createRangedUniformBuffers(gl: WebGL2RenderingContext, blocks: UniformBlock[], usage?: BufferDataUsage): {
        [name: string]: RangedUniformBlockBuffer;
    } | null;
    static setUniformBufferValues(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBlockBuffer, uniforms: UniformsList): void;
    static bindUniformBuffer(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBlockBuffer): void;
}
