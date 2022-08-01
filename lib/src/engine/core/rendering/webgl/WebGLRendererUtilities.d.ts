export declare enum StencilAction {
    KEEP = 7680,
    REPLACE = 7681,
    INCR = 7682,
    DECR = 7683,
    INVERT = 5386,
    INCR_WRAP = 34055,
    DECR_WRAP = 34056
}
export declare enum BufferMask {
    DEPTH_BUFFER_BIT = 256,
    STENCIL_BUFFER_BIT = 1024,
    COLOR_BUFFER_BIT = 16384
}
export declare enum Buffer {
    COLOR = 6144,
    DEPTH = 6145,
    STENCIL = 6146,
    DEPTH_STENCIL = 34041
}
export declare enum TestFunction {
    NEVER = 512,
    LESS = 513,
    EQUAL = 514,
    LEQUAL = 515,
    GREATER = 516,
    NOTEQUAL = 517,
    GEQUAL = 518,
    ALWAYS = 519
}
export declare enum BlendingMode {
    ZERO = 0,
    ONE = 1,
    SRC_COLOR = 768,
    ONE_MINUS_SRC_COLOR = 769,
    SRC_ALPHA = 770,
    ONE_MINUS_SRC_ALPHA = 771,
    DST_ALPHA = 772,
    ONE_MINUS_DST_ALPHA = 773,
    DST_COLOR = 774,
    ONE_MINUS_DST_COLOR = 775,
    SRC_ALPHA_SATURATE = 776,
    CONSTANT_COLOR = 32769,
    ONE_MINUS_CONSTANT_COLOR = 32770,
    CONSTANT_ALPHA = 32771,
    ONE_MINUS_CONSTANT_ALPHA = 32772
}
export declare enum BlendingEquation {
    FUNC_ADD = 32774,
    FUNC_SUBTRACT = 32778,
    FUNC_REVERSE_SUBTRACT = 32779,
    MIN = 32775,
    MAX = 32776
}
export declare enum Capabilities {
    BLEND = 3042,
    CULL_FACE = 2884,
    DEPTH_TEST = 2929,
    DITHER = 3024,
    POLYGON_OFFSET_FILL = 32823,
    SAMPLE_ALPHA_TO_COVERAGE = 32926,
    SAMPLE_COVERAGE = 32928,
    SCISSOR_TEST = 3089,
    STENCIL_TEST = 2960,
    RASTERIZER_DISCARD = 35977
}
export declare enum Face {
    FRONT = 1028,
    BACK = 1029,
    FRONT_AND_BACK = 1032
}
export declare enum WindingOrder {
    CW = 2304,
    CCW = 2305
}
export declare enum HintTarget {
    GENERATE_MIPMAP_HINT = 33170,
    FRAGMENT_SHADER_DERIVATIVE_HINT = 35723
}
export declare enum HintMode {
    DONT_CARE = 4352,
    FASTEST = 4353,
    NICEST = 4354
}
export declare class WebGLRendererUtilities {
    static hint(gl: WebGL2RenderingContext, target: HintTarget, mode: HintMode): void;
    static frontFace(gl: WebGL2RenderingContext, winding: WindingOrder): void;
    static scissor(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;
    static viewport(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number): void;
    static clearColor(gl: WebGL2RenderingContext, color: ArrayLike<number>): void;
    static depthFunction(gl: WebGL2RenderingContext, func: TestFunction): void;
    static blendEquation(gl: WebGL2RenderingContext, equ: BlendingEquation): void;
    static blendFunction(gl: WebGL2RenderingContext, srcFunc: BlendingMode, dstFunc: BlendingMode): void;
    static blendFunctionSeparate(gl: WebGL2RenderingContext, srcFunc: BlendingMode, dstFunc: BlendingMode, srcAlpha: number, dstAlpha: number): void;
    static stencilFunction(gl: WebGL2RenderingContext, func: TestFunction, ref: number, mask: number, face: Face): void;
    static stencilOperations(gl: WebGL2RenderingContext, fail: StencilAction, zFail: StencilAction, zPass: StencilAction, face: Face): void;
    static stencilMask(gl: WebGL2RenderingContext, mask: number, face: Face): void;
    static colorMask(gl: WebGL2RenderingContext, red: boolean, green: boolean, blue: boolean, alpha: boolean): void;
    static depthMask(gl: WebGL2RenderingContext, flag: boolean): void;
    static enable(gl: WebGL2RenderingContext, capability: Capabilities): void;
    static disable(gl: WebGL2RenderingContext, capability: Capabilities): void;
    static clear(gl: WebGL2RenderingContext, buffer: BufferMask): void;
    static getViewport(gl: WebGL2RenderingContext): Int32Array;
    static getMaxSamples(gl: WebGL2RenderingContext): number;
    static drawBuffers(gl: WebGL2RenderingContext, buffers: Iterable<number>): void;
    static clearBuffers(gl: WebGL2RenderingContext, buffer: Buffer, index: number, values: Float32Array | Int32Array | Uint32Array, srcOffset?: number): void;
}
