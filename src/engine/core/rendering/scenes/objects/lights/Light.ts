
import { Color } from "../../../../../libs/graphics/colors/Color";
import { Mesh } from "../meshes/Mesh";
import { Object3D, Object3DBase } from "../Object3D";

export { LightProperties };
export { Light };
export { isLight };
export { LightBase };

enum LightProperties {
    color
}

interface Light extends Object3D {
    readonly isLight: true;
    color: Color;
    isLightingOn(mesh: Mesh): boolean;
}

function isLight(obj: any): obj is Light {
    const light = (obj as Light);
    return light.isObject3D && light.isLight;
}

abstract class LightBase extends Object3DBase {
    public readonly isLight: true;
    private _color: Color;
    
    constructor(color: Color) {
        super();
        this.isLight = true;
        this._color = color.clone();
    }

    public get color(): Color {
        return this._color;
    }
    
    public set color(color: Color) {
        this._color = color;
    }

    public abstract isLightingOn(mesh: Mesh): boolean;
}