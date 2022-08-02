import { Mesh } from "../hl/Mesh";
import { Camera } from "../scenes/cameras/Camera";
export { CameraHelper };
interface CameraHelperConstructor {
    prototype: CameraHelper;
    new (camera: Camera): CameraHelper;
}
interface CameraHelper extends Mesh {
    readonly camera: Camera;
}
declare var CameraHelper: CameraHelperConstructor;
