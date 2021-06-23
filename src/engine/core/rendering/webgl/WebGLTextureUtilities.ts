import { TextureParameter, PixelFormat, TextureTarget, PixelType, TextureMinFilter, TextureMagFilter, TextureWrapMode, TextureUnits } from "./WebGLConstants";

export { TexturePixels };
export { Texture2DPixels };
export { TextureCubeMapPixels };
export { TextureReference };
export { TextureProperties };
export { TexturePartialProperties };
export { TextureBinding };
export { Texture };
export { TexturesUnitsContext};
export { WebGLTextureUtilities};

type TexturePixels = number[] | ArrayBufferView | TexImageSource | null;

type Texture2DPixels = TexturePixels;
type TextureCubeMapPixels = {
    xPos: TexImageSource;
    xNeg: TexImageSource;
    yPos: TexImageSource;
    yNeg: TexImageSource;
    zPos: TexImageSource;
    zNeg: TexImageSource;
}

type TextureReference = {
    glTex: WebGLTexture;
}

type TextureProperties = {
    target: TextureTarget;

    pixels: Texture2DPixels | TextureCubeMapPixels;
    
    subimage?: {
        xoffset: number;
        yoffset: number;
        width: number;
        height: number;
    };

    lod: number;
    width: number;
    height: number;

    format: PixelFormat;
    internalFormat?: PixelFormat;
    type: PixelType;

    min?: TextureMinFilter;
    mag?: TextureMagFilter;

    wrapS?: TextureWrapMode;
    wrapT?: TextureWrapMode;
    wrapR?: TextureWrapMode;

    baseLod?: number;
    maxLod?: number;
}

type TexturePartialProperties = Required<Pick<TextureProperties, 'pixels'>> & Partial<TextureProperties>;

type TextureBinding = {
    unit: number;
}

type Texture = TextureProperties & TextureReference & TextureBinding;

type TexturesUnitsContext = {
    maxTextureUnits: number;
    registeredTextureUnits: Array<boolean>;
}

class WebGLTextureUtilities {

    private constructor() {}

    public static createBindingsContext(gl: WebGL2RenderingContext): TexturesUnitsContext {
        const maxTextureUnits = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS);
        const registeredTextureUnits = new Array<boolean>(maxTextureUnits);

