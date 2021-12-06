import { PixelFormat, TextureTarget, PixelType, TextureMinFilter, TextureMagFilter, TextureWrapMode } from "./WebGLConstants";
export { TexturePixels };
export { Texture2DPixels };
export { TextureCubeMapPixels };
export { TextureReference };
export { TextureProperties };
export { TexturePartialProperties };
export { TextureBinding };
export { Texture };
export { TexturesUnitsContext };
export { WebGLTextureUtilities };
declare type TexturePixels = number[] | ArrayBufferView | TexImageSource | null;
declare type Texture2DPixels = TexturePixels;
declare type TextureCubeMapPixels = {
    xPos: TexImageSource;
    xNeg: TexImageSource;
    yPos: TexImageSource;
    yNeg: TexImageSource;
    zPos: TexImageSource;
    zNeg: TexImageSource;
};
declare type TextureReference = {
    glTex: WebGLTexture;
};
declare type TextureProperties = {
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
};
declare type TexturePartialProperties = Required<Pick<TextureProperties, 'pixels'>> & Partial<TextureProperties>;
declare type TextureBinding = {
    unit: number;
};
declare type Texture = TextureProperties & TextureReference & TextureBinding;
declare type TexturesUnitsContext = {
    maxTextureUnits: number;
    registeredTextureUnits: Array<boolean>;
};
declare class WebGLTextureUtilities {
    private constructor();
    static createBindingsContext(gl: WebGL2RenderingContext): TexturesUnitsContext;
    static createTexture(gl: WebGL2RenderingContext, ctx: TexturesUnitsContext, props: TextureProperties): Texture | null;
    static deleteTexture(gl: WebGL2RenderingContext, ctx: TexturesUnitsContext, tex: Texture): void;
    static setTexture(gl: WebGL2RenderingContext, tex: Texture): void;
    static setTextureParameters(gl: WebGL2RenderingContext, tex: Texture): void;
    static bindTexture(gl: WebGL2RenderingContext, tex: Texture): void;
    static guessTextureProperties(tex: TexturePartialProperties): TextureProperties;
    static getNumBytesFromPixelTypeAndFormat(type: PixelType, format: PixelFormat): number;
    static getNumChannelsFromPixelFormat(format: PixelFormat): number;
    private static _allocateTextureUnit;
    private static _freeTextureUnit;
}
