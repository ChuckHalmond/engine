import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { Camera } from "./Camera";

export { PerspectiveCamera };

interface PerspectiveCameraConstructor {
    prototype: PerspectiveCamera;
    new(fov: number, aspect: number, zNear: number, zFar: number): PerspectiveCamera;
}

interface PerspectiveCamera extends Camera {
    setValues(fov: number, aspect: number, zNear: number, zFar: number): PerspectiveCamera
}

class PerspectiveCameraBase extends Camera {
    
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
        this.projection.setPerspective(fov, aspect, zNear, zFar);
        this.updateFrustum();
        return this;
    }
}

var PerspectiveCamera: PerspectiveCameraConstructor = PerspectiveCameraBase;