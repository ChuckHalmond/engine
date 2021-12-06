import { Injector } from "../../../patterns/injectors/Injector";
import { Vector3 } from "../../algebra/vectors/Vector3";
export { Plane };
export { PlaneInjector };
export { PlaneBase };
interface Plane {
    normal: Vector3;
    constant: number;
    copy(plane: Plane): Plane;
    set(x: number, y: number, z: number, constant: number): Plane;
    setFromNormalAndConstant(normal: Vector3, constant: number): Plane;
    setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
    setFromCoplanarPoints(point1: Vector3, point2: Vector3, point3: Vector3): Plane;
    distanceToPoint(point: Vector3): number;
    normalized(): Plane;
}
interface PlaneConstructor {
    readonly prototype: Plane;
    new (): Plane;
    new (normal: Vector3, constant: number): Plane;
    new (normal?: Vector3, constant?: number): Plane;
    fromNormalAndConstant(normal: Vector3, constant: number): Plane;
    fromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
    fromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
}
declare class PlaneBase implements Plane {
    private _normal;
    private _constant;
    constructor();
    constructor(normal: Vector3, constant: number);
    static fromNormalAndConstant(normal: Vector3, constant: number): Plane;
    static fromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
    static fromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
    get normal(): Vector3;
    set normal(normal: Vector3);
    get constant(): number;
    set constant(constant: number);
    copy(plane: PlaneBase): PlaneBase;
    set(x: number, y: number, z: number, constant: number): PlaneBase;
    setFromNormalAndConstant(normal: Vector3, constant: number): PlaneBase;
    setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): PlaneBase;
    setFromCoplanarPoints(point1: Vector3, point2: Vector3, point3: Vector3): PlaneBase;
    distanceToPoint(point: Vector3): number;
    normalized(): PlaneBase;
}
declare var Plane: PlaneConstructor;
declare const PlaneInjector: Injector<PlaneConstructor>;
