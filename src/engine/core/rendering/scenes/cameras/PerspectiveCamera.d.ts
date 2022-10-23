import { Camera } from "./Camera";
export { PerspectiveCamera };
interface PerspectiveCameraConstructor {
    prototype: PerspectiveCamera;
    new (fov: number, aspect: number, zNear: number, zFar: number): PerspectiveCamera;
}
interface PerspectiveCamera extends Camera {
    setValues(fov: number, aspect: number, zNear: number, zFar: number): PerspectiveCamera;
}
declare var PerspectiveCamera: PerspectiveCameraConstructor;
