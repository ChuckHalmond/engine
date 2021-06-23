import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
import { CameraBase } from "./Camera";

export class PerspectiveCamera extends CameraBase {
    
    constructor(
        fieldOfViewYInRadians: number = Math.PI,
        aspect: number = 1,
        zNear: number = 400,
        zFar: number = -400) {
        
        super(new Matrix4().asPerspective(fieldOfViewYInRadians, aspect, zNear, zFar));
    }

    public setValues(
        fieldOfViewYInRadians: number = Math.PI,
        aspect: number = 1,
        zNear: number = 400,
        zFar: number = -400): PerspectiveCamera
    {
        this._projection.asPerspective(fieldOfViewYInRadians, aspect, zNear, zFar);
        this.updateFrustrum();
        return this;
    }
}