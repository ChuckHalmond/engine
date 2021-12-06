import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Vector3List } from "../../maths/extensions/lists/Vector3List";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingBox } from "./BoundingBox";
export { BoundingSphere };
export { BoundingSphereInjector };
export { BoundingSphereBase };
interface BoundingSphere {
    center: Vector3;
    radius: number;
    set(center: Vector3, radius: number): BoundingSphere;
    copy(sphere: BoundingSphere): BoundingSphere;
    clone(): BoundingSphere;
    setFromPoints(points: Vector3List, center?: Vector3): BoundingSphere;
    isEmpty(): boolean;
    makeEmpty(): BoundingSphere;
    containsPoint(point: Vector3): boolean;
    dist(point: Vector3): number;
    distToPlane(plane: Plane): number;
    intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBox): boolean;
    intersectsPlane(plane: Plane): boolean;
    clampPoint(point: Vector3, out: Vector3): Vector3;
    getBoundingBox(out: BoundingBox): BoundingBox;
    transform(mat: Matrix4): void;
    translate(offset: Vector3): void;
}
interface BoundingSphereConstructor {
    readonly prototype: BoundingSphere;
    new (): BoundingSphere;
}
declare class BoundingSphereBase implements BoundingSphere {
    private _center;
    private _radius;
    constructor();
    get center(): Vector3;
    set center(center: Vector3);
    get radius(): number;
    set radius(radius: number);
    set(center: Vector3, radius: number): BoundingSphereBase;
    copy(sphere: BoundingSphereBase): BoundingSphereBase;
    clone(): BoundingSphereBase;
    setFromPoints(points: Vector3List, center?: Vector3): BoundingSphereBase;
    isEmpty(): boolean;
    makeEmpty(): BoundingSphereBase;
    containsPoint(point: Vector3): boolean;
    dist(point: Vector3): number;
    distToPlane(plane: Plane): number;
    intersectsSphere(sphere: BoundingSphereBase): boolean;
    intersectsBox(box: BoundingBox): boolean;
    intersectsPlane(plane: Plane): boolean;
    clampPoint(point: Vector3, out: Vector3): Vector3;
    getBoundingBox(out: BoundingBox): BoundingBox;
    transform(mat: Matrix4): void;
    translate(offset: Vector3): void;
}
declare var BoundingSphere: BoundingSphereConstructor;
declare const BoundingSphereInjector: Injector<BoundingSphereConstructor>;
