export enum TexturePixelFormat {
    ALPHA = 0x1906,
    RGB = 0x1907,
    RGBA = 0x1908,
    LUMINANCE = 0x1909,
    LUMINANCE_ALPHA = 0x190A,
    DEPTH_COMPONENT = 0x1902,
    DEPTH_STENCIL = 0x84F9,
    RED = 0x1903,
    RG = 0x8227,
    RED_INTEGER = 0x8D94,
    RG_INTEGER = 0x8228,
    RGB_INTEGER = 0x8D98,
    RGBA_INTEGER = 0x8D99
}

export enum TextureInternalPixelFormat {
    DEPTH_COMPONENT16 = 0x81A5,
    DEPTH_COMPONENT24 = 0x81A6,
    DEPTH_COMPONENT32F = 0x8CAC,
    DEPTH24_STENCIL8 = 0x88F0,
    DEPTH32F_STENCIL8 = 0x8CAD,
    R8 = 0x8229,
    R8_SNORM = 0x8F94,
    RG8 = 0x822B,
    RG8_SNORM = 0x8F95,
    RGB8 = 0x8051,
    RGB8_SNORM = 0x8F96,
    RGB565 = 0x8D62,
    RGBA8 = 0x8058,
    RGBA4 = 0x8056,
    RGB5_A1 = 0x8057,
    RGBA8_SNORM = 0x8F97,
    RGB10_A2UI = 0x906F,
    SRGB = 0x8C40,
    SRGB8 = 0x8C41,
    SRGB8_ALPHA8 = 0x8C43,
    R16F = 0x822D,
    RGB16F = 0x881B,
    RGBA16F = 0x881A,
    R32F = 0x822E,
    RG32F = 0x8230,
    RGB32F = 0x8815,
    RGBA32F	= 0x8814,
    R11F_G11F_B10F = 0x8C3A,
    RGB9_E5 = 0x8C3D,
    R8UI = 0x8232,
    R16I = 0x8233,
    R16UI = 0x8234,
    R32I = 0x8235,
    R32UI = 0x8236,
    RG8I = 0x8237,
    RG8UI = 0x8238,
    RG16I = 0x8239,
    RG16UI = 0x823A,
    RG32I = 0x823B,
    RG32UI = 0x823C,
    RGB8I = 0x8D8F,
    RGB8UI = 0x8D7D,
    RGB16I = 0x8D89,
    RGB16UI = 0x8D77,
    RGB32I = 0x8D83,
    RGB32UI = 0x8D71,
    RGBA8I = 0x8D8E,
    RGBA8UI = 0x8D7C,
    RGBA16I = 0x8D88,
    RGBA16UI = 0x8D76,
    RGBA32I = 0x8D82,
    RGBA32UI = 0x8D70,
}

export enum TexturePixelType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
    HALF_FLOAT = 0x140B,
    UNSIGNED_SHORT_4_4_4_4 = 0x8033,
    UNSIGNED_SHORT_5_5_5_1 = 0x8034,
    UNSIGNED_SHORT_5_6_5 = 0x8363,
    UNSIGNED_INT_2_10_10_10_REV = 0x8368,
    UNSIGNED_INT_24_8 = 0x84FA,
    UNSIGNED_INT_10F_11F_11F_REV = 0x8C3B,
    UNSIGNED_INT_5_9_9_9_REV = 0x8C3E,
    FLOAT_32_UNSIGNED_INT_24_8_REV = 0x8DAD,
    INT_2_10_10_10_REV = 0x8D9F
}


export enum TextureParameter {
    TEXTURE_MAG_FILTER = 0x2800,
    TEXTURE_MIN_FILTER = 0x2801,
    TEXTURE_WRAP_S = 0x2802,
    TEXTURE_WRAP_T = 0x2803,
    TEXTURE_BASE_LEVEL = 0x813C,
    TEXTURE_MAX_LEVEL = 0x813D,
    TEXTURE_MAX_LOD = 0x813B,
    TEXTURE_MIN_LOD = 0x813A,
    TEXTURE_WRAP_R = 0x8072,
    TEXTURE_COMPARE_FUNC = 0x884D,
    TEXTURE_COMPARE_MODE = 0x884C
}

