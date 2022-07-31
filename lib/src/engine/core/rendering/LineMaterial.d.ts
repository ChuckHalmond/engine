import { Color } from "../../libs/graphics/colors/Color";
export { LineMaterial };
interface LineMaterialProperties {
    color?: Color;
}
interface LineMaterialConstructor {
    prototype: LineMaterial;
    new (properties?: LineMaterialProperties): LineMaterial;
}
interface LineMaterial {
    color: Color;
}
declare var LineMaterial: LineMaterialConstructor;
