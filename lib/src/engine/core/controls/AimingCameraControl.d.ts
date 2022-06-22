import { Transform } from "../general/Transform";
import { Camera } from "../rendering/scenes/cameras/Camera";
export { AimingCameraControl };
interface AimingCameraControlConstructor {
    readonly prototype: AimingCameraControl;
    new (camera: Camera, target: Transform, params?: {
        rotationSpeed?: number;
        minRadius?: number;
    }): AimingCameraControl;
}
interface AimingCameraControl {
    awake(): void;
    update(deltaTime: number): void;
}
declare var AimingCameraControl: AimingCameraControlConstructor;
