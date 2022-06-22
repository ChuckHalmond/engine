import { CameraBase } from "./Camera";
export declare class PerspectiveCamera extends CameraBase {
    constructor(fov: number, aspect: number, zNear: number, zFar: number);
    setValues(fov: number, aspect: number, zNear: number, zFar: number): PerspectiveCamera;
}
