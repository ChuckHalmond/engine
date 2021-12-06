import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingBox } from "./BoundingBox";
import { BoundingSphere } from "./BoundingSphere";
export { Frustrum };
export { FrustrumInjector };
export { FrustrumBase };
interface Frustrum {
    nearPlane: Plane;
    farPlane: Plane;
    topPlane: Plane;
    bottomPlane: Plane;
    leftPlane: Plane;
    rightPlane: Plane;
    copy(frustrum: Frustrum): Frustrum;
    clone(): Frustrum;
    setFromPerspectiveMatrix(mat: Matrix4): Frustrum;
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
    private _nearPlane;
    private _farPlane;
    private _topPlane;
    private _bottomPlane;
    private _leftPlane;
    private _rightPlane;
    constructor();
    get nearPlane(): Plane;
    set nearPlane(nearPlane: Plane);
    get farPlane(): Plane;
    set farPlane(farPlane: Plane);
    get topPlane(): Plane;
    set topPlane(topPlane: Plane);
    get bottomPlane(): Plane;
    set bottomPlane(bottomPlane: Plane);
    get leftPlane(): Plane;
    set leftPlane(leftPlane: Plane);
    get rightPlane(): Plane;
    set rightPlane(rightPlane: Plane);
    set(nearPlane: Plane, farPlane: Plane, topPlane: Plane, bottomPlane: Plane, leftPlane: Plane, rightPlane: Plane): Frustrum;
    copy(frustrum: FrustrumBase): FrustrumBase;
    clone(): FrustrumBase;
    setFromPerspectiveMatrix(mat: Matrix4): FrustrumBase;
    intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBox): boolean;
    containsPoint(point: Vector3): boolean;
}
declare var Frustrum: FrustrumConstructor;
declare const FrustrumInjector: Injector<FrustrumConstructor>;
