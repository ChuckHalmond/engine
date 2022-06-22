import { BufferMask } from "./WebGLRendererUtilities";
import { Texture, TextureMagFilter, TexturePixelFormat, TexturePixelType } from "./WebGLTextureUtilities";
export declare enum FramebufferStatus {
    FRAMEBUFFER_COMPLETE = 36053,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 36054,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 36055,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 36057,
    FRAMEBUFFER_UNSUPPORTED = 36061
}
export declare enum FramebufferTextureTarget {
    TEXTURE_2D = 3553,
    TEXTURE_CUBE_MAP_POSITIVE_X = 34069,
    TEXTURE_CUBE_MAP_NEGATIVE_X = 34070,
    TEXTURE_CUBE_MAP_POSITIVE_Y = 34071,
    TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072,
    TEXTURE_CUBE_MAP_POSITIVE_Z = 34073,
    TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074
}
export declare enum FramebufferAttachment {
    COLOR_ATTACHMENT0 = 36064,
    COLOR_ATTACHMENT1 = 36065,
    COLOR_ATTACHMENT2 = 36066,
    COLOR_ATTACHMENT3 = 36067,
    COLOR_ATTACHMENT4 = 36068,
    COLOR_ATTACHMENT5 = 36069,
    COLOR_ATTACHMENT6 = 36070,
    COLOR_ATTACHMENT7 = 36071,
    COLOR_ATTACHMENT8 = 36072,
    COLOR_ATTACHMENT9 = 36073,
    COLOR_ATTACHMENT10 = 36074,
    COLOR_ATTACHMENT11 = 36075,
    COLOR_ATTACHMENT12 = 36076,
    COLOR_ATTACHMENT13 = 36077,
    COLOR_ATTACHMENT14 = 36078,
    COLOR_ATTACHMENT15 = 36079,
    DEPTH_ATTACHMENT = 36096,
    STENCIL_ATTACHMENT = 36128,
    DEPTH_STENCIL_ATTACHMENT = 33306
}
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
declare type Framebuffer = {
    internal: WebGLFramebuffer;
};
declare type FramebufferTextureAttachmentProperties = {
    attachment: FramebufferAttachment;
    textureTarget: FramebufferTextureTarget;
    texture: Texture;
};
declare type FramebufferTextureAttachment = FramebufferTextureAttachmentProperties & Framebuffer;
declare type FramebufferRenderbufferAttachmentProperties = {
    attachment: FramebufferAttachment;
    renderbuffer: Renderbuffer;
};
declare type FramebufferRenderbufferAttachment = FramebufferRenderbufferAttachmentProperties & Framebuffer;
export declare class WebGLFramebufferUtilities {
    private constructor();
    static createFramebuffer(gl: WebGL2RenderingContext): Framebuffer | null;
    static createRenderbuffer(gl: WebGL2RenderingContext, props: RenderbufferProperties): Renderbuffer | null;
    static attachTexture(gl: WebGL2RenderingContext, framebuffer: Framebuffer, ...props: FramebufferTextureAttachmentProperties[]): FramebufferTextureAttachment[];
    static attachRenderbuffer(gl: WebGL2RenderingContext, framebuffer: Framebuffer, ...props: FramebufferRenderbufferAttachmentProperties[]): FramebufferRenderbufferAttachment[];
    static blit(gl: WebGL2RenderingContext, readFramebuffer: Framebuffer | null, drawFramebuffer: Framebuffer | null, readRectangle: number[], drawRectangle: number[], mask: BufferMask, filter: TextureMagFilter): void;
    static readPixels(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number, format: TexturePixelFormat, type: TexturePixelType, pixels: ArrayBufferView): void;
    static bindFramebuffer(gl: WebGL2RenderingContext, framebuffer: Framebuffer): void;
    static unbindFramebuffer(gl: WebGL2RenderingContext): void;
    static deleteFramebuffer(gl: WebGL2RenderingContext, framebuffer: Framebuffer): void;
    static deleteRenderbuffer(gl: WebGL2RenderingContext, renderbuffer: Renderbuffer): void;
}
export {};
