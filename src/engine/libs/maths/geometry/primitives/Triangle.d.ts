import { Injector } from "../../../patterns/injectors/Injector";
import { StackPool } from "../../../patterns/pools/StackPool";
import { Matrix4 } from "../../algebra/matrices/Matrix4";
import { Vector2 } from "../../algebra/vectors/Vector2";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Plane } from "./Plane";
export { TriangleValues };
export { Triangle };
export { TriangleInjector };
export { TriangleBase };
export { TrianglePool };
declare type TriangleValues = Tuple<number, 9>;
interface Triangle {
    readonly point1: Vector3;
    readonly point2: Vector3;
    readonly point3: Vector3;
    set(point1: Vector3, point2: Vector3, point3: Vector3): Triangle;
    getValues(): TriangleValues;
    setValues(values: TriangleValues): Triangle;
    clone(): Triangle;
    copy(triangle: Triangle): Triangle;
    getNormal(out: Vector3): Vector3;
    getBarycentricCoordinates(point: Vector3, out: Vector3): Vector3;
    sharedPointsWith(triangle: Triangle): IterableIterator<Vector3>;
    indexOfPoint(point: Vector3): number;
    containsPoint(point: Vector3): boolean;
    getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2;
    isFrontFacing(direction: Vector3): boolean;
    getArea(): number;
    getMidpoint(out: Vector3): Vector3;
    getPlane(out: Plane): Plane;
    closestPointToPoint(point: Vector3, out: Vector3): Vector3;
    equals(triangle: Triangle): boolean;
    translate(vec: Vector3): void;
    transform(mat: Matrix4): void;
    toString(): string;
    readFromArray(arr: ArrayLike<number>, offset: number): Triangle;
    writeIntoArray(arr: WritableArrayLike<number>, offset: number): void;
}
interface TriangleConstructor {
    readonly prototype: Triangle;
    new (): Triangle;
    new (point1: Vector3, point2: Vector3, point3: Vector3): Triangle;
    new (point1?: Vector3, point2?: Vector3, point3?: Vector3): Triangle;
}
declare class TriangleBase implements Triangle {
    private _point1;
    private _point2;
    private _point3;
    constructor();
    constructor(point1: Vector3, point2: Vector3, point3: Vector3);
    get point1(): Vector3;
    set point1(point1: Vector3);
    get point2(): Vector3;
    set point2(point2: Vector3);
    get point3(): Vector3;
    set point3(point3: Vector3);
    getValues(): TriangleValues;
    set(point1: Vector3, point2: Vector3, point3: Vector3): TriangleBase;
    setValues(values: TriangleValues): TriangleBase;
    clone(): TriangleBase;
    copy(triangle: TriangleBase): TriangleBase;
    getNormal(out: Vector3): Vector3;
    getBarycentricCoordinates(point: Vector3, out: Vector3): Vector3;
    sharedPointsWith(triangle: TriangleBase): IterableIterator<Vector3>;
    indexOfPoint(point: Vector3): number;
    containsPoint(point: Vector3): boolean;
    getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2;
    isFrontFacing(direction: Vector3): boolean;
    getArea(): number;
    getMidpoint(out: Vector3): Vector3;
    getPlane(out: Plane): Plane;
    closestPointToPoint(point: Vector3, out: Vector3): Vector3;
    equals(triangle: TriangleBase): boolean;
    translate(vec: Vector3): void;
    transform(matrix: Matrix4): void;
    readFromArray(arr: ArrayLike<number>, offset: number): TriangleBase;
    writeIntoArray(arr: WritableArrayLike<number>, offset: number): void;
}
declare var Triangle: TriangleConstructor;
declare const TriangleInjector: Injector<TriangleConstructor>;
declare const TrianglePool: StackPool<Triangle>;