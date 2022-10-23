import { Transform } from "../general/Transform";
import { Camera } from "../rendering/scenes/cameras/Camera";
export { ArcballCameraControl };
interface ArcballCameraControlConstructor {
    readonly prototype: ArcballCameraControl;
    new (camera: Camera, target: Transform, params?: {
        rotationSpeed?: number;
        translation?: boolean;
        translationSpeed?: number;
        scrollSpeed?: number;
        minRadius?: number;
    }): ArcballCameraControl;
}
interface ArcballCameraControl {
    update(deltaTime: number): void;
}
declare var ArcballCameraControl: ArcballCameraControlConstructor;
