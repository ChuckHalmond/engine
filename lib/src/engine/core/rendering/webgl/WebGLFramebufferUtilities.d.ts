import { FramebufferAttachment, FramebufferTextureTarget, BufferMaskBit, TextureMagFilter } from "./WebGLConstants";
export { WebGLFramebufferUtilities };
declare type FramebufferReference = {
    glFb: WebGLFramebuffer;
};
declare type Framebuffer = FramebufferReference;
declare type FramebufferTextureAttachmentProperties = {
    attachment: FramebufferAttachment;
    texTarget: FramebufferTextureTarget;
    glTex: WebGLTexture;
};
declare type FramebufferTextureAttachment = FramebufferTextureAttachmentProperties & Framebuffer;
declare type FramebufferRenderbufferAttachmentProperties = {
    attachment: FramebufferAttachment;
    glRb: WebGLTexture;
};
declare type FramebufferRenderbufferAttachment = FramebufferRenderbufferAttachmentProperties & Framebuffer;
declare class WebGLFramebufferUtilities {
    private constructor();
    static createFramebuffer(gl: WebGL2RenderingContext): Framebuffer | null;
    static attachTexture(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferTextureAttachmentProperties): FramebufferTextureAttachment;
    static attachTextures(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferTextureAttachmentProperties[]): FramebufferTextureAttachment[];
    static attachRenderbuffers(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferRenderbufferAttachmentProperties[]): FramebufferRenderbufferAttachment[];
    static attachRenderbuffer(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferRenderbufferAttachmentProperties): FramebufferRenderbufferAttachment;
    static blit(gl: WebGL2RenderingContext, readFb: Framebuffer | null, drawFb: Framebuffer | null, readRec: Tuple<number, 4>, drawRec: Tuple<number, 4>, mask: BufferMaskBit, filter: TextureMagFilter): void;
    static clearColor(gl: WebGL2RenderingContext, fb: Framebuffer, buff: Float32Array | Tuple<number, 4>, offset?: number): void;
    static clearDepthStencil(gl: WebGL2RenderingContext, fb: Framebuffer, depth: number, stencil: number): void;
    static checkFramebufferStatus(gl: WebGL2RenderingContext): number;
    static deleteFramebuffer(gl: WebGL2RenderingContext, fb: Framebuffer): void;
    static bindFramebuffer(gl: WebGL2RenderingContext, fb: Framebuffer): void;
    static unbindFramebuffer(gl: WebGL2RenderingContext): void;
}
