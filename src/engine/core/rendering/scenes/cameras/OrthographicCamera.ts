import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { CameraBase, Camera } from "./Camera";

export class OrthographicCamera extends CameraBase {
    
    constructor(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number) {
        super(Matrix4.orthographic(left, right, bottom, top, near, far));
    }

    setValues(
        left: number,
        right: number,
        bottom: number,
        top: number,
        near: number,
        far: number): Camera {
        
        this.projection.setOrthographic(left, right, bottom, top, near, far);
        this.updateFrustrum();
        return this;
    }
}