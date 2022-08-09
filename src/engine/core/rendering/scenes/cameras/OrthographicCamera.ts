import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { Camera } from "./Camera";

export { OrthographicCamera };

interface OrthographicCameraConstructor {
    prototype: OrthographicCamera;
    new(left: number, right: number, bottom: number, top: number, near: number, far: number): OrthographicCamera;
}

interface OrthographicCamera extends Camera {
    setValues(left: number, right: number, bottom: number, top: number, near: number, far: number): Camera
}

class OrthographicCameraBase extends Camera implements OrthographicCamera {
    
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
        this.updateFrustum();
        return this;
    }
}

var OrthographicCamera: OrthographicCameraConstructor = OrthographicCameraBase;