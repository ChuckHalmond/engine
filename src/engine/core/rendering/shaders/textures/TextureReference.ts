import { TextureProperties } from "../../webgl/WebGLTextureUtilities";
import { Texture } from "./Texture";

export interface ITextureReference {
    readonly texture: Texture;
    getProperties(): TextureProperties;
    getDeltaProperties(): Partial<TextureProperties> | null;
    subscribeDelta(): void;
    unsubscribeDelta(): void;
}

export class TextureReference {
    readonly texture: Texture;
    
    private constructor(texture: Texture) {
        this.texture = texture;
    }

    private static _instances: Map<string, TextureReference> = new Map<string, TextureReference>();

    static getInstance(texture: Texture): TextureReference {
        let reference = TextureReference._instances.get(texture.uuid);
        if (typeof reference !== 'undefined') {
            return reference;
        }
        else {
            const instance = new TextureReference(texture);
            TextureReference._instances.set(texture.uuid, instance);
            return instance;
        }
    }
}