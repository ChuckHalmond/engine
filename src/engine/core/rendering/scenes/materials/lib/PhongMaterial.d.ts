import { Color, ColorValues } from "../../../../../libs/graphics/colors/Color";
import { SingleTopicMessageSubscriber } from "../../../../../libs/patterns/messaging/brokers/SingleTopicMessageBroker";
import { Texture, TextureProperties } from "../../../webgl/WebGLTextureUtilities";
import { Material, MaterialBase } from "../Material";
export { PhongMaterialPropertyKeys };
export { PhongMaterialProperties };
export { PhongMaterial };
export { PhongMaterialBase };
declare enum PhongMaterialPropertyKeys {
    albedo = 0,
    albedoMap = 1,
    alpha = 2,
    alphaMap = 3,
    displacementMap = 4,
    emissionMap = 5,
    normalMap = 6,
    occlusionMap = 7,
    reflexionMap = 8,
    shininess = 9,
    lightMap = 10,
    specular = 11,
    specularMap = 12,
    specularFactor = 13
}
declare type PhongMaterialProperties = {
    albedo?: Color;
    albedoMap?: Texture;
    alpha?: number;
    alphaMap?: Texture;
    displacementMap?: Texture;
    emissionMap?: Texture;
    lightMap?: Texture;
    normalMap?: Texture;
    occlusionMap?: Texture;
    reflexionMap?: Texture;
    shininess?: number;
    specular?: Color;
    specularMap?: Texture;
    specularFactor?: number;
};
interface PhongMaterial extends Material<PhongMaterialProperties>, PhongMaterialProperties {
    readonly changes: SingleTopicMessageSubscriber<PhongMaterialPropertyKeys>;
}
declare class PhongMaterialBase extends MaterialBase<PhongMaterialProperties> implements PhongMaterial {
    private _changes;
    private static readonly _name;
    private _albedo?;
    private _albedoMap?;
    private _alpha?;
    private _alphaMap?;
    private _displacementMap?;
    private _emissionMap?;
    private _lightMap?;
    private _normalMap?;
    private _occlusionMap?;
    private _reflexionMap?;
    private _shininess?;
    private _specular?;
    private _specularMap?;
    private _specularFactor?;
    constructor(props: PhongMaterialProperties);
    get changes(): SingleTopicMessageSubscriber<PhongMaterialPropertyKeys>;
    get albedo(): Color | undefined;
    updateAlbedo(albedo: ColorValues | undefined): void;
    get albedoMap(): Texture | undefined;
    updateAlbedoMap(albedoMap: TextureProperties | undefined): void;
    get alpha(): number | undefined;
    set alpha(alpha: number | undefined);
    get alphaMap(): Texture | undefined;
    set alphaMap(alphaMap: Texture | undefined);
    get displacementMap(): Texture | undefined;
    set displacementMap(displacementMap: Texture | undefined);
    get emissionMap(): Texture | undefined;
    set emissionMap(emissionMap: Texture | undefined);
    get lightMap(): Texture | undefined;
    set lightMap(lightMap: Texture | undefined);
    get normalMap(): Texture | undefined;
    set normalMap(normalMap: Texture | undefined);
    get occlusionMap(): Texture | undefined;
    set occlusionMap(occlusionMap: Texture | undefined);
    get reflexionMap(): Texture | undefined;
    set reflexionMap(reflexionMap: Texture | undefined);
    get shininess(): number | undefined;
    set shininess(shininess: number | undefined);
    get specular(): Color | undefined;
    set specular(specular: Color | undefined);
    get specularMap(): Texture | undefined;
    set specularMap(specularMap: Texture | undefined);
    get specularFactor(): number | undefined;
    set specularFactor(specularFactor: number | undefined);
    copy(material: PhongMaterialBase): PhongMaterialBase;
    clone(): PhongMaterialBase;
}
