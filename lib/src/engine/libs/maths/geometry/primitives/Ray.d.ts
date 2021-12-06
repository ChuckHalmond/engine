import { Injector } from "../../../patterns/injectors/Injector";
import { BoundingBox } from "../../../physics/collisions/BoundingBox";
import { BoundingSphere } from "../../../physics/collisions/BoundingSphere";
import { Matrix4 } from "../../algebra/matrices/Matrix4";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Plane } from "./Plane";
import { Quad } from "./Quad";
import { Triangle } from "./Triangle";
export { Ray };
export { RayInjector };
export { RayBase };
interface Ray {
    origin: Vector3;
    direction: Vector3;
    set(origin: Vector3, direction: Vector3): Ray;
    equals(ray: Ray): boolean;
    copy(ray: Ray): Ray;
    clone(): Ray;
    pointAt(dist: number, out: Vector3): Vector3;
    closestPointTo(point: Vector3, out: Vector3): Vector3;
    distToPoint(point: Vector3): number;
    distSqToPoint(point: Vector3): number;
    distToPlane(plane: Plane): number | null;
    intersectsWithSphere(sphere: BoundingSphere): boolean;
    intersectsWithQuad(quad: Quad): number | null;
    intersectsWithTriangle(triangle: Triangle): number | null;
    intersectsWithPlane(plane: Plane): boolean | null;
    intersectsWithBox(box: BoundingBox): boolean | null;
    intersectionWithSphere(sphere: BoundingSphere, out: Vector3): Vector3 | null;
    intersectionWithPlane(plane: Plane, out: Vector3): Vector3 | null;
    intersectionWithBox(box: BoundingBox, out: Vector3): Vector3 | null;
    transform(mat: Matrix4): void;
}
interface RayConstructor {
    readonly prototype: Ray;
    new (): Ray;
    new (origin: Vector3, direction: Vector3): Ray;
    new (origin?: Vector3, direction?: Vector3): Ray;
}
declare class RayBase implements Ray {
    private _origin;
    private _direction;
    constructor();
    constructor(origin: Vector3, direction: Vector3);
    get origin(): Vector3;
    set origin(origin: Vector3);
    get direction(): Vector3;
    set direction(direction: Vector3);
    set(origin: Vector3, direction: Vector3): RayBase;
    equals(ray: RayBase): boolean;
    copy(ray: RayBase): RayBase;
    clone(): RayBase;
    pointAt(dist: number, out: Vector3): Vector3;
    lookAt(vec: Vector3): this;
    closestPointTo(point: Vector3, out: Vector3): Vector3;
    distToPoint(point: Vector3): number;
    distSqToPoint(point: Vector3): number;
    distToPlane(plane: Plane): number | null;
    intersectsWithSphere(sphere: BoundingSphere): boolean;
    intersectsWithQuad(quad: Quad): number | null;
    /**
     * Möller–Trumbore intersection algorithm
     */
    intersectsWithTriangle(triangle: Triangle): number | null;
    intersectsWithPlane(plane: Plane): boolean;
    intersectsWithBox(box: BoundingBox): boolean;
    intersectionWithSphere(sphere: BoundingSphere, out: Vector3): Vector3 | null;
    intersectionWithPlane(plane: Plane, out: Vector3): Vector3 | null;
    intersectionWithBox(box: BoundingBox, out: Vector3): Vector3 | null;
    transform(mat: Matrix4): void;
}
declare var Ray: RayConstructor;
declare const RayInjector: Injector<RayConstructor>;
