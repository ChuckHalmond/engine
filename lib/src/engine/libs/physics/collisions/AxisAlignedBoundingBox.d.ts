import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Vector3List } from "../../maths/extensions/lists/Vector3List";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Triangle } from "../../maths/geometry/primitives/Triangle";
import { Injector } from "../../patterns/injectors/Injector";
import { StackPool } from "../../patterns/pools/StackPool";
import { BoundingSphere } from "./BoundingSphere";
export { BoundingBox };
export { BoundingBoxInjector };
export { BoundingBoxBase };
export { BoundingBoxPool };
interface BoundingBox {
    readonly min: Vector3;
    readonly max: Vector3;
    set(min: Vector3, max: Vector3): void;
    copy(box: BoundingBox): BoundingBox;
    clone(box: BoundingBox): BoundingBox;
    makeEmpty(): void;
    isEmpty(): boolean;
    getCenter(out: Vector3): Vector3;
    getSize(out: Vector3): Vector3;
    setFromLengths(center: Vector3, length: number, width: number, height: number): BoundingBox;
    setFromPoints(points: Vector3List): BoundingBox;
    expandByPoint(point: Vector3): BoundingBox;
    expandByVector(vector: Vector3): BoundingBox;
    expandByScalar(k: number): void;
    clampPoint(point: Vector3, out: Vector3): Vector3;
    distanceToPoint(point: Vector3): number;
    intersectsPlane(plane: Plane): boolean;
    intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBox): boolean;
    getBoundingSphere(out: BoundingSphere): BoundingSphere;
    intersectsTriangle(triangle: Triangle): boolean;
}
interface BoundingBoxConstructor {
    readonly prototype: BoundingBox;
    new (): BoundingBox;
}
declare class BoundingBoxBase implements BoundingBox {
    readonly min: Vector3;
    readonly max: Vector3;
    constructor();
    set(min: Vector3, max: Vector3): void;
    copy(box: BoundingBoxBase): BoundingBoxBase;
    clone(box: BoundingBoxBase): BoundingBoxBase;
    makeEmpty(): void;
    isEmpty(): boolean;
    getCenter(out: Vector3): Vector3;
    getSize(out: Vector3): Vector3;
    setFromLengths(center: Vector3, length: number, width: number, height: number): BoundingBoxBase;
    setFromPoints(points: Vector3List): BoundingBoxBase;
    expandByPoint(point: Vector3): BoundingBoxBase;
    expandByVector(vector: Vector3): BoundingBoxBase;
    expandByScalar(k: number): this;
    clampPoint(point: Vector3, out: Vector3): Vector3;
    distanceToPoint(point: Vector3): number;
    intersectsPlane(plane: Plane): boolean;
    intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBoxBase): boolean;
    getBoundingSphere(out: BoundingSphere): BoundingSphere;
    intersectsTriangle(triangle: Triangle): boolean;
    private satForAxes;
}
declare var BoundingBox: BoundingBoxConstructor;
declare const BoundingBoxInjector: Injector<BoundingBoxConstructor>;
declare const BoundingBoxPool: StackPool<BoundingBox>;
