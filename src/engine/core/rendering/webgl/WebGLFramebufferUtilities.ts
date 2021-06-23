import { FramebufferTarget, FramebufferAttachment, RenderbufferTarget, FramebufferTextureTarget, BufferMaskBit, TextureMagFilter } from "./WebGLConstants";

export { WebGLFramebufferUtilities };

type FramebufferReference = {
    glFb: WebGLFramebuffer;
}

type Framebuffer = FramebufferReference;

type FramebufferTextureAttachmentProperties = {
    attachment: FramebufferAttachment;
    texTarget: FramebufferTextureTarget;
    glTex: WebGLTexture;
}

type FramebufferTextureAttachment = FramebufferTextureAttachmentProperties & Framebuffer;

type FramebufferRenderbufferAttachmentProperties = {
    attachment: FramebufferAttachment;
    glRb: WebGLTexture;
}

type FramebufferRenderbufferAttachment = FramebufferRenderbufferAttachmentProperties & Framebuffer;

class WebGLFramebufferUtilities {

    private constructor() {}

    public static createFramebuffer(gl: WebGL2RenderingContext): Framebuffer | null {
        const glFb = gl.createFramebuffer();
    
        if (glFb === null) {
            console.error(`Could not create WebGLFramebuffer.`);
            return null;
        }
        
        return {
            glFb: glFb
        };
    }

    public static attachTexture(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferTextureAttachmentProperties): FramebufferTextureAttachment {
        const target = FramebufferTarget.FRAMEBUFFER;
        
        gl.bindFramebuffer(target, fb.glFb);
        gl.framebufferTexture2D(target, props.attachment, props.texTarget, props.glTex, 0);
        gl.bindFramebuffer(target, null);

        return {
            ...props,
            ...fb
        };
    }

    public static attachTextures(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferTextureAttachmentProperties[]): FramebufferTextureAttachment[] {
        const target = gl.FRAMEBUFFER;
        
        gl.bindFramebuffer(target, fb.glFb);

        const attachments = props.map((props) => {
            gl.framebufferTexture2D(target, props.attachment, props.texTarget, props.glTex, 0);
            return {
                ...props,
                ...fb
            };
        });

        gl.bindFramebuffer(target, null);

        return attachments;
    }

    public static attachRenderbuffers(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferRenderbufferAttachmentProperties[]): FramebufferRenderbufferAttachment[] {
        const target = gl.FRAMEBUFFER;
        
        gl.bindFramebuffer(target, fb.glFb);

        const attachments = props.map((props) => {
            gl.framebufferRenderbuffer(target, props.attachment, gl.RENDERBUFFER, props.glRb);
            return {
                ...props,
                ...fb
            };
        });

        gl.bindFramebuffer(target, null);

        return attachments;
    }

    public static attachRenderbuffer(gl: WebGL2RenderingContext, fb: Framebuffer, props: FramebufferRenderbufferAttachmentProperties): FramebufferRenderbufferAttachment {
        const target = gl.FRAMEBUFFER;
        
        gl.bindFramebuffer(target, fb.glFb);
        gl.framebufferRenderbuffer(target, props.attachment, gl.RENDERBUFFER, props.glRb);
        gl.bindFramebuffer(target, null);

        return {
            ...props,
            ...fb
        };
    }

    public static blit(gl: WebGL2RenderingContext, readFb: Framebuffer | null, drawFb: Framebuffer | null, readRec: Tuple<number, 4>, drawRec: Tuple<number, 4>, mask: BufferMaskBit, filter: TextureMagFilter): void {
        gl.bindFramebuffer(gl.READ_FRAMEBUFFER, (readFb !== null) ? readFb.glFb : null);
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, (drawFb !== null) ? drawFb.glFb : null);
        gl.blitFramebuffer(readRec[0], readRec[1], readRec[2], readRec[3], drawRec[0], drawRec[1], drawRec[2], drawRec[3], mask, filter);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    public static clearColor(gl: WebGL2RenderingContext, fb: Framebuffer, buff: Float32Array | Tuple<number, 4>, offset: number = 0): void {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb.glFb);
        gl.clearBufferfv(gl.COLOR, 0, buff, offset);
    }

    public static clearDepthStencil(gl: WebGL2RenderingContext, fb: Framebuffer, depth: number, stencil: number): void {
        gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, fb.glFb);
        gl.clearBufferfi(gl.DEPTH_STENCIL, 0, depth, stencil);
    }

    public static checkFramebufferStatus(gl: WebGL2RenderingContext): number {
        return gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    }

    public static deleteFramebuffer(gl: WebGL2RenderingContext, fb: Framebuffer): void {
        const glFb = fb.glFb;
        if (gl.isFramebuffer(glFb)) {
            gl.deleteFramebuffer(glFb);
        }
    }

    public static bindFramebuffer(gl: WebGL2RenderingContext, fb: Framebuffer): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, fb.glFb);
    }

    public static unbindFramebuffer(gl: WebGL2RenderingContext): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
}