        return {
            maxTextureUnits: maxTextureUnits,
            registeredTextureUnits: registeredTextureUnits
        }
    }

    public static createTexture(gl: WebGL2RenderingContext, ctx: TexturesUnitsContext, props: TextureProperties): Texture | null {
        const glTex = gl.createTexture();
        
        if (glTex === null) {
            console.error(`Could not create WebGLTexture.`);
            return null;
        }

        const unit = this._allocateTextureUnit(ctx);
        if (unit < 0) {
            console.error(`Could not allocate another texture unit.`);
            return null;
        }

        const tex = {
            ...props,
            unit: unit,
            glTex: glTex
        } as Texture;

        this.setTexture(gl, tex);

        return tex;
    }

    public static deleteTexture(gl: WebGL2RenderingContext, ctx: TexturesUnitsContext, tex: Texture): void {
        gl.deleteTexture(tex.glTex);
        this._freeTextureUnit(ctx, tex.unit);
    }

    public static setTexture(gl: WebGL2RenderingContext, tex: Texture): void {
        
        gl.activeTexture(TextureUnits.TEXTURE0 + tex.unit);
        gl.bindTexture(tex.target, tex.glTex);

        this.setTextureParameters(gl, tex);

        const pixels = tex.pixels;
        const internalFormat = tex.internalFormat || tex.format;
        if (pixels == null) {
            gl.texImage2D(tex.target, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, null);
        }
        else {
            if ('xPos' in pixels) {
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_X, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.xPos as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.xNeg as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.yPos as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.yNeg as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.zPos as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, pixels.zNeg as any);
            }
            else {
                if (typeof tex.subimage !== 'undefined') {
                    gl.texImage2D(tex.target, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, tex.pixels as ArrayBufferView);
                    gl.texSubImage2D(tex.target, tex.lod, tex.subimage.xoffset, tex.subimage.yoffset, tex.subimage.width, tex.subimage.height, tex.format, tex.type, tex.pixels as any);
                }
                else {
                    gl.texImage2D(tex.target, tex.lod, internalFormat, tex.width, tex.height, 0, tex.format, tex.type, tex.pixels as ArrayBufferView);
                }
            }
            gl.generateMipmap(tex.target);
        }
    }

    public static setTextureParameters(gl: WebGL2RenderingContext, tex: Texture): void {

        gl.activeTexture(TextureUnits.TEXTURE0 + tex.unit);
        gl.bindTexture(tex.target, tex.glTex);

        if (typeof tex.min !== 'undefined')
            gl.texParameteri(tex.target, TextureParameter.TEXTURE_MIN_FILTER, tex.min);
        if (typeof tex.mag !== 'undefined')
            gl.texParameteri(tex.target, TextureParameter.TEXTURE_MAG_FILTER, tex.mag);
        if (typeof tex.wrapS !== 'undefined')
            gl.texParameteri(tex.target, TextureParameter.TEXTURE_WRAP_S, tex.wrapS);
        if (typeof tex.wrapT !== 'undefined')
            gl.texParameteri(tex.target, TextureParameter.TEXTURE_WRAP_T, tex.wrapT);
        if (typeof tex.wrapR !== 'undefined')
            gl.texParameteri(tex.target, TextureParameter.TEXTURE_WRAP_R, tex.wrapR);
        if (typeof tex.baseLod !== 'undefined')
            gl.texParameteri(tex.target, TextureParameter.TEXTURE_BASE_LEVEL, tex.baseLod);
        if (typeof tex.maxLod !== 'undefined')
            gl.texParameteri(tex.target, TextureParameter.TEXTURE_MAX_LEVEL, tex.maxLod);
    }

    public static bindTexture(gl: WebGL2RenderingContext, tex: Texture): void {
        gl.bindTexture(tex.target, tex.glTex);
    }

    public static guessTextureProperties(tex: TexturePartialProperties): TextureProperties {

        if (typeof tex.target === 'undefined')
            tex.target = TextureTarget.TEXTURE_2D;
        
        if (typeof tex.format === 'undefined')
            tex.format = PixelFormat.RGBA;

        if (typeof tex.type === 'undefined')
            tex.type = PixelType.UNSIGNED_BYTE;

        if (typeof tex.lod === 'undefined')
            tex.lod = 0;

        if (typeof tex.pixels === 'undefined')
            tex.pixels = null;

        const pixels = tex.pixels;
        if (pixels !== null) {
            if ('xPos' in pixels) {
                tex.target = TextureTarget.TEXTURE_CUBE_MAP;
                tex.width = pixels.xPos.width;
                tex.height = pixels.xPos.height;
            }
            else {
                tex.target = TextureTarget.TEXTURE_2D;
                if ('width' in pixels) {
                    tex.width = pixels.width;
                    tex.height = pixels.height;
                }
                else {
                    let length = 0;

                    if (pixels instanceof Uint8Array || Array.isArray(pixels)) {
                        tex.type = PixelType.UNSIGNED_BYTE;
                        length = pixels.length;
                    }
                    else if (pixels instanceof Uint16Array) {
                        tex.type = PixelType.UNSIGNED_SHORT_4_4_4_4;
                        length = pixels.length;
                    }
                    else if (pixels instanceof Uint32Array) {
                        tex.type = PixelType.UNSIGNED_INT;
                        length = pixels.length;
                    }
                    else if (pixels instanceof Float32Array) {
                        tex.type = PixelType.FLOAT;
                        length = pixels.length;
                    }
                    
                    const channels = this.getNumChannelsFromPixelFormat(tex.format);
                    const numPixels = length / channels;
                    const texSize = Math.sqrt(numPixels);
        
                    tex.width = texSize;
                    tex.height = texSize;
                }
            }
        }

        return tex as TextureProperties;
    }

    public static getNumBytesFromPixelTypeAndFormat(type: PixelType, format: PixelFormat): number {
        switch (format) {
            case PixelFormat.LUMINANCE:
            case PixelFormat.ALPHA:
                return 1;
            case PixelFormat.LUMINANCE_ALPHA:
                return 2;
            case PixelFormat.RGB:
                switch (type) {
                    case PixelType.UNSIGNED_BYTE:
                        return 3;
                    case PixelType.UNSIGNED_SHORT_5_6_5:
                        return 2;
                }
            case PixelFormat.RGBA:
                switch (type) {
                    case PixelType.UNSIGNED_BYTE:
                        return 4;
                    case PixelType.UNSIGNED_SHORT_4_4_4_4:
                    case PixelType.UNSIGNED_SHORT_5_5_5_1:
                        return 2;
                }
            default:
                return 4;
        }
    }

    public static getNumChannelsFromPixelFormat(format: PixelFormat): number {
        switch (format) {
            case PixelFormat.LUMINANCE:
            case PixelFormat.ALPHA:
                return 1;
            case PixelFormat.LUMINANCE_ALPHA:
                return 2;
            case PixelFormat.RGB:
                return 3;
            case PixelFormat.RGBA:
                return 4;
            default:
                return 4;
        }
    }
    
    private static _allocateTextureUnit(ctx: TexturesUnitsContext): number {
        for (let unit = 0; unit < ctx.maxTextureUnits; unit++) {
            if (!ctx.registeredTextureUnits[unit]) {
                ctx.registeredTextureUnits[unit] = true;
                return unit;
            }
        }
        return -1;
    }

    private static _freeTextureUnit(ctx: TexturesUnitsContext, unit: number): void {
        ctx.registeredTextureUnits[unit] = false;
    }
}