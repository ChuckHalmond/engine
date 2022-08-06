import { BoundingBox } from "../../../core/rendering/scenes/geometries/bounding/BoundingBox";
import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingSphere } from "./BoundingSphere";
export { Frustrum };
export { FrustrumInjector };
interface Frustrum {
    readonly nearPlane: Plane;
    readonly farPlane: Plane;
    readonly topPlane: Plane;
    readonly bottomPlane: Plane;
    readonly leftPlane: Plane;
    readonly rightPlane: Plane;
    copy(frustrum: Frustrum): Frustrum;
    clone(): Frustrum;
    setFromPerspectiveMatrix(matrix: Matrix4): Frustrum;
    set(nearPlane: Plane, farPlane: Plane, topPlane: Plane, bottomPlane: Plane, leftPlane: Plane, rightPlane: Plane): Frustrum;
    intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBox): boolean;
    containsPoint(point: Vector3): boolean;
    separatingAxis(): [Vector3, Vector3][];
    points(): Vector3[];
}
interface FrustrumConstructor {
    readonly prototype: Frustrum;
    new (): Frustrum;
}
declare var Frustrum: FrustrumConstructor;
declare const FrustrumInjector: Injector<FrustrumConstructor>;
