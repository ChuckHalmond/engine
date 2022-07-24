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
    ALPHA = 0x1906,
    RGB = 0x1907,
    RGBA = 0x1908,
    LUMINANCE = 0x1909,
    LUMINANCE_ALPHA = 0x190A,
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

export type Texture2DPixels = Uint32Array |  Uint16Array | Uint8Array | TexImageSource;

export type TextureCubeMapPixels = {
    xPos: TexImageSource;
    xNeg: TexImageSource;
    yPos: TexImageSource;
    yNeg: TexImageSource;
    zPos: TexImageSource;
    zNeg: TexImageSource;
}

export type TextureProperties = {
    target: TextureTarget;
    pixels: Texture2DPixels | TextureCubeMapPixels | null;
    width: number;
    height: number;
    format: TexturePixelFormat;
    internalFormat: TextureInternalPixelFormat;
    type: TexturePixelType;

    depth?: number;
    lod?: number;
    border?: number;

    subimages?: {
        pixels: Texture2DPixels;
        xoffset: number;
        yoffset: number;
        zoffset?: number;
        width: number;
        height: number;
        depth?: number;
    }[];

    mipmap?: boolean;
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

export type Texture = {
    name: string;
    unit: number;
    internalTexture: WebGLTexture;
    properties?: TextureProperties;
}

export class WebGLTextureUtilities {

    static #textureUnits: Map<string, number> = new Map();


    static getTexturesUnitsEntries(): IterableIterator<[string, number]> {
        return this.#textureUnits.entries();
    }

    static createTexture(gl: WebGL2RenderingContext, name: string, properties: TextureProperties): Texture | null {
        const internalTexture = gl.createTexture();
        if (internalTexture === null) {
            return null;
        }

        let unit = this.#textureUnits.get(name);
        if (unit == undefined) {
            unit = Math.max(-1, ...this.#textureUnits.values()) + 1;
            this.#textureUnits.set(name, unit);
        }

        const {pixels, target, subimages, width, height, format, internalFormat, type} = properties;
        let {lod, border, depth, mipmap} = properties;

        lod = lod ?? 0;
        border = border ?? 0;
        depth = depth ?? 0;
        mipmap = mipmap ?? true;

        const activeTexture = gl.getParameter(gl.ACTIVE_TEXTURE);
        if (activeTexture !== unit) {
            gl.activeTexture(gl.TEXTURE0 + unit);
            gl.bindTexture(target, internalTexture);
        }
        
        switch (target) {
            case TextureTarget.TEXTURE_2D: {
                gl.texImage2D(target, lod, internalFormat, width, height, border, format, type, <ArrayBufferView | null>pixels);
                if (subimages) {
                    subimages.forEach((subimage_i) => {
                        const {xoffset, yoffset, width, height, pixels} = subimage_i;
                        gl.texSubImage2D(target, lod!, xoffset, yoffset, width, height, format, type, pixels as ArrayBufferView);
                    });
                }
                break;
            }
            case TextureTarget.TEXTURE_CUBE_MAP: {
                if (pixels === null) {
                    gl.texImage2D(target, lod, internalFormat, width, height, border, format, type, null);  
                }
                else {
                    if ("xPos" in pixels) {
                        const {xPos, xNeg, yPos, yNeg, zPos, zNeg} = pixels;
                        gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_X, lod, internalFormat, width, height, border, format, type, xPos);
                        gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_X, lod, internalFormat, width, height, border, format, type, xNeg);
                        gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Y, lod, internalFormat, width, height, border, format, type, yPos);
                        gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Y, lod, internalFormat, width, height, border, format, type, yNeg);
                        gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_POSITIVE_Z, lod, internalFormat, width, height, border, format, type, zPos);
                        gl.texImage2D(TextureTarget.TEXTURE_CUBE_MAP_NEGATIVE_Z, lod, internalFormat, width, height, border, format, type, zNeg);
                    }
                }
                break;
            }
            case TextureTarget.TEXTURE_2D_ARRAY: {
                gl.texImage3D(target, lod, internalFormat, width, height,  depth, border, format, type, <ArrayBufferView | null>pixels);
                if (subimages) {
                    subimages.forEach((subimage_i, i) => {
                        const {xoffset, yoffset, zoffset, width, height, depth, pixels} = subimage_i;
                        gl.texSubImage3D(target, lod!, xoffset, yoffset, zoffset!, width, height, depth!, format, type, pixels as ArrayBufferView);
                    });
                }
                break;
            }
        }
        if (mipmap) {
            gl.generateMipmap(target);
        }

        const {min, mag, wrapS, wrapT, wrapR, baseMipmapLevel, maxMipmapLevel, compareFunction, compareMode, minLod, maxLod} = properties;

        if (min !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_MIN_FILTER, min);
        if (mag !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_MAG_FILTER, mag);
        if (wrapS  !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_WRAP_S, wrapS);
        if (wrapT !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_WRAP_T, wrapT);
        if (wrapR !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_WRAP_R, wrapR);
        if (baseMipmapLevel !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_BASE_LEVEL, baseMipmapLevel);
        if (maxMipmapLevel !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_MAX_LEVEL, maxMipmapLevel);
        if (compareFunction !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_COMPARE_FUNC, compareFunction);
        if (compareMode !== undefined)
            gl.texParameteri(target, TextureParameter.TEXTURE_COMPARE_MODE, compareMode);
        if (minLod !== undefined)
            gl.texParameterf(target, TextureParameter.TEXTURE_MIN_LOD, minLod);
        if (maxLod !== undefined)
            gl.texParameterf(target, TextureParameter.TEXTURE_MAX_LOD, maxLod);
        
        return {
            unit,
            internalTexture,
            name,
            properties: {
                pixels,
                target,
                subimages,
                lod,
                width,
                height,
                format,
                internalFormat,
                type,
                min,
                mag,
                wrapS,
                wrapT,
                wrapR,
                baseMipmapLevel,
                maxMipmapLevel,
                compareFunction,
                compareMode,
                minLod,
                maxLod
            }
        };
    }

    static setUnpackAlignment(gl: WebGL2RenderingContext, alignment: number): void {
        gl.pixelStorei(gl.UNPACK_ALIGNMENT, alignment);
    }

    static deleteTexture(gl: WebGL2RenderingContext, texture: Texture): void {
        const {internalTexture, name} = texture;
        if (gl.isTexture(internalTexture)) {
            gl.deleteTexture(internalTexture);
            this.#textureUnits.delete(name);
        }
    }
}