import { Color, ColorValues } from "../../../../../libs/graphics/colors/Color";
import { SingleTopicMessageSubscriber, SingleTopicMessageBroker } from "../../../../../libs/patterns/messaging/brokers/SingleTopicMessageBroker";
import { Texture, TextureProperties } from "../../../webgl/WebGLTextureUtilities";
import { Material, MaterialBase } from "../Material";

export { PhongMaterialPropertyKeys };
export { PhongMaterialProperties };
export { PhongMaterial };
export { PhongMaterialBase };

enum PhongMaterialPropertyKeys {
    albedo,
    albedoMap,
    alpha,
    alphaMap,
    displacementMap,
    emissionMap,
    normalMap,
    occlusionMap,
    reflexionMap,
    shininess,
    lightMap,
    specular,
    specularMap,
    specularFactor
}

type PhongMaterialProperties = {
    albedo?: Color;
    albedoMap?: Texture;

    alpha?: number;
    alphaMap?: Texture;

    displacementMap?: Texture; // faking 'z' vertex value
    emissionMap?: Texture; // => bloom, emission of light around the object, FRAMEBUFFERED
    lightMap?: Texture; // => baked, areas that are in shadows or in light because of the scene directional and ambient lights, FRAMEBUFFERED

    normalMap?: Texture; // => for dynamic lighting (relative to the light source position)
    occlusionMap?: Texture; // => constant, areas that are hard to reach for ambient lighting
    
    reflexionMap?: Texture; // => environment reflextive areas, FRAMEBUFFERED (CubeMap)

    shininess?: number;

    specular?: Color;
    specularMap?: Texture;
    specularFactor?: number;
}

interface PhongMaterial extends Material<PhongMaterialProperties>, PhongMaterialProperties {
    readonly changes: SingleTopicMessageSubscriber<PhongMaterialPropertyKeys>;
}

class PhongMaterialBase extends MaterialBase<PhongMaterialProperties> implements PhongMaterial {

    private _changes: SingleTopicMessageBroker<PhongMaterialPropertyKeys>;

    private static readonly _name = 'Phong';

    private _albedo?: Color;
    private _albedoMap?: Texture;

    private _alpha?: number;
    private _alphaMap?: Texture;

    private _displacementMap?: Texture; // faking 'z' vertex value
    private _emissionMap?: Texture; // => bloom, emission of light around the object, FRAMEBUFFERED
    private _lightMap?: Texture; // => baked, areas that are in shadows or in light because of the scene directional and ambient lights, FRAMEBUFFERED

    private _normalMap?: Texture; // => for dynamic lighting (relative to the light source position)
    private _occlusionMap?: Texture; // => constant, areas that are hard to reach for ambient lighting
    
    private _reflexionMap?: Texture; // => environment reflextive areas, FRAMEBUFFERED (CubeMap)

    private _shininess?: number;

    private _specular?: Color;
    private _specularMap?: Texture;
    private _specularFactor?: number;

    constructor(props: PhongMaterialProperties) {
        super(PhongMaterialBase._name);
  
        this._albedo = props.albedo;
        this._albedoMap = props.albedoMap;
        this._alpha = props.alpha;
        this._alphaMap = props.alphaMap;
        this._displacementMap = props.displacementMap;
        this._emissionMap = props.emissionMap;
        this._lightMap = props.lightMap;
        this._normalMap = props.normalMap;
        this._occlusionMap = props.occlusionMap;

        this._reflexionMap = props.reflexionMap;
        this._shininess = props.shininess;
        this._specular = props.specular;
        this._specularMap = props.specularMap;
        this._specularFactor = props.specularFactor;

        this._changes = new SingleTopicMessageBroker();
        this._subscriptions = new Array(Object.keys(PhongMaterialPropertyKeys).length);
    }

    get changes(): SingleTopicMessageSubscriber<PhongMaterialPropertyKeys> {
        return this._changes;
    }

