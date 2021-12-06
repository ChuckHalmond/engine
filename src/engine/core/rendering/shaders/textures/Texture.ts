
import { Vector2 } from "../../../../libs/maths/algebra/vectors/Vector2";
import { UUID, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { SingleTopicMessageSubscriber, SingleTopicMessageBroker } from "../../../../libs/patterns/messaging/brokers/SingleTopicMessageBroker";
import { TextureTarget, PixelFormat, PixelType, TextureWrapMode, TextureMinFilter, TextureMagFilter } from "../../webgl/WebGLConstants";
import { TexturePixels } from "../../webgl/WebGLTextureUtilities";

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
}

type TReadonlyTexture = Readonly<Texture>;

interface Texture extends TextureProperties {}

interface ReadonlyTexture extends TReadonlyTexture {};

class BaseTexture implements Texture {
    
    public readonly uuid: UUID;

    public target: TextureTarget;

    public lod: number;
    public width: number;
    public height: number;

    public pixels: TexturePixels | List<TexturePixels>;
    public format: PixelFormat;
    public type: PixelType;
    
    public min?: TextureMinFilter;
    public mag?: TextureMagFilter;

    public wrapS?: TextureWrapMode;
    public wrapT?: TextureWrapMode;
    public wrapR?: TextureWrapMode;

    public tiling?: Vector2;
    public offset?: Vector2;

    public baseLod?: number;
    public maxLod?: number;

    public unpackAlignment?: number;
    public anisotropy?: number;
    public flipY?: boolean;

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
    public internal: Texture;

    public get uuid(): UUID {
        return this.internal.uuid;
    }

    constructor(internal: Texture) {
        this.internal = internal;
    }

    public get target(): TextureTarget {
        return this.internal.target;
    }

    public set target(target: TextureTarget) {
        this.internal.target = target;
    }

    public get lod(): number {
        return this.internal.lod;
    }

    public set lod(lod: number) {
        this.internal.lod = lod;
    }

    public get width(): number {
        return this.internal.width;
    }

    public set width(width: number) {
        this.internal.width = width;
    }

    public get height(): number {
        return this.internal.height;
    }

    public set height(height: number) {
        this.internal.height = height;
    }

    public get pixels(): TexturePixels | List<TexturePixels> {
        return this.internal.pixels;
    }

    public set pixels(pixels: TexturePixels | List<TexturePixels>) {
        this.internal.pixels = pixels;
    }

    public get format(): PixelFormat {
        return this.internal.format;
    }

    public set format(format: PixelFormat) {
        this.internal.format = format;
    }

    public get type(): PixelType {
        return this.internal.type;
    }

    public set type(type: PixelType) {
        this.internal.type = type;
    }

    public get min(): TextureMinFilter | undefined {
        return this.internal.min;
    }

    public set min(min: TextureMinFilter | undefined) {
        this.internal.min = min;
    }

    public get mag(): TextureMagFilter | undefined {
        return this.internal.mag;
    }

    public set mag(mag: TextureMagFilter | undefined) {
        this.internal.mag = mag;
    }

    public get wrapS(): TextureWrapMode | undefined {
        return this.internal.wrapS;
    }

    public set wrapS(wrapS: TextureWrapMode | undefined) {
        this.internal.wrapS = wrapS;
    }

    public get wrapT(): TextureWrapMode | undefined {
        return this.internal.wrapT;
    }

    public set wrapT(wrapT: TextureWrapMode | undefined) {
        this.internal.wrapT = wrapT;
    }

    public get wrapR(): TextureWrapMode | undefined {
        return this.internal.wrapR;
    }

    public set wrapR(wrapR: TextureWrapMode | undefined) {
        this.internal.wrapR = wrapR;
    }

    public get tiling(): Vector2 | undefined {
        return this.internal.tiling;
    }

    public set tiling(tiling: Vector2 | undefined) {
        this.internal.tiling = tiling;
    }

    public get offset(): Vector2 | undefined {
        return this.internal.offset;
    }

    public set offset(offset: Vector2 | undefined) {
        this.internal.offset = offset;
    }

    public get baseLod(): number | undefined {
        return this.internal.baseLod;
    }

    public set baseLod(baseLod: number | undefined) {
        this.internal.baseLod = baseLod;
    }

