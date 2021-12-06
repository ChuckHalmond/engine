import { CameraBase } from "./Camera";
export declare class PerspectiveCamera extends CameraBase {
    constructor(fieldOfViewYInRadians?: number, aspect?: number, zNear?: number, zFar?: number);
    setValues(fieldOfViewYInRadians?: number, aspect?: number, zNear?: number, zFar?: number): PerspectiveCamera;
}