export enum TextureTarget {
    TEXTURE_2D = 0x0DE1,
    TEXTURE_CUBE_MAP = 0x8513,
    TEXTURE_3D = 0x806F,
    TEXTURE_2D_ARRAY = 0x8C1A,
    TEXTURE_CUBE_MAP_POSITIVE_X = 0x8515,
    TEXTURE_CUBE_MAP_NEGATIVE_X = 0x8516,
    TEXTURE_CUBE_MAP_POSITIVE_Y = 0x8517,
    TEXTURE_CUBE_MAP_NEGATIVE_Y = 0x8518,
    TEXTURE_CUBE_MAP_POSITIVE_Z = 0x8519,
    TEXTURE_CUBE_MAP_NEGATIVE_Z = 0x851A
}

export enum TextureMagFilter {
    LINEAR = 0x2601,
    NEAREST = 0x2600
}

export enum TextureMinFilter {
    LINEAR = 0x2601,
    NEAREST = 0x2600,
    NEAREST_MIPMAP_NEAREST = 0x2700, 
    LINEAR_MIPMAP_NEAREST = 0x2701, 
    NEAREST_MIPMAP_LINEAR = 0x2702,
    LINEAR_MIPMAP_LINEAR = 0x2703
}

export enum TextureCompareMode {
    COMPARE_REF_TO_TEXTURE = 0x884E,
    NONE = 0
}

export enum TextureWrapMode {
    REPEAT = 0x2901,
    CLAMP_TO_EDGE = 0x812F, 
    MIRRORED_REPEAT = 0x8370
}

export enum TextureCompareFunction {
    NEVER = 0x0200,
    LESS = 0x0201,
    EQUAL = 0x0202,
    LEQUAL = 0x0203,
    GREATER = 0x0204,
    NOTEQUAL = 0x0205,
    GEQUAL = 0x0206,
    ALWAYS = 0x0207
}

export type Texture2DPixels = Uint32Array |  Uint16Array | Uint8Array | TexImageSource | null;

export type TextureCubeMapPixels = {
    xPos: TexImageSource;
    xNeg: TexImageSource;
    yPos: TexImageSource;
    yNeg: TexImageSource;
    zPos: TexImageSource;
    zNeg: TexImageSource;
}

export type TextureParameters = {
    min?: TextureMinFilter;
    mag?: TextureMagFilter;

    wrapS?: TextureWrapMode;
    wrapT?: TextureWrapMode;
    wrapR?: TextureWrapMode;

    baseMipmapLevel?: number;
    maxMipmapLevel?: number;

    minLod?: number;
    maxLod?: number;

    compareFunction?: TextureCompareFunction;
    compareMode?: TextureCompareMode;
}

export type TextureProperties = {
    pixels: Texture2DPixels | TextureCubeMapPixels;
    target: TextureTarget;
    
    subimage?: {
        xoffset: number;
        yoffset: number;
        width: number;
        height: number;
    };

    lod?: number;
    width: number;
    height: number;

    format: TexturePixelFormat;
    internalFormat: TextureInternalPixelFormat;
    type: TexturePixelType;
}

export type Texture = TextureProperties & TextureParameters & {
    unit: number;
    internal: WebGLTexture;
}

export class WebGLTextureUtilities {

    static createTexture(gl: WebGL2RenderingContext, props: TextureProperties & TextureParameters): Texture | null {
        const texture = gl.createTexture();
        
        if (texture === null) {
            console.error("Could not create WebGLTexture.");
            return null;
        }

        const unit = this._allocateUnit(gl);
        if (unit < 0) {
            console.error(`Could not allocate another texture unit. Max (${gl.MAX_TEXTURE_IMAGE_UNITS}) was reached.`);
            return null;
        }

        let tex = {
            unit: unit,
            internal: texture
        } as Texture;

        this.setTextureProperties(gl, tex, props);
        this.setTextureParameters(gl, tex, props);

        return tex;
    }

    static deleteTexture(gl: WebGL2RenderingContext, texture: Texture): void {
        if (gl.isTexture(texture.internal)) {
            gl.deleteTexture(texture.internal);
        }
        this._freeUnit(gl, texture.unit);
    }

