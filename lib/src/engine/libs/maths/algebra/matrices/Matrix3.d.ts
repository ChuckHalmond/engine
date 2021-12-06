import { Injector } from "../../../patterns/injectors/Injector";
import { Vector2, Vector2Values } from "../vectors/Vector2";
import { Vector3Values, Vector3 } from "../vectors/Vector3";
export { Matrix3Values };
export { Matrix3 };
export { Matrix3Injector };
export { Matrix3Base };
declare type Matrix3Values = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
];
interface Matrix3Constructor {
    readonly prototype: Matrix3;
    new (): Matrix3;
    new (values: Matrix3Values): Matrix3;
    new (values?: Matrix3Values): Matrix3;
}
interface Matrix3 {
    readonly array: ArrayLike<number>;
    values: Matrix3Values;
    row1: Vector3Values;
    row2: Vector3Values;
    row3: Vector3Values;
    col1: Vector3Values;
    col2: Vector3Values;
    col3: Vector3Values;
    m11: number;
    m12: number;
    m13: number;
    m21: number;
    m22: number;
    m23: number;
    m31: number;
    m32: number;
    m33: number;
    setArray(array: WritableArrayLike<number>): this;
    setValues(m: Matrix3Values): this;
    getAt(idx: number): number;
    setAt(idx: number, val: number): this;
    getEntry(row: number, col: number): number;
    setEntry(row: number, col: number, val: number): this;
    getRow(idx: number): Vector3Values;
    setRow(idx: number, row: Vector3Values): this;
    getCol(idx: number): Vector3Values;
    setCol(idx: number, col: Vector3Values): this;
    equals(mat: Matrix3): boolean;
    copy(mat: Matrix3): this;
    clone(): this;
    det(): number;
    trace(): number;
    setIdentity(): this;
    setZeros(): this;
    negate(): this;
    transpose(): this;
    invert(): this;
    add(mat: Matrix3): this;
    sub(mat: Matrix3): this;
    mult(mat: Matrix3): this;
    multScalar(k: number): this;
    solve(vecB: Vector3): Vector3Values;
    solve2(vecB: Vector2): Vector2Values;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): void;
}
declare class Matrix3Base {
    protected _array: WritableArrayLike<number>;
    constructor();
    constructor(values: Matrix3Values);
    get array(): ArrayLike<number>;
    get values(): Matrix3Values;
    set values(values: Matrix3Values);
    get row1(): Vector3Values;
    set row1(row1: Vector3Values);
    get row2(): Vector3Values;
    set row2(row2: Vector3Values);
    get row3(): Vector3Values;
    set row3(row3: Vector3Values);
    get col1(): Vector3Values;
    set col1(col1: Vector3Values);
    get col2(): Vector3Values;
    set col2(col2: Vector3Values);
    get col3(): Vector3Values;
    set col3(col3: Vector3Values);
    get m11(): number;
    set m11(m11: number);
    get m12(): number;
    set m12(m12: number);
    get m13(): number;
    set m13(m13: number);
    get m21(): number;
    set m21(m21: number);
    get m22(): number;
    set m22(m22: number);
    get m23(): number;
    set m23(m23: number);
    get m31(): number;
    set m31(m31: number);
    get m32(): number;
    set m32(m32: number);
    get m33(): number;
    set m33(m33: number);
    setArray(array: WritableArrayLike<number>): this;
    setValues(m: Matrix3Values): this;
    getRow(idx: number): Vector3Values;
    setRow(idx: number, row: Vector3Values): this;
    setCol(idx: number, col: Vector3Values): this;
    getCol(idx: number): Vector3Values;
    getAt(idx: number): number;
    setAt(idx: number, val: number): this;
    getEntry(row: number, col: number): number;
    setEntry(row: number, col: number, val: number): this;
    equals(mat: Matrix3): boolean;
    copy(mat: Matrix3): this;
    clone(): this;
    setIdentity(): this;
    setZeros(): this;
    det(): number;
    trace(): number;
    negate(): this;
    transpose(): this;
    invert(): this;
    add(mat: Matrix3): this;
    sub(mat: Matrix3Base): this;
    mult(mat: Matrix3): this;
    multScalar(k: number): this;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): void;
    solve(vecB: Vector3): Vector3Values;
    solve2(vecB: Vector2): Vector2Values;
}
declare var Matrix3: Matrix3Constructor;
declare const Matrix3Injector: Injector<Matrix3Constructor>;
