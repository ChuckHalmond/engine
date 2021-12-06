import { TextureProperties } from "../../webgl/WebGLTextureUtilities";
import { Texture } from "./Texture";
export interface ITextureReference {
    readonly texture: Texture;
    getProperties(): TextureProperties;
    getDeltaProperties(): Partial<TextureProperties> | null;
    subscribeDelta(): void;
    unsubscribeDelta(): void;
}
export declare class TextureReference {
    readonly texture: Texture;
    private constructor();
    private static _instances;
    static getInstance(texture: Texture): TextureReference;
}
