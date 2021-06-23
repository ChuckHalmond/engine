import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
import { CameraBase, Camera } from "./Camera";

export class OrthographicCamera extends CameraBase {
    
    constructor(
        left: number = 0,
        width: number = 0,
        height: number = 400,
        top: number = 400,
        near: number = 400,
        far: number = -400) {
        
        super(new Matrix4().asOrthographic(left, left + width, top + height, top, near, far));
    }

    public setValues(
        left: number = 0,
        width: number = 0,
        height: number = 400,
        top: number = 400,
        near: number = 400,
        far: number = -400): Camera {
        
        this._projection.asOrthographic(left, left + width, top + height, top, near, far);
        this.updateFrustrum();
        return this;
    }
}