import { Vector2 } from "../../libs/maths/algebra/vectors/Vector2";
import { Vector3 } from "../../libs/maths/algebra/vectors/Vector3";
import { Space } from "../../libs/maths/geometry/space/Space";
import { Input, MouseButton, Key } from "../input/Input";
import { Camera } from "../rendering/scenes/cameras/Camera";

export { FreeCameraControl };

interface FreeCameraControlConstructor {
    readonly prototype: FreeCameraControl;
    new(camera: Camera, params?: {rotationSpeed?: number, translationSpeed?: number}): FreeCameraControl;
}

interface FreeCameraControl {
    update(deltaTime: number): void;
}

class FreeCameraControlBase {
    camera: Camera;
    rotationSpeed: number;
    translationSpeed: number;

    #lastPointerPosition: Vector2;

    constructor(camera: Camera, params?: {rotationSpeed?: number, translationSpeed?: number}) {
        this.camera = camera;
        this.rotationSpeed = params?.rotationSpeed ?? 50;
        this.translationSpeed = params?.translationSpeed ?? 8;
        this.#lastPointerPosition = new Vector2();
    }

    update(deltaTime: number) {
        const {camera, rotationSpeed, translationSpeed} = this;
        const {transform: cameraTransform} = camera;
        const lastPointerPosition = this.#lastPointerPosition;
        const cameraPosition = cameraTransform.getTranslation(new Vector3());
        const cameraForward = cameraTransform.getBackward(new Vector3());
        const {array: cameraForwardArray} = cameraForward;
        const {origin, up, down} = Space;
        let cameraUpSign = cameraTransform.getUp(new Vector3()).dot(up);
      
        if (Input.getKey(Key.Z) || Input.getKey(Key.ARROW_UP)) {
            const forward = cameraTransform.getBackward(new Vector3()).scale(translationSpeed * deltaTime);
            cameraTransform.translate(forward);
        }
        if (Input.getKey(Key.Q) || Input.getKey(Key.ARROW_LEFT)) {
            const left = cameraTransform.getLeft(new Vector3()).scale(translationSpeed * deltaTime);
            cameraTransform.translate(left);
        }
        if (Input.getKey(Key.S) || Input.getKey(Key.ARROW_DOWN)) {
            const backward = cameraTransform.getForward(new Vector3()).scale(translationSpeed * deltaTime);
            cameraTransform.translate(backward);
        }
        if (Input.getKey(Key.D) || Input.getKey(Key.ARROW_RIGHT)) {
            const right = cameraTransform.getRight(new Vector3()).scale(translationSpeed * deltaTime);
            cameraTransform.translate(right);
        }

        if (Input.getMouseButtonDown(MouseButton.RIGHT)) {
            lastPointerPosition.copy(Input.getPointerScreenPosition());
        }
        
        if (Input.getMouseButton(MouseButton.RIGHT)) {
            const newPointerPosition = Input.getPointerScreenPosition();
            if (!newPointerPosition.equals(lastPointerPosition)) {
                const dx = (lastPointerPosition.x - newPointerPosition.x) * rotationSpeed * deltaTime;
                const dy = (lastPointerPosition.y - newPointerPosition.y) * rotationSpeed * deltaTime;
                cameraPosition.copy(cameraTransform.getTranslation(new Vector3()));
                if (dx !== 0 || dy !== 0) {
                    cameraUpSign = Math.sign(cameraTransform.getUp(new Vector3()).dot(up));
                    cameraForward.toSpherical(origin);
                    const theta = cameraForwardArray[1];
                    const phi = cameraForwardArray[2];
                    const newTheta = theta + cameraUpSign * -dy;
                    if (newTheta <= 0 || newTheta >= Math.PI) {
                        cameraForwardArray[2] = (phi - dx + Math.PI) % (2 * Math.PI);
                        cameraForwardArray[1] = newTheta < 0 ? -newTheta : Math.PI - (newTheta - Math.PI);
                        cameraUpSign *= -1;
                    }
                    else {
                        cameraForwardArray[2] = (phi - dx) % (2 * Math.PI);
                        cameraForwardArray[1] = theta + cameraUpSign * -dy;
                    }
                    cameraForward.toCartesian(origin);
                    cameraTransform.lookAt(cameraPosition.add(cameraForward), (cameraUpSign > 0) ? up : down);
                }
                lastPointerPosition.copy(newPointerPosition);
            }
        }
    }
}

var FreeCameraControl: FreeCameraControlConstructor = FreeCameraControlBase;