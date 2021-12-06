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
    new (values: Matrix2Values): Matrix2;
    new (values?: Matrix2Values): Matrix2;
}
interface Matrix2 {
    readonly array: ArrayLike<number>;
    values: Matrix2Values;
    row1: Vector2Values;
    row2: Vector2Values;
    col1: Vector2Values;
    col2: Vector2Values;
    m11: number;
    m12: number;
    m21: number;
    m22: number;
    setArray(array: WritableArrayLike<number>): this;
    setValues(m: Matrix2Values): void;
    getAt(idx: number): number;
    setAt(idx: number, val: number): this;
    getEntry(row: number, col: number): number;
    setEntry(row: number, col: number, val: number): this;
    getRow(idx: number): Vector2Values;
    setRow(idx: number, row: Vector2Values): this;
    getCol(idx: number): Vector2Values;
    setCol(idx: number, col: Vector2Values): this;
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
declare class Matrix2Base {
    protected _array: WritableArrayLike<number>;
    constructor();
    constructor(values: Matrix2Values);
    get array(): ArrayLike<number>;
    get values(): Matrix2Values;
    set values(values: Matrix2Values);
    get row1(): Vector2Values;
    set row1(row1: Vector2Values);
    get row2(): Vector2Values;
    set row2(row2: Vector2Values);
    get col1(): Vector2Values;
    set col1(col1: Vector2Values);
    get col2(): Vector2Values;
    set col2(col2: Vector2Values);
    get m11(): number;
    set m11(m11: number);
    get m12(): number;
    set m12(m12: number);
    get m21(): number;
    set m21(m21: number);
    get m22(): number;
    set m22(m22: number);
    setArray(array: WritableArrayLike<number>): this;
    setValues(m: Matrix2Values): this;
    getRow(idx: number): Vector2Values;
    setRow(idx: number, row: Vector2Values): this;
    setCol(idx: number, col: Vector2Values): this;
    getCol(idx: number): Vector2Values;
    getAt(idx: number): number;
    setAt(idx: number, val: number): this;
    getEntry(row: number, col: number): number;
    setEntry(row: number, col: number, val: number): this;
    equals(mat: Matrix2): boolean;
    getValues(): Matrix2Values;
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
