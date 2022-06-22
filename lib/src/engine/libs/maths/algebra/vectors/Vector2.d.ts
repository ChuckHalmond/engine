import { Injector } from "../../../patterns/injectors/Injector";
import { Matrix2 } from "../matrices/Matrix2";
export { Vector2Injector };
export { Vector2 };
export { Vector2Base };
export declare type Vector2Values = [number, ...number[]] & {
    length: 2;
};
interface Vector2Constructor {
    readonly prototype: Vector2;
    new (): Vector2;
    new (values: Vector2Values): Vector2;
    new (values?: Vector2Values): Vector2;
}
interface Vector2 {
    readonly array: Float32Array;
    values: Vector2Values;
    x: number;
    y: number;
    setValues(v: Vector2Values): this;
    copy(vec: Vector2): this;
    clone(): this;
    equals(vec: Vector2): boolean;
    setUnit(): this;
    setZeros(): this;
    add(vec: Vector2): this;
    addScalar(k: number): this;
    sub(vec: Vector2): this;
    lerp(vec: Vector2, t: number): this;
    clamp(min: Vector2, max: Vector2): this;
    multScalar(k: number): this;
    cross(vec: Vector2): number;
    dot(vec: Vector2): number;
    length(): number;
    lengthSquared(): number;
    dist(vec: Vector2): number;
    distSquared(vec: Vector2): number;
    normalize(): this;
    negate(): this;
    mult(vec: Vector2): this;
    mult(mat: Matrix2): this;
    addScaled(vec: Vector2, k: number): this;
    copyAndSub(vecA: Vector2, vecB: Vector2): this;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}
declare class Vector2Base {
    array: Float32Array;
    constructor();
    constructor(values: Vector2Values);
    get values(): Vector2Values;
    set values(values: Vector2Values);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    setValues(v: Vector2Values): this;
    equals(vec: Vector2Base): boolean;
    copy(vec: Vector2Base): this;
    clone(): this;
    setUnit(): this;
    setZeros(): this;
    add(vec: Vector2Base): this;
    addScalar(k: number): this;
    sub(vec: Vector2Base): this;
    lerp(vec: Vector2Base, t: number): this;
    clamp(min: Vector2Base, max: Vector2Base): this;
    multScalar(k: number): this;
    cross(vec: Vector2Base): number;
    dot(vec: Vector2Base): number;
    length(): number;
    lengthSquared(): number;
    dist(vec: Vector2Base): number;
    distSquared(vec: Vector2Base): number;
    normalize(): this;
    negate(): this;
    mult(mat: Matrix2): this;
    mult(vec: Vector2): this;
    addScaled(vec: Vector2Base, k: number): this;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
    copyAndSub(vecA: Vector2Base, vecB: Vector2Base): this;
}
declare var Vector2: Vector2Constructor;
declare const Vector2Injector: Injector<Vector2Constructor>;
