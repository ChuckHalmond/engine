import { Matrix3 } from "engine/libs/maths/algebra/matrices/Matrix3";
import { Injector } from "../../../patterns/injectors/Injector";
export { Vector3Values };
export { Vector3Constructor };
export { Vector3 };
export { Vector3Base };
export { Vector3Injector };
declare type Vector3Values = [number, ...number[]] & {
    length: 3;
};
interface Vector3Constructor {
    readonly prototype: Vector3;
    new (): Vector3;
    new (values: Vector3Values): Vector3;
    mult(mat: Matrix3, vec: Vector3): Vector3;
}
interface Vector3 {
    readonly array: ArrayLike<number>;
    values: Vector3Values;
    x: number;
    y: number;
    z: number;
    setArray(array: WritableArrayLike<number>): this;
    setValues(v: Vector3Values): this;
    equals(vec: Vector3): boolean;
    copy(vec: Vector3): this;
    clone(): this;
    setZeros(): this;
    add(vec: Vector3): this;
    addScalar(k: number): this;
    sub(vec: Vector3): this;
    lerp(vec: Vector3, t: number): this;
    max(vecB: Vector3): this;
    min(vecB: Vector3): this;
    clamp(min: Vector3, max: Vector3): this;
    multScalar(k: number): this;
    cross(vec: Vector3): this;
    dot(vec: Vector3): number;
    len(): number;
    lenSq(): number;
    dist(vec: Vector3): number;
    distSq(vec: Vector3): number;
    normalize(): this;
    negate(): this;
    mult(vec: Vector3): this;
    mult(mat: Matrix3): this;
    addScaled(vec: Vector3, k: number): this;
    copyAndSub(vecA: Vector3, vecB: Vector3): this;
    copyAndCross(vecA: Vector3, vecB: Vector3): this;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}
declare class Vector3Base {
    protected _array: WritableArrayLike<number>;
    constructor();
    constructor(values: Vector3Values);
    get array(): ArrayLike<number>;
    get values(): Vector3Values;
    set values(values: Vector3Values);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get z(): number;
    set z(z: number);
    setArray(array: WritableArrayLike<number>): this;
    setValues(v: Vector3Values): this;
    copy(vec: Vector3): this;
    clone(): this;
    equals(vec: Vector3): boolean;
    setZeros(): this;
    add(vec: Vector3): this;
    addScalar(k: number): this;
    sub(vec: Vector3): this;
    lerp(vec: Vector3, t: number): this;
    max(vecB: Vector3): this;
    min(vecB: Vector3): this;
    clamp(min: Vector3, max: Vector3): this;
    multScalar(k: number): this;
    cross(vec: Vector3): this;
    dot(vec: Vector3): number;
    len(): number;
    lenSq(): number;
    dist(vec: Vector3): number;
    distSq(vec: Vector3): number;
    normalize(): this;
    negate(): this;
    mult(mat: Matrix3): this;
    mult(vec: Vector3): this;
    static mult(mat: Matrix3, vec: Vector3): Vector3;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
    addScaled(vec: Vector3, k: number): this;
    copyAndSub(vecA: Vector3, vecB: Vector3): this;
    copyAndCross(vecA: Vector3, vecB: Vector3): this;
}
declare var Vector3: Vector3Constructor;
declare const Vector3Injector: Injector<Vector3Constructor>;
