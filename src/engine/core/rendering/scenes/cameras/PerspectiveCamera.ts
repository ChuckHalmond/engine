import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { CameraBase } from "./Camera";

export class PerspectiveCamera extends CameraBase {
    
    constructor(
        fov: number,
        aspect: number,
        zNear: number,
        zFar: number) {
        super(Matrix4.perspective(fov, aspect, zNear, zFar));
    }

    setValues(
        fov: number,
        aspect: number,
        zNear: number,
        zFar: number): PerspectiveCamera
    {
        this._projection.setPerspective(fov, aspect, zNear, zFar);
        this.updateFrustrum();
        return this;
    }
}