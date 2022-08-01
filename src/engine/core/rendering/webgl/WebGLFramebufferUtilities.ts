import { BufferMask } from "./WebGLRendererUtilities";
import { Texture, TextureMagFilter, TexturePixelFormat, TexturePixelType } from "./WebGLTextureUtilities";

export enum FramebufferStatus {
    FRAMEBUFFER_COMPLETE = 0x8CD5,
    FRAMEBUFFER_INCOMPLETE_ATTACHMENT = 0x8CD6,
    FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT = 0x8CD7,
    FRAMEBUFFER_INCOMPLETE_DIMENSIONS = 0x8CD9,
    FRAMEBUFFER_UNSUPPORTED = 0x8CDD
}

export enum FramebufferTextureTarget {
    TEXTURE_2D = 0x0DE1,
    TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
    TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A
}

export enum FramebufferAttachment {
    COLOR_ATTACHMENT0 = 0x8CE0,
    COLOR_ATTACHMENT1 = 0x8CE1,
    COLOR_ATTACHMENT2 = 0x8CE2,
    COLOR_ATTACHMENT3 = 0x8CE3,
    COLOR_ATTACHMENT4 = 0x8CE4,
    COLOR_ATTACHMENT5 = 0x8CE5,
    COLOR_ATTACHMENT6 = 0x8CE6,
    COLOR_ATTACHMENT7 = 0x8CE7,
    COLOR_ATTACHMENT8 = 0x8CE8,
    COLOR_ATTACHMENT9 = 0x8CE9,
    COLOR_ATTACHMENT10 = 0x8CEA,
    COLOR_ATTACHMENT11 = 0x8CEB,
    COLOR_ATTACHMENT12 = 0x8CEC,
    COLOR_ATTACHMENT13 = 0x8CED,
    COLOR_ATTACHMENT14 = 0x8CEE,
    COLOR_ATTACHMENT15 = 0x8CEF,
    DEPTH_ATTACHMENT = 0x8D00,
    STENCIL_ATTACHMENT = 0x8D20,
    DEPTH_STENCIL_ATTACHMENT = 0x821A
}

export enum RenderbufferPixelFormat {
    R8 = 0x8229,
    R8UI = 0x8232,
    R8I = 0x8231,
    R16UI = 0x8234,
    R16I = 0x8233,
    R32UI = 0x8236,
    R32I = 0x8235,
    RG8 = 0x822B,
    RG8UI = 0x8238,
    RG8I = 0x8237,
    RG16UI = 0x823A,
    RG16I = 0x8239,
    RG32UI = 0x823C,
    RG32I = 0x823B,
    RGB8 = 0x8051,
    RGBA8 = 0x8058,
    SRGB8_ALPHA8 = 0x8C43,
    RGBA4 = 0x8056,
    RGB565 = 0x8D62,
    RGB5_A1 = 0x8057,
    RGB10_A2 = 0x8059,
    RGBA8UI = 0x8D7C,
    RGBA8I = 0x8D8E,
    RGB10_A2UI = 0x906F,
    RGBA16UI = 0x8D76,
    RGBA16I = 0x8D88,
    RGBA32I = 0x8D82,
    RGBA32UI = 0x8D70,
    DEPTH_COMPONENT16 = 0x81A5,
    DEPTH_COMPONENT24 = 0x81A6,
    DEPTH_COMPONENT32F = 0x8CAC,
    DEPTH24_STENCIL8 = 0x88F0,
    DEPTH32F_STENCIL8 = 0x8CAD,
    STENCIL_INDEX8 = 0x8D48
}

export enum DrawBuffer {
    NONE = 0x0000,
    BACK = 0x0405,
    COLOR_ATTACHMENT0 = 0x8CE0,
    COLOR_ATTACHMENT1 = 0x8CE1,
    COLOR_ATTACHMENT2 = 0x8CE2,
    COLOR_ATTACHMENT3 = 0x8CE3,
    COLOR_ATTACHMENT4 = 0x8CE4,
    COLOR_ATTACHMENT5 = 0x8CE5,
    COLOR_ATTACHMENT6 = 0x8CE6,
    COLOR_ATTACHMENT7 = 0x8CE7,
    COLOR_ATTACHMENT8 = 0x8CE8,
    COLOR_ATTACHMENT9 = 0x8CE9,
    COLOR_ATTACHMENT10 = 0x8CEA,
    COLOR_ATTACHMENT11 = 0x8CEB,
    COLOR_ATTACHMENT12 = 0x8CEC,
    COLOR_ATTACHMENT13 = 0x8CED,
    COLOR_ATTACHMENT14 = 0x8CEE,
    COLOR_ATTACHMENT15 = 0x8CEF,

}
export type Renderbuffer = {
    internalRenderbuffer: WebGLRenderbuffer;
}

export type RenderbufferProperties = {
    internalFormat: RenderbufferPixelFormat;
    width: number;
    height: number;
    samples?: number;
}

type Framebuffer = {
    internalFramebuffer: WebGLFramebuffer;
};

type FramebufferTextureAttachmentProperties = {
    attachment: FramebufferAttachment;
    textureTarget: FramebufferTextureTarget;
    texture: Texture;
}

type FramebufferTextureAttachment = FramebufferTextureAttachmentProperties & Framebuffer;

type FramebufferRenderbufferAttachmentProperties = {
    attachment: FramebufferAttachment;
    renderbuffer: Renderbuffer;
}

type FramebufferRenderbufferAttachment = FramebufferRenderbufferAttachmentProperties & Framebuffer;

export class WebGLFramebufferUtilities {

    static createFramebuffer(gl: WebGL2RenderingContext): Framebuffer | null {
        const internalFramebuffer = gl.createFramebuffer();
    
        if (internalFramebuffer === null) {
            return null;
        }
        
        return {
            internalFramebuffer
        };
    }

