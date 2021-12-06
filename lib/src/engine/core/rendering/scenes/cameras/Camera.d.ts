import { Matrix4 } from "../../../../libs/maths/algebra/matrices/Matrix4";
import { UUID } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { Mesh } from "../objects/meshes/Mesh";
import { Object3D, Object3DBase } from "../objects/Object3D";
export { Camera };
export { CameraBase };
interface Camera extends Object3D {
    readonly uuid: UUID;
    projection: Matrix4;
    getProjection(mat: Matrix4): Matrix4;
    isViewing(mesh: Mesh): boolean;
}
declare class CameraBase extends Object3DBase {
    readonly uuid: UUID;
    protected _projection: Matrix4;
    private _frustrum;
    constructor();
    constructor(projection: Matrix4);
    get projection(): Matrix4;
    getProjection(mat: Matrix4): Matrix4;
    isViewing(mesh: Mesh): boolean;
    protected updateFrustrum(): void;
}
