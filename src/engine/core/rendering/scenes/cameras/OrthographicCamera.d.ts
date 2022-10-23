import { Camera } from "./Camera";
export { OrthographicCamera };
interface OrthographicCameraConstructor {
    prototype: OrthographicCamera;
    new (left: number, right: number, bottom: number, top: number, near: number, far: number): OrthographicCamera;
}
interface OrthographicCamera extends Camera {
    setValues(left: number, right: number, bottom: number, top: number, near: number, far: number): Camera;
}
declare var OrthographicCamera: OrthographicCameraConstructor;
