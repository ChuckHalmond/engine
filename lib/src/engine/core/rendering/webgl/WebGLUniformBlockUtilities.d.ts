import { UniformsList } from "./WebGLUniformUtilities";
import { BufferProperties, Buffer, BufferDataUsage } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";
export declare type UniformBlock = {
    name: string;
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
export declare type UniformBuffer = Buffer & {
    rangeOffset?: number;
    rangeSize?: number;
};
export declare type UniformBufferProperties = Omit<BufferProperties, "target"> & {
    rangeOffset?: number;
    rangeSize?: number;
};
export declare type UniformBlocksBindingsContext = {
    maxBindingPoints: number;
    registeredBindingPoints: Array<boolean>;
};
export declare class WebGLUniformBlockUtilities {
    private constructor();
    static createUniformBuffer(gl: WebGL2RenderingContext, program: Program, blockName: string, usage?: BufferDataUsage, byteLength?: number, rangeOffset?: number, rangeSize?: number): UniformBuffer | null;
    static setUniformBufferValues(gl: WebGL2RenderingContext, layout: UniformBlockLayout, buffer: UniformBuffer, uniforms: UniformsList): void;
    static bindUniformBuffer(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer): void;
    static createUniformBlock(gl: WebGL2RenderingContext, program: Program, name: string): UniformBlock | null;
    private static _bindingPoints;
    private static _freeBindingPoint;
    private static _allocateBindingPoint;
}
