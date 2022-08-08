import { BoundingBox } from "../../../core/rendering/scenes/geometries/bounding/BoundingBox";
import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { BoundingSphere } from "./BoundingSphere";
export { Frustum };
interface Frustum {
    readonly nearPlane: Plane;
    readonly farPlane: Plane;
    readonly topPlane: Plane;
    readonly bottomPlane: Plane;
    readonly leftPlane: Plane;
    readonly rightPlane: Plane;
    readonly extents: Vector3[];
    copy(Frustum: Frustum): Frustum;
    clone(): Frustum;
    setFromMatrix(matrix: Matrix4): Frustum;
    set(nearPlane: Plane, farPlane: Plane, topPlane: Plane, bottomPlane: Plane, leftPlane: Plane, rightPlane: Plane): Frustum;
    intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBox): boolean;
    containsPoint(point: Vector3): boolean;
    getEdges(edges: Vector3[]): Vector3[];
    getExtents(extents: Vector3[]): Vector3[];
}
interface FrustumConstructor {
    readonly prototype: Frustum;
    new (): Frustum;
}
declare var Frustum: FrustumConstructor;
