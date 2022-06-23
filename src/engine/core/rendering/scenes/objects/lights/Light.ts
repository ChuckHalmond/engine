
import { Color } from "../../../../../libs/graphics/colors/Color";
import { Mesh } from "../meshes/Mesh";
import { Object3D, Object3DBase } from "../Object3D";

export { LightProperties };
export { Light };
export { LightBase };

enum LightProperties {
    color
}

interface Light extends Object3D {
    readonly isLight: true;
    color: Color;
    isLightingOn(mesh: Mesh): boolean;
}

abstract class LightBase extends Object3DBase {
    readonly isLight: true;
    private _color: Color;
    
    constructor(color: Color) {
        super();
        this.isLight = true;
        this._color = color.clone();
    }

    get color(): Color {
        return this._color;
    }
    
    set color(color: Color) {
        this._color = color;
    }

    abstract isLightingOn(mesh: Mesh): boolean;
}