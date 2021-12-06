import { CameraBase, Camera } from "./Camera";
export declare class OrthographicCamera extends CameraBase {
    constructor(left?: number, width?: number, height?: number, top?: number, near?: number, far?: number);
    setValues(left?: number, width?: number, height?: number, top?: number, near?: number, far?: number): Camera;
}
