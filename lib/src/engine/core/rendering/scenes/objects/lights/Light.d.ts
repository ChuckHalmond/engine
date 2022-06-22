import { Color } from "../../../../../libs/graphics/colors/Color";
import { Mesh } from "../meshes/Mesh";
import { Object3D, Object3DBase } from "../Object3D";
export { LightProperties };
export { Light };
export { LightBase };
declare enum LightProperties {
    color = 0
}
interface Light extends Object3D {
    readonly isLight: true;
    color: Color;
    isLightingOn(mesh: Mesh): boolean;
}
declare abstract class LightBase extends Object3DBase {
    readonly isLight: true;
    private _color;
    constructor(color: Color);
    get color(): Color;
    set color(color: Color);
    abstract isLightingOn(mesh: Mesh): boolean;
}
