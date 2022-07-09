import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingBox } from "./AxisAlignedBoundingBox";
import { BoundingSphere } from "./BoundingSphere";
export { Frustrum };
export { FrustrumInjector };
export { FrustrumBase };
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
}
interface FrustrumConstructor {
    readonly prototype: Frustrum;
    new (): Frustrum;
}
declare class FrustrumBase implements Frustrum {
    readonly nearPlane: Plane;
    readonly farPlane: Plane;
    readonly topPlane: Plane;
    readonly bottomPlane: Plane;
    readonly leftPlane: Plane;
    readonly rightPlane: Plane;
    constructor();
    set(nearPlane: Plane, farPlane: Plane, topPlane: Plane, bottomPlane: Plane, leftPlane: Plane, rightPlane: Plane): Frustrum;
    copy(frustrum: FrustrumBase): FrustrumBase;
    clone(): FrustrumBase;
    setFromPerspectiveMatrix(matrix: Matrix4): FrustrumBase;
    intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBox): boolean;
    containsPoint(point: Vector3): boolean;
}
declare var Frustrum: FrustrumConstructor;
declare const FrustrumInjector: Injector<FrustrumConstructor>;
