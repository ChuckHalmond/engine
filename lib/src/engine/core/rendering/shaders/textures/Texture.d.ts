import { Vector2 } from "../../../../libs/maths/algebra/vectors/Vector2";
import { UUID } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { SingleTopicMessageSubscriber, SingleTopicMessageBroker } from "../../../../libs/patterns/messaging/brokers/SingleTopicMessageBroker";
import { TextureTarget, PixelFormat, PixelType, TextureWrapMode, TextureMinFilter, TextureMagFilter } from "../../webgl/WebGLConstants";
import { TexturePixels } from "../../webgl/WebGLTextureUtilities";
export { TextureProperties };
export { ReadonlyTexture };
export { Texture };
export { BaseTexture };
declare enum TexturePropertyKeys {
    target = 0,
    lod = 1,
    width = 2,
    height = 3,
    pixels = 4,
    format = 5,
    type = 6,
    min = 7,
    mag = 8,
    wrapS = 9,
    wrapT = 10,
    wrapR = 11,
    tiling = 12,
    offset = 13,
    baseLod = 14,
    maxLod = 15,
    unpackAlignment = 16,
    anisotropy = 17,
    flipY = 18
}
declare type TextureProperties = {
    readonly uuid: UUID;
    target: TextureTarget;
    lod: number;
    width: number;
    height: number;
    pixels: TexturePixels | List<TexturePixels>;
    format: PixelFormat;
    type: PixelType;
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrapMode;
    wrapT?: TextureWrapMode;
    wrapR?: TextureWrapMode;
    tiling?: Vector2;
    offset?: Vector2;
    baseLod?: number;
    maxLod?: number;
    unpackAlignment?: number;
    anisotropy?: number;
    flipY?: boolean;
};
declare type TReadonlyTexture = Readonly<Texture>;
interface Texture extends TextureProperties {
}
interface ReadonlyTexture extends TReadonlyTexture {
}
declare class BaseTexture implements Texture {
    readonly uuid: UUID;
    target: TextureTarget;
    lod: number;
    width: number;
    height: number;
    pixels: TexturePixels | List<TexturePixels>;
    format: PixelFormat;
    type: PixelType;
    min?: TextureMinFilter;
    mag?: TextureMagFilter;
    wrapS?: TextureWrapMode;
    wrapT?: TextureWrapMode;
    wrapR?: TextureWrapMode;
    tiling?: Vector2;
    offset?: Vector2;
    baseLod?: number;
    maxLod?: number;
    unpackAlignment?: number;
    anisotropy?: number;
    flipY?: boolean;
    constructor(props: TextureProperties);
}
export declare class TextureWrapper implements Texture {
    internal: Texture;
    get uuid(): UUID;
    constructor(internal: Texture);
    get target(): TextureTarget;
    set target(target: TextureTarget);
    get lod(): number;
    set lod(lod: number);
    get width(): number;
    set width(width: number);
    get height(): number;
    set height(height: number);
    get pixels(): TexturePixels | List<TexturePixels>;
    set pixels(pixels: TexturePixels | List<TexturePixels>);
    get format(): PixelFormat;
    set format(format: PixelFormat);
    get type(): PixelType;
    set type(type: PixelType);
    get min(): TextureMinFilter | undefined;
    set min(min: TextureMinFilter | undefined);
    get mag(): TextureMagFilter | undefined;
    set mag(mag: TextureMagFilter | undefined);
    get wrapS(): TextureWrapMode | undefined;
    set wrapS(wrapS: TextureWrapMode | undefined);
    get wrapT(): TextureWrapMode | undefined;
    set wrapT(wrapT: TextureWrapMode | undefined);
    get wrapR(): TextureWrapMode | undefined;
    set wrapR(wrapR: TextureWrapMode | undefined);
    get tiling(): Vector2 | undefined;
    set tiling(tiling: Vector2 | undefined);
    get offset(): Vector2 | undefined;
    set offset(offset: Vector2 | undefined);
    get baseLod(): number | undefined;
    set baseLod(baseLod: number | undefined);
    get maxLod(): number | undefined;
    set maxLod(maxLod: number | undefined);
    get unpackAlignment(): number | undefined;
    set unpackAlignment(unpackAlignment: number | undefined);
    get anisotropy(): number | undefined;
    set anisotropy(anisotropy: number | undefined);
    get flipY(): boolean | undefined;
    set flipY(flipY: boolean | undefined);
}
export interface IObservableTexture extends Texture {
    internal: Texture;
    readonly changes: SingleTopicMessageSubscriber<TextureProperties>;
}
export declare class ObservableTexture extends TextureWrapper implements Texture {
    readonly changes: SingleTopicMessageBroker<TexturePropertyKeys>;
    constructor(internal: Texture, broker: SingleTopicMessageBroker);
    set target(target: TextureTarget);
    set lod(lod: number);
    set width(width: number);
    set height(height: number);
    set pixels(pixels: TexturePixels | List<TexturePixels>);
    set format(format: PixelFormat);
    set type(type: PixelType);
    set min(min: TextureMinFilter | undefined);
    set mag(mag: TextureMagFilter | undefined);
    set wrapS(wrapS: TextureWrapMode | undefined);
    set wrapT(wrapT: TextureWrapMode | undefined);
    set wrapR(wrapR: TextureWrapMode | undefined);
    set tiling(tiling: Vector2 | undefined);
    set offset(offset: Vector2 | undefined);
    set baseLod(baseLod: number | undefined);
    set maxLod(maxLod: number | undefined);
    set unpackAlignment(unpackAlignment: number | undefined);
    set anisotropy(anisotropy: number | undefined);
    set flipY(flipY: boolean | undefined);
}
