export declare enum RenderbufferPixelFormat {
    R8 = 33321,
    R8UI = 33330,
    R8I = 33329,
    R16UI = 33332,
    R16I = 33331,
    R32UI = 33334,
    R32I = 33333,
    RG8 = 33323,
    RG8UI = 33336,
    RG8I = 33335,
    RG16UI = 33338,
    RG16I = 33337,
    RG32UI = 33340,
    RG32I = 33339,
    RGB8 = 32849,
    RGBA8 = 32856,
    SRGB8_ALPHA8 = 35907,
    RGBA4 = 32854,
    RGB565 = 36194,
    RGB5_A1 = 32855,
    RGB10_A2 = 32857,
    RGBA8UI = 36220,
    RGBA8I = 36238,
    RGB10_A2UI = 36975,
    RGBA16UI = 36214,
    RGBA16I = 36232,
    RGBA32I = 36226,
    RGBA32UI = 36208,
    DEPTH_COMPONENT16 = 33189,
    DEPTH_COMPONENT24 = 33190,
    DEPTH_COMPONENT32F = 36012,
    DEPTH_STENCIL = 34041,
    DEPTH24_STENCIL8 = 35056,
    DEPTH32F_STENCIL8 = 36013,
    STENCIL_INDEX8 = 36168
}
export declare type Renderbuffer = {
    internal: WebGLRenderbuffer;
};
export declare type RenderbufferProperties = {
    internalFormat: RenderbufferPixelFormat;
    width: number;
    height: number;
    samples?: number;
};
export declare class WebGLRenderbufferUtilities {
    private constructor();
    static createRenderbuffer(gl: WebGL2RenderingContext, props: RenderbufferProperties): Renderbuffer | null;
}
