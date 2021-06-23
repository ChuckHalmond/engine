import { Capabilities, BufferMaskBit, Parameter, TestFunction } from "./WebGLConstants";

export { WebGLRendererUtilities };

class WebGLRendererUtilities {

    private constructor() {}

    public static setScissor(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void {
        gl.scissor(x, y, width, height);
    }

    public static setViewport(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void {
        gl.viewport(x, y, width, height);
    }

    public static getViewport(gl: WebGL2RenderingContext): Int32Array {
        return gl.getParameter(Parameter.VIEWPORT) as Int32Array;
    }

    public static getScissorBox(gl: WebGL2RenderingContext): Int32Array {
        return gl.getParameter(Parameter.SCISSOR_BOX) as Int32Array;
    }

    public static getParameter(gl: WebGL2RenderingContext, param: Parameter): any {
        return gl.getParameter(param);
    }

    public static enable(gl: WebGL2RenderingContext, cap: Capabilities): void {
        gl.enable(cap);
    }

    public static depthFunc(gl: WebGL2RenderingContext, func: TestFunction): void {
        gl.depthFunc(func);
    }

    public static stencilFunc(gl: WebGL2RenderingContext, func: TestFunction, ref: number, mask: number): void {
        gl.stencilFunc(func, ref, mask);
    }

    public static clear(gl: WebGL2RenderingContext, buff: BufferMaskBit): void {
        gl.clear(buff);
    }

    public static clearRgba(gl: WebGL2RenderingContext, red: number, green: number, blue: number, alpha: number): void {
        gl.clearColor(red, green, blue, alpha);
    }

    public static clearColor(gl: WebGL2RenderingContext, color: Tuple<number, 4>): void {
        gl.clearColor(color[0], color[1], color[2], color[3]);
    }
}