    get albedo(): Color | undefined {
        return this._albedo;
    }

    updateAlbedo(albedo: ColorValues | undefined) {
        if (typeof albedo !== 'undefined') {
            if (typeof this._albedo !== 'undefined') {
                this._albedo.setValues(...albedo);
            }
            else {
                delete this._albedo;
            }
        }
        this._changes.publish(PhongMaterialPropertyKeys.albedo);
    }

    get albedoMap(): Texture | undefined {
        return this._albedoMap;
    }

    updateAlbedoMap(albedoMap: TextureProperties | undefined) {
        
        if (typeof albedoMap !== 'undefined') {
            if (typeof this._albedoMap !== 'undefined') {
                //this._albedoMap.set(albedoMap);
            }
            else {
                delete this._albedoMap;
            }
        }
        else {
            this._changes.unsubscribe(this._subscriptions[PhongMaterialPropertyKeys.albedoMap]);
        }

        this._changes.publish(PhongMaterialPropertyKeys.albedoMap);
    }

    get alpha(): number | undefined {
        return this._alpha;
    }

    set alpha(alpha: number | undefined) {
        this._alpha = alpha;
    }

    get alphaMap(): Texture | undefined {
        return this._alphaMap;
    }

    set alphaMap(alphaMap: Texture | undefined) {
        this._alphaMap = alphaMap;
    }

    get displacementMap(): Texture | undefined {
        return this._displacementMap;
    }

    set displacementMap(displacementMap: Texture | undefined) {
        this._displacementMap = displacementMap;
    }

    get emissionMap(): Texture | undefined {
        return this._emissionMap;
    }

    set emissionMap(emissionMap: Texture | undefined) {
        this._emissionMap = emissionMap;
    }

    get lightMap(): Texture | undefined {
        return this._lightMap;
    }

    set lightMap(lightMap: Texture | undefined) {
        this._lightMap = lightMap;
    }

    get normalMap(): Texture | undefined {
        return this._normalMap;
    }

    set normalMap(normalMap: Texture | undefined) {
        this._normalMap = normalMap;
    }

    get occlusionMap(): Texture | undefined {
        return this._occlusionMap;
    }

    set occlusionMap(occlusionMap: Texture | undefined) {
        this._occlusionMap = occlusionMap;
    }

    get reflexionMap(): Texture | undefined {
        return this._reflexionMap;
    }

    set reflexionMap(reflexionMap: Texture | undefined) {
        this._reflexionMap = reflexionMap;
    }

    get shininess(): number | undefined {
        return this._shininess;
    }

    set shininess(shininess: number | undefined) {
        this._shininess = shininess;
    }

    get specular(): Color | undefined {
        return this._specular;
    }

    set specular(specular: Color | undefined) {
        this._specular = specular;
    }

    get specularMap(): Texture | undefined {
        return this._specularMap;
    }

    set specularMap(specularMap: Texture | undefined) {
        this._specularMap = specularMap;
    }

    get specularFactor(): number | undefined {
        return this._specularFactor;
    }

    set specularFactor(specularFactor: number | undefined) {
        this._specularFactor = specularFactor;
    }

    copy(material: PhongMaterialBase): PhongMaterialBase {
        this._albedo = material._albedo;
        this._albedoMap = material._albedoMap;
        this._alpha = material._alpha;
        this._alphaMap = material._alphaMap;
        this._displacementMap = material._displacementMap;
        this._emissionMap = material._emissionMap;
        this._lightMap = material._lightMap;
        this._normalMap = material._normalMap;
        this._occlusionMap = material._occlusionMap;

        this._reflexionMap = material._reflexionMap;
        this._shininess = material._shininess;
        this._specular = material._specular;
        this._specularMap = material._specularMap;
        this._specularFactor = material._specularFactor;

        return this;
    }
    
    clone(): PhongMaterialBase {
        return new PhongMaterialBase(this);
    }

}