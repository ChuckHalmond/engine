
import { Vector2 } from "../../../../libs/maths/algebra/vectors/Vector2";
import { UUID, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { SingleTopicMessageSubscriber, SingleTopicMessageBroker } from "../../../../libs/patterns/messaging/brokers/SingleTopicMessageBroker";
import { Texture2DPixels, TextureCubeMapPixels, TextureMagFilter, TextureMinFilter, TexturePixelFormat, TexturePixelType, TextureTarget, TextureWrapMode } from "../../webgl/WebGLTextureUtilities";

export { TextureProperties };
export { ReadonlyTexture };
export { Texture };
export { BaseTexture };

enum TexturePropertyKeys {
    target,
    lod,
    width,
    height,
    pixels,
    format,
    type,
    min,
    mag,
    wrapS,
    wrapT,
    wrapR,
    tiling,
    offset,
    baseLod,
    maxLod,
    unpackAlignment,
    anisotropy,
    flipY
}

type TextureProperties = {
    readonly uuid: UUID;

    target: TextureTarget;

    lod: number;
    width: number;
    height: number;

    pixels: Texture2DPixels | TextureCubeMapPixels;
    format: TexturePixelFormat;
    type: TexturePixelType;
    
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
}

type TReadonlyTexture = Readonly<Texture>;

interface Texture extends TextureProperties {}

interface ReadonlyTexture extends TReadonlyTexture {};

class BaseTexture implements Texture {
    
    readonly uuid: UUID;

    target: TextureTarget;

    lod: number;
    width: number;
    height: number;

    pixels: Texture2DPixels | TextureCubeMapPixels;
    format: TexturePixelFormat;
    type: TexturePixelType;
    
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

    constructor(props: TextureProperties) {
        this.uuid = UUIDGenerator.newUUID();
        
        this.target = props.target;
    
        this.lod = props.lod;
        this.width = props.width;
        this.height = props.height;

        this.pixels = props.pixels;
        this.format = props.format;
        this.type = props.type;
        
        this.min = props.min;
        this.mag = props.mag;
    
        this.wrapS = props.wrapS;
        this.wrapT = props.wrapT;
        this.wrapR = props.wrapR;
    
        /*this._tiling = props.tiling;
        this._offset = props.offset;*/
    
        this.baseLod = props.baseLod;
        this.maxLod = props.maxLod;
    }
}

export class TextureWrapper implements Texture {
    internal: Texture;

    get uuid(): UUID {
        return this.internal.uuid;
    }

    constructor(internal: Texture) {
        this.internal = internal;
    }

    get target(): TextureTarget {
        return this.internal.target;
    }

    set target(target: TextureTarget) {
        this.internal.target = target;
    }

    get lod(): number {
        return this.internal.lod;
    }

    set lod(lod: number) {
        this.internal.lod = lod;
    }

    get width(): number {
        return this.internal.width;
    }

    set width(width: number) {
        this.internal.width = width;
    }

    get height(): number {
        return this.internal.height;
    }

    set height(height: number) {
        this.internal.height = height;
    }

    get pixels(): Texture2DPixels | TextureCubeMapPixels {
        return this.internal.pixels;
    }

    set pixels(pixels: Texture2DPixels | TextureCubeMapPixels) {
        this.internal.pixels = pixels;
    }

    get format(): TexturePixelFormat {
        return this.internal.format;
    }

    set format(format: TexturePixelFormat) {
        this.internal.format = format;
    }

    get type(): TexturePixelType {
        return this.internal.type;
    }

    set type(type: TexturePixelType) {
        this.internal.type = type;
    }

    get min(): TextureMinFilter | undefined {
        return this.internal.min;
    }

    set min(min: TextureMinFilter | undefined) {
        this.internal.min = min;
    }

    get mag(): TextureMagFilter | undefined {
        return this.internal.mag;
    }

    set mag(mag: TextureMagFilter | undefined) {
        this.internal.mag = mag;
    }

    get wrapS(): TextureWrapMode | undefined {
        return this.internal.wrapS;
    }

    set wrapS(wrapS: TextureWrapMode | undefined) {
        this.internal.wrapS = wrapS;
    }

    get wrapT(): TextureWrapMode | undefined {
        return this.internal.wrapT;
    }

    set wrapT(wrapT: TextureWrapMode | undefined) {
        this.internal.wrapT = wrapT;
    }

    get wrapR(): TextureWrapMode | undefined {
        return this.internal.wrapR;
    }

    set wrapR(wrapR: TextureWrapMode | undefined) {
        this.internal.wrapR = wrapR;
    }

    get tiling(): Vector2 | undefined {
        return this.internal.tiling;
    }

    set tiling(tiling: Vector2 | undefined) {
        this.internal.tiling = tiling;
    }

    get offset(): Vector2 | undefined {
        return this.internal.offset;
    }

    set offset(offset: Vector2 | undefined) {
        this.internal.offset = offset;
    }

    get baseLod(): number | undefined {
        return this.internal.baseLod;
    }

    set baseLod(baseLod: number | undefined) {
        this.internal.baseLod = baseLod;
    }

    get maxLod(): number | undefined {
        return this.internal.maxLod;
    }

    set maxLod(maxLod: number | undefined) {
        this.internal.maxLod = maxLod;
    }

    get unpackAlignment(): number | undefined {
        return this.internal.unpackAlignment;
    }

    set unpackAlignment(unpackAlignment: number | undefined) {
        this.internal.unpackAlignment = unpackAlignment;
    }

    get anisotropy(): number | undefined {
        return this.internal.anisotropy;
    }

    set anisotropy(anisotropy: number | undefined) {
        this.internal.anisotropy = anisotropy;
    }

    get flipY(): boolean | undefined {
        return this.internal.flipY;
    }

    set flipY(flipY: boolean | undefined) {
        this.internal.flipY = flipY;
    }
}

export interface IObservableTexture extends Texture {
    internal: Texture;
    readonly changes: SingleTopicMessageSubscriber<TextureProperties>;
}

export class ObservableTexture extends TextureWrapper implements Texture {
    readonly changes: SingleTopicMessageBroker<TexturePropertyKeys>;
    
    constructor(internal: Texture, broker: SingleTopicMessageBroker) {
        super(internal);
        this.changes = broker;
    }

    set target(target: TextureTarget) {
        this.internal.target = target;
        this.changes.publish(TexturePropertyKeys.target);
    }

    set lod(lod: number) {
        this.internal.lod = lod;
        this.changes.publish(TexturePropertyKeys.lod);
    }

    set width(width: number) {
        this.internal.width = width;
        this.changes.publish(TexturePropertyKeys.width);
    }

    set height(height: number) {
        this.internal.height = height;
        this.changes.publish(TexturePropertyKeys.height);
    }

    set pixels(pixels: Texture2DPixels | TextureCubeMapPixels) {
        this.internal.pixels = pixels;
        this.changes.publish(TexturePropertyKeys.pixels);
    }

    set format(format: TexturePixelFormat) {
        this.internal.format = format;
        this.changes.publish(TexturePropertyKeys.format);
    }

    set type(type: TexturePixelType) {
        this.internal.type = type;
        this.changes.publish(TexturePropertyKeys.type);
    }

    set min(min: TextureMinFilter | undefined) {
        this.internal.min = min;
        this.changes.publish(TexturePropertyKeys.min);
    }

    set mag(mag: TextureMagFilter | undefined) {
        this.internal.mag = mag;
        this.changes.publish(TexturePropertyKeys.mag);
    }

    set wrapS(wrapS: TextureWrapMode | undefined) {
        this.internal.wrapS = wrapS;
        this.changes.publish(TexturePropertyKeys.wrapS);
    }

    set wrapT(wrapT: TextureWrapMode | undefined) {
        this.internal.wrapT = wrapT;
        this.changes.publish(TexturePropertyKeys.wrapT);
    }

    set wrapR(wrapR: TextureWrapMode | undefined) {
        this.internal.wrapR = wrapR;
        this.changes.publish(TexturePropertyKeys.wrapR);
    }

    set tiling(tiling: Vector2 | undefined) {
        this.internal.tiling = tiling;
        this.changes.publish(TexturePropertyKeys.tiling);
    }

    set offset(offset: Vector2 | undefined) {
        this.internal.offset = offset;
        this.changes.publish(TexturePropertyKeys.offset);
    }

    set baseLod(baseLod: number | undefined) {
        this.internal.baseLod = baseLod;
        this.changes.publish(TexturePropertyKeys.baseLod);
    }

    set maxLod(maxLod: number | undefined) {
        this.internal.maxLod = maxLod;
        this.changes.publish(TexturePropertyKeys.maxLod);
    }

    set unpackAlignment(unpackAlignment: number | undefined) {
        this.internal.unpackAlignment = unpackAlignment;
        this.changes.publish(TexturePropertyKeys.unpackAlignment);
    }

    set anisotropy(anisotropy: number | undefined) {
        this.internal.anisotropy = anisotropy;
        this.changes.publish(TexturePropertyKeys.anisotropy);
    }

    set flipY(flipY: boolean | undefined) {
        this.internal.flipY = flipY;
        this.changes.publish(TexturePropertyKeys.flipY);
    }
}
