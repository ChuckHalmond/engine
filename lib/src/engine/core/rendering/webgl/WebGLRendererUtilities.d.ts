import { Capabilities, BufferMaskBit, Parameter, TestFunction } from "./WebGLConstants";
export { WebGLRendererUtilities };
declare class WebGLRendererUtilities {
    private constructor();
    static setScissor(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;
    static setViewport(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;
    static getViewport(gl: WebGL2RenderingContext): Int32Array;
    static getScissorBox(gl: WebGL2RenderingContext): Int32Array;
    static getParameter(gl: WebGL2RenderingContext, param: Parameter): any;
    static enable(gl: WebGL2RenderingContext, cap: Capabilities): void;
    static depthFunc(gl: WebGL2RenderingContext, func: TestFunction): void;
    static stencilFunc(gl: WebGL2RenderingContext, func: TestFunction, ref: number, mask: number): void;
    static clear(gl: WebGL2RenderingContext, buff: BufferMaskBit): void;
    static clearRgba(gl: WebGL2RenderingContext, red: number, green: number, blue: number, alpha: number): void;
    static clearColor(gl: WebGL2RenderingContext, color: Tuple<number, 4>): void;
}
