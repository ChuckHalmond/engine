import { CameraBase, Camera } from "./Camera";
export declare class OrthographicCamera extends CameraBase {
    constructor(left: number, right: number, bottom: number, top: number, near: number, far: number);
    setValues(left: number, right: number, bottom: number, top: number, near: number, far: number): Camera;
}