    static setTextureProperties(gl: WebGL2RenderingContext, texture: Texture, props: TextureProperties): void {

        const activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        if (activeTexture !== texture.unit) {
            gl.activeTexture(gl.TEXTURE0 + texture.unit);
            gl.bindTexture(props.target, texture.internal);
        }

        const lod = props.lod ?? 0;

        const pixels = props.pixels;
        if (pixels == null) {
            gl.texImage2D(props.target, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, null);
        }
        else {
            if ("xPos" in pixels) {
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_X, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, pixels.xPos as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, pixels.xNeg as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, pixels.yPos as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, pixels.yNeg as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, pixels.zPos as any);
                gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, pixels.zNeg as any);
            }
            else {
                if (typeof props.subimage !== "undefined") {
                    gl.texImage2D(props.target, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, props.pixels as ArrayBufferView);
                    gl.texSubImage2D(props.target, lod, props.subimage.xoffset, props.subimage.yoffset, props.subimage.width, props.subimage.height, props.format, props.type, props.pixels as any);
                }
                else {
                    gl.texImage2D(props.target, lod, props.internalFormat, props.width, props.height, 0, props.format, props.type, props.pixels as ArrayBufferView);
                }
            }
            gl.generateMipmap(props.target);
        }

        Object.assign(
            texture, {
            pixels: props.pixels,
            target: props.target,
            subimage: props.subimage,
            lod: props.lod,
            width: props.width,
            height: props.height,
            format: props.format,
            internalFormat: props.internalFormat,
            type: props.type
        });
    }

    static setTextureParameters(gl: WebGL2RenderingContext, texture: Texture, param: TextureParameters): void {

        const activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        if (activeTexture !== texture.unit) {
            gl.activeTexture(gl.TEXTURE0 + texture.unit);
            gl.bindTexture(texture.target, texture.internal);
        }

        if (typeof param.min !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_MIN_FILTER, param.min);
        if (typeof param.mag !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_MAG_FILTER, param.mag);
        if (typeof param.wrapS !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_WRAP_S, param.wrapS);
        if (typeof param.wrapT !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_WRAP_T, param.wrapT);
        if (typeof param.wrapR !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_WRAP_R, param.wrapR);
        if (typeof param.baseMipmapLevel !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_BASE_LEVEL, param.baseMipmapLevel);
        if (typeof param.maxMipmapLevel !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_MAX_LEVEL, param.maxMipmapLevel);
        if (typeof param.compareFunction !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_COMPARE_FUNC, param.compareFunction);
        if (typeof param.compareMode !== "undefined")
            gl.texParameteri(texture.target, TextureParameter.TEXTURE_COMPARE_MODE, param.compareMode);
        if (typeof param.minLod !== "undefined")
            gl.texParameterf(texture.target, TextureParameter.TEXTURE_MIN_LOD, param.minLod);
        if (typeof param.maxLod !== "undefined")
            gl.texParameterf(texture.target, TextureParameter.TEXTURE_MAX_LOD, param.maxLod);

        Object.assign(texture, {
            min: param.min,
            mag: param.mag,
            wrapS: param.wrapS,
            wrapT: param.wrapT,
            wrapR: param.wrapR,
            baseMipmapLevel: param.baseMipmapLevel,
            maxMipmapLevel: param.maxMipmapLevel,
            compareFunction: param.compareFunction,
            compareMode: param.compareMode,
            minLod: param.minLod,
            maxLod: param.maxLod
        });
    }
    
    private static _units: Map<WebGL2RenderingContext, boolean[]> = new Map();

    private static _freeUnit(gl: WebGL2RenderingContext, unit: number): number | null {
        const units = this._units.get(gl);
        if (typeof units !== "undefined") {
            if (units.length < 0) {
                units[unit] = false;
            }
        }
        return null;
    }

    private static _allocateUnit(gl: WebGL2RenderingContext): number {
        const maxUnits = gl.MAX_TEXTURE_IMAGE_UNITS;
        let units = this._units.get(gl);
        if (typeof units === "undefined") {
            units = new Array(maxUnits);
            this._units.set(gl, units);
        }
        for (let i = 1; i < maxUnits; i++) {
            if (!units[i]) {
                units[i] = true;
                return i;
            }
        }
        return -1;
    }
}