    static createRenderbuffer(gl: WebGL2RenderingContext, props: RenderbufferProperties): Renderbuffer | null {
        const internalRenderbuffer = gl.createRenderbuffer();
        if (internalRenderbuffer === null) {
            return null;
        }

        gl.bindRenderbuffer(gl.RENDERBUFFER, internalRenderbuffer);
        
        if (typeof props.samples !== "undefined") {
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, props.samples, props.internalFormat, props.width, props.height);
        }
        else {
            gl.renderbufferStorage(gl.RENDERBUFFER, props.internalFormat, props.width, props.height);
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return {
            ...props,
            internalRenderbuffer
        };
    }

    static attachTexture(gl: WebGL2RenderingContext, framebuffer: Framebuffer, ...properties: FramebufferTextureAttachmentProperties[]): FramebufferTextureAttachment[] {
        const {internalFramebuffer} = framebuffer;
        const currentFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        if (currentFramebuffer !== internalFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, internalFramebuffer);
        }
        
        const attachments = properties.map((properties) => {
            const {attachment, textureTarget, texture} = properties;
            const {internalTexture} = texture;
            gl.framebufferTexture2D(gl.FRAMEBUFFER, attachment, textureTarget, internalTexture, 0);
            return {
                ...properties,
                ...framebuffer
            };
        });

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== FramebufferStatus.FRAMEBUFFER_COMPLETE) {
            console.warn(`Incomplete framebuffer status: ${FramebufferStatus[status]}`);
        }

        this.unbindFramebuffer(gl);

        return attachments;
    }

    static drawBuffers(gl: WebGL2RenderingContext, framebuffer: Framebuffer, drawBuffers: DrawBuffer[]): void {
        const {internalFramebuffer} = framebuffer;
        const currentFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        if (currentFramebuffer !== internalFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, internalFramebuffer);
        }
        
        gl.drawBuffers(drawBuffers);

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== FramebufferStatus.FRAMEBUFFER_COMPLETE) {
            console.warn(`Incomplete framebuffer status: ${FramebufferStatus[status]}`);
        }

        this.unbindFramebuffer(gl);
    }

    static attachRenderbuffer(gl: WebGL2RenderingContext, framebuffer: Framebuffer, ...props: FramebufferRenderbufferAttachmentProperties[]): FramebufferRenderbufferAttachment[] {
        const {internalFramebuffer} = framebuffer;
        const currentFramebuffer = gl.getParameter(gl.FRAMEBUFFER_BINDING);
        if (currentFramebuffer !== internalFramebuffer) {
            gl.bindFramebuffer(gl.FRAMEBUFFER, internalFramebuffer);
        }

        const attachments = props.map((props) => {
            gl.framebufferRenderbuffer(gl.FRAMEBUFFER, props.attachment, gl.RENDERBUFFER, props.renderbuffer.internalRenderbuffer);
            return {
                ...props,
                ...framebuffer
            };
        });

        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== FramebufferStatus.FRAMEBUFFER_COMPLETE) {
            console.warn(`Incomplete framebuffer status: ${FramebufferStatus[status]}`);
        }

        this.unbindFramebuffer(gl);

        return attachments;
    }

    static blit(gl: WebGL2RenderingContext, readFramebuffer: Framebuffer | null, drawFramebuffer: Framebuffer | null, readRectangle: number[], drawRectangle: number[], mask: BufferMask, filter: TextureMagFilter): void {
        const currentReadFramebuffer = gl.getParameter(gl.READ_FRAMEBUFFER_BINDING);
        if (currentReadFramebuffer !== readFramebuffer) {
            const internalReadFramebuffer = readFramebuffer?.internalFramebuffer ?? null;
            gl.bindFramebuffer(gl.READ_FRAMEBUFFER, internalReadFramebuffer);
        }
        
        const currentDrawFramebuffer = gl.getParameter(gl.DRAW_FRAMEBUFFER_BINDING);
        if (currentDrawFramebuffer !== drawFramebuffer) {
            const internalDrawFramebuffer = drawFramebuffer?.internalFramebuffer ?? null;
            gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, internalDrawFramebuffer);
        }
        
        gl.blitFramebuffer(readRectangle[0], readRectangle[1], readRectangle[2], readRectangle[3], drawRectangle[0], drawRectangle[1], drawRectangle[2], drawRectangle[3], mask, filter);

        this.unbindFramebuffer(gl);
    }

    static readPixels(gl: WebGL2RenderingContext, x: number, y: number, width: number, height: number, format: TexturePixelFormat, type: TexturePixelType, pixels: ArrayBufferView): void {
        gl.readPixels(x, y, width, height, format, type, pixels);
    }

    static bindFramebuffer(gl: WebGL2RenderingContext, framebuffer: Framebuffer): void {
        const {internalFramebuffer} = framebuffer;
        gl.bindFramebuffer(gl.FRAMEBUFFER, internalFramebuffer);
    }

    static unbindFramebuffer(gl: WebGL2RenderingContext): void {
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    static deleteFramebuffer(gl: WebGL2RenderingContext, framebuffer: Framebuffer): void {
        const {internalFramebuffer} = framebuffer;
        if (gl.isFramebuffer(internalFramebuffer)) {
            gl.deleteFramebuffer(internalFramebuffer);
        }
    }

    static deleteRenderbuffer(gl: WebGL2RenderingContext, renderbuffer: Renderbuffer): void {
        const {internalRenderbuffer} = renderbuffer;
        if (gl.isRenderbuffer(internalRenderbuffer)) {
            gl.deleteRenderbuffer(internalRenderbuffer);
        }
    }
}