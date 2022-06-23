import { Vector2 } from "../../libs/maths/algebra/vectors/Vector2";
import { Vector3 } from "../../libs/maths/algebra/vectors/Vector3";
import { Space } from "../../libs/maths/geometry/space/Space";
import { Transform } from "../general/Transform";
import { Input, MouseButton } from "../input/Input";
import { Camera } from "../rendering/scenes/cameras/Camera";

export { ArcballCameraControl };

interface ArcballCameraControlConstructor {
    readonly prototype: ArcballCameraControl;
    new(camera: Camera, target: Transform, params?: {
        rotationSpeed?: number,
        translation?: boolean,
        translationSpeed?: number,
        scrollSpeed?: number,
        minRadius?: number
    }): ArcballCameraControl;
}

interface ArcballCameraControl {
    update(deltaTime: number): void;
}

class ArcballCameraControlBase {
    camera: Camera;
    target: Transform;
    rotationSpeed: number;
    translation: boolean;
    translationSpeed: number;
    scrollSpeed: number;
    minRadius: number;

    #lastPointerPosition: Vector2;
    
    constructor(camera: Camera, target: Transform, params?: {
        rotationSpeed?: number,
        translation?: boolean,
        translationSpeed?: number,
        scrollSpeed?: number,
        minRadius?: number
    }) {
        this.camera = camera;
        this.target = target;
        this.translation = params?.translation ?? false;
        this.rotationSpeed = params?.rotationSpeed ?? 100;
        this.translationSpeed = params?.translationSpeed ?? 100;
        this.scrollSpeed = params?.scrollSpeed ?? 100;
        this.minRadius = params?.minRadius ?? 1;
        this.#lastPointerPosition = new Vector2();
    }

    update(deltaTime: number) {
        const scrollSpeed = this.scrollSpeed;
        const rotationSpeed = this.rotationSpeed;
        const translation = this.translation;
        const translationSpeed = this.translationSpeed;
        const minRadius = this.minRadius;
        const cameraTransform = this.camera.transform;
        const cameraPosition = cameraTransform.getTranslation(new Vector3());
        const targetTransform = this.target;
        const targetPosition = targetTransform.getTranslation(new Vector3());
        const lastPointerPosition = this.#lastPointerPosition;
        let cameraUpSign = cameraTransform.getUp(new Vector3()).dot(Space.up);
        
        const wheelDelta = Input.getWheelDelta();
        if (wheelDelta !== 0) {
            cameraTransform.getTranslation(cameraPosition);
            cameraPosition.toSpherical(targetPosition);
            const roh = cameraPosition.x;
            cameraPosition.x = Math.max(roh + wheelDelta * scrollSpeed * deltaTime, minRadius);
            cameraPosition.toCartesian(targetPosition)
            cameraTransform.setTranslation(cameraPosition);
            cameraTransform.lookAt(targetPosition, (cameraUpSign > 0) ? Space.up : Space.down);
        }
      
        if (Input.getMouseButtonDown(MouseButton.LEFT) || Input.getMouseButtonDown(MouseButton.RIGHT)) {
            lastPointerPosition.copy(Input.getPointerScreenPosition());
        }
        
        if (Input.getMouseButton(MouseButton.LEFT) || (translation && Input.getMouseButton(MouseButton.RIGHT))) {
            const newPointerPosition = Input.getPointerScreenPosition();
            if (!newPointerPosition.equals(lastPointerPosition)) {
                if (Input.getMouseButton(MouseButton.LEFT)) {
                    const dx = (lastPointerPosition.x - newPointerPosition.x) * rotationSpeed * deltaTime;
                    const dy = (lastPointerPosition.y - newPointerPosition.y) * rotationSpeed * deltaTime;
                    cameraTransform.getTranslation(cameraPosition);
                    if (dx !== 0 || dy !== 0) {
                        cameraUpSign = Math.sign(cameraTransform.getUp(new Vector3()).dot(Space.up));
                        cameraPosition.toSpherical(targetPosition);
                        const theta = cameraPosition.y;
                        const phi = cameraPosition.z;
                        const newTheta = theta + cameraUpSign * dy;
                        if (newTheta <= 0 || newTheta >= Math.PI) {
                            cameraPosition.z = (phi - dx + Math.PI) % (2 * Math.PI);
                            cameraPosition.y = newTheta < 0 ? -newTheta : Math.PI - (newTheta - Math.PI);
                            cameraUpSign *= -1;
                        }
                        else {
                            cameraPosition.z = (phi - dx) % (2 * Math.PI);
                            cameraPosition.y = theta + cameraUpSign * dy;
                        }
                        cameraPosition.toCartesian(targetPosition)
                        cameraTransform.setTranslation(cameraPosition);
                        cameraTransform.lookAt(targetPosition, (cameraUpSign > 0) ? Space.up : Space.down);
                    }
                }
                if (translation && Input.getMouseButton(MouseButton.RIGHT)) {
                    cameraTransform.getTranslation(cameraPosition);
                    const distance = cameraPosition.distance(targetPosition);
                    const dx = (lastPointerPosition.x - newPointerPosition.x) * translationSpeed * deltaTime;
                    const dy = (lastPointerPosition.y - newPointerPosition.y) * translationSpeed * deltaTime;
                    const translation = new Vector3();
                    if (dx !== 0) {
                        const right = cameraTransform.getRight(new Vector3());
                        translation.copy(right.scale(dx * distance));
                        targetTransform.setTranslation(targetPosition.add(translation));
                        cameraPosition.add(translation);
                    }
                    if (dy !== 0) {
                        const down = cameraTransform.getDown(new Vector3());
                        translation.copy(down.scale(dy * distance));
                        targetTransform.setTranslation(targetPosition.add(translation));
                        cameraPosition.add(translation);
                    }
                    cameraTransform.setTranslation(cameraPosition);
                    cameraTransform.lookAt(targetPosition, (cameraUpSign > 0) ? Space.up : Space.down);
                }
                lastPointerPosition.copy(newPointerPosition);
            }
        }
    }
}

var ArcballCameraControl: ArcballCameraControlConstructor = ArcballCameraControlBase;