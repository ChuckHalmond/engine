import { DrawMode, BufferIndexType } from "./WebGLConstants";

export { WebGLDrawUtilities };

class WebGLDrawUtilities {

    private constructor() {}

    public static drawElements(gl: WebGL2RenderingContext, mode: DrawMode, indexType: BufferIndexType, count: number, offset: number): void {
        gl.drawElements(mode, count, indexType, offset);
    }

    public static drawElementsInstanced(gl: WebGL2RenderingContext, mode: DrawMode, indexType: BufferIndexType, count: number, offset: number, instanceCount: number): void {
        gl.drawElementsInstanced(mode, count, indexType, offset, instanceCount);
    }
    
    public static drawRangeElements(gl: WebGL2RenderingContext, mode: DrawMode, start: number, end: number, count: number, indexType: BufferIndexType, offset: number): void {
        gl.drawRangeElements(mode, start, end, count, indexType, offset);
    }

    public static drawArrays(gl: WebGL2RenderingContext, mode: DrawMode, first: number, count: number): void {
        gl.drawArrays(mode, first, count);
    }

    public static drawArraysInstanced(gl: WebGL2RenderingContext, mode: DrawMode, first: number, count: number, instances: number): void {
        gl.drawArraysInstanced(mode, first, count, instances);
    }
}