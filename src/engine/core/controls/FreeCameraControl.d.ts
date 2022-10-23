import { Camera } from "../rendering/scenes/cameras/Camera";
export { FreeCameraControl };
interface FreeCameraControlConstructor {
    readonly prototype: FreeCameraControl;
    new (camera: Camera, params?: {
        rotationSpeed?: number;
        translationSpeed?: number;
    }): FreeCameraControl;
}
interface FreeCameraControl {
    camera: Camera;
    rotationSpeed: number;
    translationSpeed: number;
    update(deltaTime: number): void;
}
declare var FreeCameraControl: FreeCameraControlConstructor;
