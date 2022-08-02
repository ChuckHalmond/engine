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
    new (m11: number, m21: number, m31: number, m12: number, m22: number, m32: number, m13: number, m23: number, m33: number): Matrix3;
    new (array: ArrayLike<number>): Matrix3;
    rotationX(angle: number): Matrix3;
    rotationY(angle: number): Matrix3;
    rotationZ(angle: number): Matrix3;
}
interface Matrix3 {
    readonly array: WritableArrayLike<number>;
    setValues(m11: number, m21: number, m31: number, m12: number, m22: number, m32: number, m13: number, m23: number, m33: number): this;
    getValues(): Matrix3Values;
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
    setRotationX(angle: number): this;
    setRotationY(angle: number): this;
    setRotationZ(angle: number): this;
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
declare class Matrix3Base implements Matrix3 {
    readonly array: Float32Array;
    constructor();
    constructor(array: ArrayLike<number>);
    constructor(m11: number, m21: number, m31: number, m12: number, m22: number, m32: number, m13: number, m23: number, m33: number);
    get row1(): Vector3Values;
    set row1(row: Vector3Values);
    get row2(): Vector3Values;
    set row2(row: Vector3Values);
    get row3(): Vector3Values;
    set row3(row: Vector3Values);
    get col1(): Vector3Values;
    set col1(col: Vector3Values);
    get col2(): Vector3Values;
    set col2(col: Vector3Values);
    get col3(): Vector3Values;
    set col3(col: Vector3Values);
    get m11(): number;
    set m11(val: number);
    get m12(): number;
    set m12(val: number);
    get m13(): number;
    set m13(val: number);
    get m21(): number;
    set m21(val: number);
    get m22(): number;
    set m22(val: number);
    get m23(): number;
    set m23(val: number);
    get m31(): number;
    set m31(val: number);
    get m32(): number;
    set m32(val: number);
    get m33(): number;
    set m33(val: number);
    private checkArray;
    getValues(): Matrix3Values;
    setValues(m11: number, m21: number, m31: number, m12: number, m22: number, m32: number, m13: number, m23: number, m33: number): this;
    equals(other: Matrix3): boolean;
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
    static rotationX(angle: number): Matrix3Base;
    setRotationX(angle: number): this;
    static rotationY(angle: number): Matrix3Base;
    setRotationY(angle: number): this;
    static rotationZ(angle: number): Matrix3Base;
    setRotationZ(angle: number): this;
    solve(b: Vector3): Vector3Values;
    solve2(vecB: Vector2): Vector2Values;
}
declare var Matrix3: Matrix3Constructor;
declare const Matrix3Injector: Injector<Matrix3Constructor>;
