import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../../../libs/maths/algebra/vectors/Vector3";
import { UUID } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { Frustum } from "../../../../libs/physics/collisions/Frustum";
import { Mesh } from "../objects/meshes/Mesh";
import { Object3D } from "../objects/Object3D";
export { Camera };
interface CameraConstructor {
    prototype: Camera;
    new (): Camera;
    new (projection: Matrix4): Camera;
}
interface Camera extends Object3D {
    readonly uuid: UUID;
    readonly viewProjection: Matrix4;
    readonly projection: Matrix4;
    readonly view: Matrix4;
    readonly frustum: Frustum;
    isViewing(mesh: Mesh): boolean;
    updateFrustum(): void;
    getFront(vector: Vector3): Vector3;
}
declare var Camera: CameraConstructor;
