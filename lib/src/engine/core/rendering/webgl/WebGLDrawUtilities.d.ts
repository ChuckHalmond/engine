import { DrawMode, BufferIndexType } from "./WebGLConstants";
export { WebGLDrawUtilities };
declare class WebGLDrawUtilities {
    private constructor();
    static drawElements(gl: WebGL2RenderingContext, mode: DrawMode, indexType: BufferIndexType, count: number, offset: number): void;
    static drawElementsInstanced(gl: WebGL2RenderingContext, mode: DrawMode, indexType: BufferIndexType, count: number, offset: number, instanceCount: number): void;
    static drawRangeElements(gl: WebGL2RenderingContext, mode: DrawMode, start: number, end: number, count: number, indexType: BufferIndexType, offset: number): void;
    static drawArrays(gl: WebGL2RenderingContext, mode: DrawMode, first: number, count: number): void;
    static drawArraysInstanced(gl: WebGL2RenderingContext, mode: DrawMode, first: number, count: number, instances: number): void;
}
