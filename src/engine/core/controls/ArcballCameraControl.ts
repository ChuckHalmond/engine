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

const tempVector1 = new Vector3();
const tempVector2 = new Vector3();
const tempVector3 = new Vector3();

class ArcballCameraControlBase implements ArcballCameraControl {
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
        const {scrollSpeed, rotationSpeed, translation, translationSpeed, minRadius, target, camera} = this;
        const {transform: cameraTransform} = camera;
        const cameraPosition = cameraTransform.getTranslation(tempVector1);
        const targetPosition = target.getTranslation(tempVector2);
        const lastPointerPosition = this.#lastPointerPosition;
        let cameraUpSign = cameraTransform.getUp(tempVector3).dot(Space.up);
        
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
                        cameraUpSign = Math.sign(cameraTransform.getUp(tempVector3).dot(Space.up));
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
                    if (dx !== 0) {
                        const translation = cameraTransform.getRight(tempVector3);
                        translation.scale(dx * distance);
                        target.setTranslation(targetPosition.add(translation));
                        cameraPosition.add(translation);
                    }
                    if (dy !== 0) {
                        const translation = cameraTransform.getDown(tempVector3);
                        translation.scale(dy * distance);
                        target.setTranslation(targetPosition.add(translation));
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