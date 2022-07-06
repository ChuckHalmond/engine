export declare enum TexturePixelFormat {
    ALPHA = 6406,
    RGB = 6407,
    RGBA = 6408,
    LUMINANCE = 6409,
    LUMINANCE_ALPHA = 6410,
    DEPTH_COMPONENT = 6402,
    DEPTH_STENCIL = 34041,
    RED = 6403,
    RG = 33319,
    RED_INTEGER = 36244,
    RG_INTEGER = 33320,
    RGB_INTEGER = 36248,
    RGBA_INTEGER = 36249
}
export declare enum TextureInternalPixelFormat {
    ALPHA = 6406,
    RGB = 6407,
    RGBA = 6408,
    LUMINANCE = 6409,
    LUMINANCE_ALPHA = 6410,
    DEPTH_COMPONENT16 = 33189,
    DEPTH_COMPONENT24 = 33190,
    DEPTH_COMPONENT32F = 36012,
    DEPTH24_STENCIL8 = 35056,
    DEPTH32F_STENCIL8 = 36013,
    R8 = 33321,
    R8_SNORM = 36756,
    RG8 = 33323,
    RG8_SNORM = 36757,
    RGB8 = 32849,
    RGB8_SNORM = 36758,
    RGB565 = 36194,
    RGBA8 = 32856,
    RGBA4 = 32854,
    RGB5_A1 = 32855,
    RGBA8_SNORM = 36759,
    RGB10_A2UI = 36975,
    SRGB = 35904,
    SRGB8 = 35905,
    SRGB8_ALPHA8 = 35907,
    R16F = 33325,
    RGB16F = 34843,
    RGBA16F = 34842,
    R32F = 33326,
    RG32F = 33328,
    RGB32F = 34837,
    RGBA32F = 34836,
    R11F_G11F_B10F = 35898,
    RGB9_E5 = 35901,
    R8UI = 33330,
    R16I = 33331,
    R16UI = 33332,
    R32I = 33333,
    R32UI = 33334,
    RG8I = 33335,
    RG8UI = 33336,
    RG16I = 33337,
    RG16UI = 33338,
    RG32I = 33339,
    RG32UI = 33340,
    RGB8I = 36239,
    RGB8UI = 36221,
    RGB16I = 36233,
    RGB16UI = 36215,
    RGB32I = 36227,
    RGB32UI = 36209,
    RGBA8I = 36238,
    RGBA8UI = 36220,
    RGBA16I = 36232,
    RGBA16UI = 36214,
    RGBA32I = 36226,
    RGBA32UI = 36208
}
export declare enum TexturePixelType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    INT = 5124,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
    HALF_FLOAT = 5131,
    UNSIGNED_SHORT_4_4_4_4 = 32819,
    UNSIGNED_SHORT_5_5_5_1 = 32820,
    UNSIGNED_SHORT_5_6_5 = 33635,
    UNSIGNED_INT_2_10_10_10_REV = 33640,
    UNSIGNED_INT_24_8 = 34042,
    UNSIGNED_INT_10F_11F_11F_REV = 35899,
    UNSIGNED_INT_5_9_9_9_REV = 35902,
    FLOAT_32_UNSIGNED_INT_24_8_REV = 36269,
    INT_2_10_10_10_REV = 36255
}
export declare enum TextureParameter {
    TEXTURE_MAG_FILTER = 10240,
    TEXTURE_MIN_FILTER = 10241,
    TEXTURE_WRAP_S = 10242,
    TEXTURE_WRAP_T = 10243,
    TEXTURE_BASE_LEVEL = 33084,
    TEXTURE_MAX_LEVEL = 33085,
    TEXTURE_MAX_LOD = 33083,
    TEXTURE_MIN_LOD = 33082,
    TEXTURE_WRAP_R = 32882,
    TEXTURE_COMPARE_FUNC = 34893,
    TEXTURE_COMPARE_MODE = 34892
}
export declare enum TextureTarget {
    TEXTURE_2D = 3553,
    TEXTURE_CUBE_MAP = 34067,
    TEXTURE_3D = 32879,
    TEXTURE_2D_ARRAY = 35866,
    TEXTURE_CUBE_MAP_POSITIVE_X = 34069,
    TEXTURE_CUBE_MAP_NEGATIVE_X = 34070,
    TEXTURE_CUBE_MAP_POSITIVE_Y = 34071,
    TEXTURE_CUBE_MAP_NEGATIVE_Y = 34072,
    TEXTURE_CUBE_MAP_POSITIVE_Z = 34073,
    TEXTURE_CUBE_MAP_NEGATIVE_Z = 34074
}
export declare enum TextureMagFilter {
    LINEAR = 9729,
    NEAREST = 9728
}
export declare enum TextureMinFilter {
    LINEAR = 9729,
    NEAREST = 9728,
    NEAREST_MIPMAP_NEAREST = 9984,
    LINEAR_MIPMAP_NEAREST = 9985,
    NEAREST_MIPMAP_LINEAR = 9986,
    LINEAR_MIPMAP_LINEAR = 9987
}
export declare enum TextureCompareMode {
    COMPARE_REF_TO_TEXTURE = 34894,
    NONE = 0
}
export declare enum TextureWrapMode {
    REPEAT = 10497,
    CLAMP_TO_EDGE = 33071,
    MIRRORED_REPEAT = 33648
}
export declare enum TextureCompareFunction {
    NEVER = 512,
    LESS = 513,
    EQUAL = 514,
    LEQUAL = 515,
    GREATER = 516,
    NOTEQUAL = 517,
    GEQUAL = 518,
    ALWAYS = 519
}
export declare type Texture2DPixels = Uint32Array | Uint16Array | Uint8Array | TexImageSource | null;
export declare type TextureCubeMapPixels = {
    xPos: TexImageSource;
    xNeg: TexImageSource;
    yPos: TexImageSource;
    yNeg: TexImageSource;
    zPos: TexImageSource;
    zNeg: TexImageSource;
};
export declare type TextureProperties = {
    pixels: Texture2DPixels | TextureCubeMapPixels;
    target: TextureTarget;
    subimage?: {
        xoffset: number;
        yoffset: number;
        zoffset?: number;
        width: number;
        height: number;
        depth?: number;
    };
    border?: number;
    lod?: number;
    width: number;
    height: number;
    depth?: number;
    format: TexturePixelFormat;
    internalFormat: TextureInternalPixelFormat;
    type: TexturePixelType;
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
};
export declare type Texture = {
    name: string;
    unit: number;
    internal: WebGLTexture;
    properties?: TextureProperties;
};
export declare class WebGLTextureUtilities {
    #private;
    static createTexture(gl: WebGL2RenderingContext, name: string): Texture | null;
    static setUnpackAlignment(gl: WebGL2RenderingContext, alignment: number): void;
    static deleteTexture(gl: WebGL2RenderingContext, texture: Texture): void;
    static setTextureProperties(gl: WebGL2RenderingContext, texture: Texture, properties: TextureProperties): void;
}
