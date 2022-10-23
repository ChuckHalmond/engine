import { Injector } from "../../../patterns/injectors/Injector";
import { StackPool } from "../../../patterns/pools/StackPool";
import { Vector2Values, Vector2 } from "../vectors/Vector2";
export { Matrix2Values };
export { Matrix2 };
export { Matrix2Base };
export { Matrix2Injector };
export { Matrix2Pool };
declare type Matrix2Values = [
    number,
    number,
    number,
    number
];
interface Matrix2Constructor {
    readonly prototype: Matrix2;
    new (): Matrix2;
    new (m11: number, m12: number, m21: number, m22: number): Matrix2;
    new (array: ArrayLike<number>): Matrix2;
}
interface Matrix2 {
    readonly array: Float32Array;
    row1: Vector2Values;
    row2: Vector2Values;
    col1: Vector2Values;
    col2: Vector2Values;
    m11: number;
    m12: number;
    m21: number;
    m22: number;
    getValues(): Matrix2Values;
    setValues(m11: number, m12: number, m21: number, m22: number): this;
    equals(mat: Matrix2): boolean;
    copy(mat: Matrix2): this;
    clone(): this;
    det(): number;
    trace(): number;
    setIdentity(): this;
    setZeros(): this;
    negate(): this;
    transpose(): this;
    invert(): this;
    add(mat: Matrix2): this;
    sub(mat: Matrix2): this;
    mult(mat: Matrix2): this;
    multScalar(k: number): this;
    solve(vecB: Vector2): Vector2Values;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}
declare class Matrix2Base implements Matrix2 {
    readonly array: Float32Array;
    constructor();
    constructor(array: ArrayLike<number>);
    constructor(m11: number, m12: number, m21: number, m22: number);
    getValues(): Matrix2Values;
    setValues(m11: number, m12: number, m21: number, m22: number): this;
    get row1(): Vector2Values;
    set row1(row: Vector2Values);
    get row2(): Vector2Values;
    set row2(row: Vector2Values);
    get col1(): Vector2Values;
    set col1(col: Vector2Values);
    get col2(): Vector2Values;
    set col2(col: Vector2Values);
    get m11(): number;
    set m11(val: number);
    get m12(): number;
    set m12(val: number);
    get m21(): number;
    set m21(val: number);
    get m22(): number;
    set m22(val: number);
    equals(mat: Matrix2): boolean;
    copy(mat: Matrix2): this;
    clone(): this;
    det(): number;
    trace(): number;
    setIdentity(): this;
    setZeros(): this;
    negate(): this;
    transpose(): this;
    invert(): this;
    add(mat: Matrix2): this;
    sub(mat: Matrix2): this;
    mult(mat: Matrix2): this;
    multScalar(k: number): this;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
    solve(vecB: Vector2): Vector2Values;
}
declare var Matrix2: Matrix2Constructor;
declare const Matrix2Pool: StackPool<Matrix2>;
declare const Matrix2Injector: Injector<Matrix2Constructor>;
