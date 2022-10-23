import { Color } from "../../../libs/graphics/colors/Color";
export { WireframeMaterial };
declare global {
    interface Materials {
        "wireframe": WireframeMaterial;
    }
}
interface WireframeMaterialProperties {
    color?: Color;
}
interface WireframeMaterialConstructor {
    prototype: WireframeMaterial;
    new (properties?: WireframeMaterialProperties): WireframeMaterial;
}
interface WireframeMaterial {
    color: Color;
}
declare var WireframeMaterial: WireframeMaterialConstructor;
