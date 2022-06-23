export enum StencilAction {
    KEEP = 0x1E00,
    REPLACE	= 0x1E01,
    INCR = 0x1E02,
    DECR = 0x1E03,
    INVERT = 0x150A,
    INCR_WRAP = 0x8507,
    DECR_WRAP = 0x8508
}

export enum BufferMask {
    DEPTH_BUFFER_BIT = 0x00000100,
    STENCIL_BUFFER_BIT = 0x00000400,
    COLOR_BUFFER_BIT = 0x00004000
}

export enum TestFunction {
    NEVER = 0x0200,
    LESS = 0x0201,
    EQUAL = 0x0202,
    LEQUAL = 0x0203,
    GREATER = 0x0204,
    NOTEQUAL = 0x0205,
    GEQUAL = 0x0206,
    ALWAYS = 0x0207,
}

export enum BlendingMode {
    ZERO = 0,
    ONE = 1,
    SRC_COLOR = 0x0300,
    ONE_MINUS_SRC_COLOR = 0x0301,
    SRC_ALPHA = 0x0302,
    ONE_MINUS_SRC_ALPHA	= 0x0303,
    DST_ALPHA = 0x0304,
    ONE_MINUS_DST_ALPHA = 0x0305,
    DST_COLOR = 0x0306,
    ONE_MINUS_DST_COLOR = 0x0307,
    SRC_ALPHA_SATURATE = 0x0308,
    CONSTANT_COLOR = 0x8001,
    ONE_MINUS_CONSTANT_COLOR = 0x8002,
    CONSTANT_ALPHA = 0x8003,
    ONE_MINUS_CONSTANT_ALPHA = 0x8004
}

export enum BlendingEquation {
    FUNC_ADD = 0x8006,
    FUNC_SUBTRACT = 0x800A,
    FUNC_REVERSE_SUBTRACT = 0x800B,
    MIN = 0x8007,
    MAX = 0x8008,
}

export enum Capabilities {
    BLEND = 0x0BE2,
    CULL_FACE = 0x0B44,
    DEPTH_TEST = 0x0B71,
    DITHER = 0x0BD0,
    POLYGON_OFFSET_FILL = 0x8037,
    SAMPLE_ALPHA_TO_COVERAGE = 0x809E,
    SAMPLE_COVERAGE = 0x80A0,
    SCISSOR_TEST = 0x0C11,
    STENCIL_TEST= 0x0B90,
    RASTERIZER_DISCARD = 0x8C89
}

export enum Face {
    FRONT = 0x0404,
    BACK = 0x0405,
    FRONT_AND_BACK = 0x0408
}

export enum WindingOrder {
    CW = 0x0900,
    CCW = 0x0901
}

export class WebGLRendererUtilities {

    static frontFace(gl: WebGL2RenderingContext, winding: WindingOrder): void {
        gl.frontFace(winding);
    }

    static scissor(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void {
        gl.scissor(x, y, width, height);
    }

    static viewport(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void {
        gl.viewport(x, y, width, height);
    }

    static clearColor(gl: WebGL2RenderingContext, color: [number, ...number[]] & { length: 4 }): void {
        gl.clearColor(color[0], color[1], color[2], color[3]);
    }

    static depthFunction(gl: WebGL2RenderingContext, func: TestFunction): void {
        gl.depthFunc(func);
    }

    static blendEquation(gl: WebGL2RenderingContext, equ: BlendingEquation): void {
        gl.blendEquation(equ);
    }

    static blendFunction(gl: WebGL2RenderingContext, srcFunc: BlendingMode, dstFunc: BlendingMode): void {
        gl.blendFunc(srcFunc, dstFunc);
    }

    static stencilFunction(gl: WebGL2RenderingContext, func: TestFunction, ref: number, mask: number, face: Face): void {
        gl.stencilFuncSeparate(face, func, ref, mask);
    }

    static stencilOperations(gl: WebGL2RenderingContext, fail: StencilAction, zFail: StencilAction, zPass: StencilAction, face: Face) {
        gl.stencilOpSeparate(face, fail, zFail, zPass);
    }

    static stencilMask(gl: WebGL2RenderingContext, mask: number, face: Face) {
        gl.stencilMaskSeparate(face, mask);
    }

    static colorMask(gl: WebGL2RenderingContext, red: boolean, green: boolean, blue: boolean, alpha: boolean) {
        gl.colorMask(red, green, blue, alpha);
    }

    static enable(gl: WebGL2RenderingContext, capability: Capabilities): void {
        gl.enable(capability);
    }

    static disable(gl: WebGL2RenderingContext, capability: Capabilities): void {
        gl.disable(capability);
    }

    static clear(gl: WebGL2RenderingContext, buffer: BufferMask): void {
        gl.clear(buffer);
    }

    static getViewport(gl: WebGL2RenderingContext): Int32Array {
        return gl.getParameter(gl.VIEWPORT) as Int32Array;
    }

    static getMaxSamples(gl: WebGL2RenderingContext): number {
        return gl.getParameter(gl.MAX_SAMPLES) as number;
    }
}