import { Camera } from "../scenes/cameras/Camera";
export { CameraHelper };
interface CameraHelperConstructor {
}
interface CameraHelper {
    readonly camera: Camera;
}
declare var CameraHelper: CameraHelperConstructor;