    public get maxLod(): number | undefined {
        return this.internal.maxLod;
    }

    public set maxLod(maxLod: number | undefined) {
        this.internal.maxLod = maxLod;
    }

    public get unpackAlignment(): number | undefined {
        return this.internal.unpackAlignment;
    }

    public set unpackAlignment(unpackAlignment: number | undefined) {
        this.internal.unpackAlignment = unpackAlignment;
    }

    public get anisotropy(): number | undefined {
        return this.internal.anisotropy;
    }

    public set anisotropy(anisotropy: number | undefined) {
        this.internal.anisotropy = anisotropy;
    }

    public get flipY(): boolean | undefined {
        return this.internal.flipY;
    }

    public set flipY(flipY: boolean | undefined) {
        this.internal.flipY = flipY;
    }
}

export interface IObservableTexture extends Texture {
    internal: Texture;
    readonly changes: SingleTopicMessageSubscriber<TextureProperties>;
}

export class ObservableTexture extends TextureWrapper implements Texture {
    public readonly changes: SingleTopicMessageBroker<TexturePropertyKeys>;
    
    constructor(internal: Texture, broker: SingleTopicMessageBroker) {
        super(internal);
        this.changes = broker;
    }

    public set target(target: TextureTarget) {
        this.internal.target = target;
        this.changes.publish(TexturePropertyKeys.target);
    }

    public set lod(lod: number) {
        this.internal.lod = lod;
        this.changes.publish(TexturePropertyKeys.lod);
    }

    public set width(width: number) {
        this.internal.width = width;
        this.changes.publish(TexturePropertyKeys.width);
    }

    public set height(height: number) {
        this.internal.height = height;
        this.changes.publish(TexturePropertyKeys.height);
    }

    public set pixels(pixels: TexturePixels | List<TexturePixels>) {
        this.internal.pixels = pixels;
        this.changes.publish(TexturePropertyKeys.pixels);
    }

    public set format(format: PixelFormat) {
        this.internal.format = format;
        this.changes.publish(TexturePropertyKeys.format);
    }

    public set type(type: PixelType) {
        this.internal.type = type;
        this.changes.publish(TexturePropertyKeys.type);
    }

    public set min(min: TextureMinFilter | undefined) {
        this.internal.min = min;
        this.changes.publish(TexturePropertyKeys.min);
    }

    public set mag(mag: TextureMagFilter | undefined) {
        this.internal.mag = mag;
        this.changes.publish(TexturePropertyKeys.mag);
    }

    public set wrapS(wrapS: TextureWrapMode | undefined) {
        this.internal.wrapS = wrapS;
        this.changes.publish(TexturePropertyKeys.wrapS);
    }

    public set wrapT(wrapT: TextureWrapMode | undefined) {
        this.internal.wrapT = wrapT;
        this.changes.publish(TexturePropertyKeys.wrapT);
    }

    public set wrapR(wrapR: TextureWrapMode | undefined) {
        this.internal.wrapR = wrapR;
        this.changes.publish(TexturePropertyKeys.wrapR);
    }

    public set tiling(tiling: Vector2 | undefined) {
        this.internal.tiling = tiling;
        this.changes.publish(TexturePropertyKeys.tiling);
    }

    public set offset(offset: Vector2 | undefined) {
        this.internal.offset = offset;
        this.changes.publish(TexturePropertyKeys.offset);
    }

    public set baseLod(baseLod: number | undefined) {
        this.internal.baseLod = baseLod;
        this.changes.publish(TexturePropertyKeys.baseLod);
    }

    public set maxLod(maxLod: number | undefined) {
        this.internal.maxLod = maxLod;
        this.changes.publish(TexturePropertyKeys.maxLod);
    }

    public set unpackAlignment(unpackAlignment: number | undefined) {
        this.internal.unpackAlignment = unpackAlignment;
        this.changes.publish(TexturePropertyKeys.unpackAlignment);
    }

    public set anisotropy(anisotropy: number | undefined) {
        this.internal.anisotropy = anisotropy;
        this.changes.publish(TexturePropertyKeys.anisotropy);
    }

    public set flipY(flipY: boolean | undefined) {
        this.internal.flipY = flipY;
        this.changes.publish(TexturePropertyKeys.flipY);
    }
}
