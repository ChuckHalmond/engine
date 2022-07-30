import { Camera } from "../scenes/cameras/Camera";

export { CameraHelper };

interface CameraHelperConstructor {

}

interface CameraHelper {
    readonly camera: Camera;
}

class CameraHelperBase implements CameraHelper {
    readonly camera: Camera;

    constructor(camera: Camera) {
        this.camera = camera;
    }
    /*
    linesArray(): Float32Array {
        const {frustrum} = this.#camera;
        const {nearPlane, farPlane, topPlane, bottomPlane, leftPlane, rightPlane} = frustrum;
        return new Float32Array();
    }

    linesIndicesArray(): Uint8Array {
        return new Uint8Array();
    }*/
}

var CameraHelper: CameraHelperConstructor = CameraHelperBase;