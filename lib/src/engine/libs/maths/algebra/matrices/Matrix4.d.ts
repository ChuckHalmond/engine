import { Injector } from "../../../patterns/injectors/Injector";
import { Vector2, Vector2Values } from "../vectors/Vector2";
import { Vector3, Vector3Values } from "../vectors/Vector3";
import { Vector4, Vector4Values } from "../vectors/Vector4";
import { Matrix3Values } from "./Matrix3";
export { Matrix4Values };
export { Matrix4 };
export { Matrix4Injector };
export { Matrix4Base };
declare type Matrix4Values = [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
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
declare type Matrix34Values = [
    number,
    number,
    number,
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
interface Matrix4Constructor {
    readonly prototype: Matrix4;
    new (): Matrix4;
    new (values: Matrix4Values): Matrix4;
    translation(vector: Vector3): Matrix4;
    rotationX(angleInRadians: number): Matrix4;
    rotationY(angleInRadians: number): Matrix4;
    rotationZ(angleInRadians: number): Matrix4;
}
interface Matrix4 {
    readonly array: ArrayLike<number>;
    values: Matrix4Values;
    row1: Vector4Values;
    row2: Vector4Values;
    row3: Vector4Values;
    row4: Vector4Values;
    col1: Vector4Values;
    col2: Vector4Values;
    col3: Vector4Values;
    col4: Vector4Values;
    m11: number;
    m12: number;
    m13: number;
    m14: number;
    m21: number;
    m22: number;
    m23: number;
    m24: number;
    m31: number;
    m32: number;
    m33: number;
    m34: number;
    m41: number;
    m42: number;
    m43: number;
    m44: number;
    setArray(array: WritableArrayLike<number>): this;
    setValues(m: Matrix4Values): this;
    getAt(idx: number): number;
    setAt(idx: number, val: number): this;
    getEntry(row: number, col: number): number;
    setEntry(row: number, col: number, val: number): this;
    getRow(idx: number): Vector4Values;
    setRow(idx: number, row: Vector4Values): this;
    getCol(idx: number): Vector4Values;
    setCol(idx: number, col: Vector4Values): this;
    getUpper33(): Matrix3Values;
    setUpper33(m: Matrix3Values): this;
    getUpper34(): Matrix34Values;
    setUpper34(m: Matrix34Values): this;
    equals(mat: Matrix4): boolean;
    copy(mat: Matrix4): this;
    clone(): this;
    det(): number;
    trace(): number;
    setIdentity(): this;
    setZeros(): this;
    negate(): this;
    transpose(): this;
    invert(): this;
    add(mat: Matrix4): this;
    sub(mat: Matrix4): this;
    mult(mat: Matrix4): this;
    multScalar(k: number): this;
    getMaxScaleOnAxis(): number;
    solve(vecB: Vector4): Vector4Values;
    solve2(vecB: Vector2): Vector2Values;
    solve3(vecB: Vector3): Vector3Values;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
    setTranslation(vec: Vector3): this;
    translate(vec: Vector3): this;
    setRotationX(angleInRadians: number): this;
    rotateX(angleInRadians: number): this;
    setRotationY(angleInRadians: number): this;
    rotateY(angleInRadians: number): this;
    setRotationZ(angleInRadians: number): this;
    rotateZ(angleInRadians: number): this;
    rotate(x: number, y: number, z: number): this;
    axisRotation(axis: Vector3, angleInRadians: number): this;
    rotateAxis(axis: Vector3, angleInRadians: number): this;
    setScaling(vec: Vector3): this;
    scale(vec: Vector3): this;
    scaleScalar(k: number): this;
    lookAt(eye: Vector3 | Vector3Values, target: Vector3, up: Vector3): this;
    transformPoint(vec: Vector3): Vector3Values;
    transformDirection(vec: Vector3): Vector3Values;
    transformNormal(vec: Vector3): Vector3Values;
    asPerspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): this;
    asOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
}
declare class Matrix4Base {
    protected _array: WritableArrayLike<number>;
    constructor();
    constructor(values: Matrix4Values);
    get array(): ArrayLike<number>;
    get values(): Matrix4Values;
    set values(values: Matrix4Values);
    get row1(): Vector4Values;
    set row1(row1: Vector4Values);
    get row2(): Vector4Values;
    set row2(row2: Vector4Values);
    get row3(): Vector4Values;
    set row3(row3: Vector4Values);
    get row4(): Vector4Values;
    set row4(row4: Vector4Values);
    get col1(): Vector4Values;
    set col1(col1: Vector4Values);
    get col2(): Vector4Values;
    set col2(col2: Vector4Values);
    get col3(): Vector4Values;
    set col3(col3: Vector4Values);
    get col4(): Vector4Values;
    set col4(col4: Vector4Values);
    get m11(): number;
    set m11(m11: number);
    get m12(): number;
    set m12(m12: number);
    get m13(): number;
    set m13(m13: number);
    get m14(): number;
    set m14(m14: number);
    get m21(): number;
    set m21(m21: number);
    get m22(): number;
    set m22(m22: number);
    get m23(): number;
    set m23(m23: number);
    get m24(): number;
    set m24(m24: number);
    get m31(): number;
    set m31(m31: number);
    get m32(): number;
    set m32(m32: number);
    get m33(): number;
    set m33(m33: number);
    get m34(): number;
    set m34(m34: number);
    get m41(): number;
    set m41(m41: number);
    get m42(): number;
    set m42(m42: number);
    get m43(): number;
    set m43(m43: number);
    get m44(): number;
    set m44(m44: number);
    setArray(array: WritableArrayLike<number>): this;
    setValues(m: Matrix4Values): this;
    getUpper33(): Matrix3Values;
    setUpper33(m: Matrix3Values): this;
    getUpper34(): Matrix34Values;
    setUpper34(m: Matrix34Values): this;
    getRow(idx: number): Vector4Values;
    setRow(idx: number, row: Vector4Values): this;
    setCol(idx: number, col: Vector4Values): this;
    getCol(idx: number): Vector4Values;
    getAt(idx: number): number;
    setAt(idx: number, val: number): this;
    getEntry(row: number, col: number): number;
    setEntry(row: number, col: number, val: number): this;
    equals(mat: Matrix4): boolean;
    copy(mat: Matrix4): this;
    clone(): this;
    setIdentity(): this;
    setZeros(): this;
    det(): number;
    trace(): number;
    negate(): this;
    transpose(): this;
    invert(): this;
    inverseTranspose(): this;
    add(mat: Matrix4): this;
    sub(mat: Matrix4): this;
    mult(mat: Matrix4): this;
    multScalar(k: number): this;
    getMaxScaleOnAxis(): number;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
    solve(vecB: Vector4): Vector4Values;
    solve2(vecB: Vector2): Vector2Values;
    solve3(vecB: Vector3): Vector3Values;
    static translation(vec: Vector3): Matrix4Base;
    setTranslation(vec: Vector3): this;
    translate(vec: Vector3): this;
    static rotationX(angleInRadians: number): Matrix4Base;
    setRotationX(angleInRadians: number): this;
    rotateX(angleInRadians: number): this;
    static rotationY(angleInRadians: number): Matrix4Base;
    setRotationY(angleInRadians: number): this;
    rotateY(angleInRadians: number): this;
    static rotationZ(angleInRadians: number): Matrix4Base;
    setRotationZ(angleInRadians: number): this;
    rotateZ(angleInRadians: number): this;
    rotate(x: number, y: number, z: number): this;
    axisRotation(axis: Vector3, angleInRadians: number): this;
    rotateAxis(axis: Vector3, angleInRadians: number): this;
    setScaling(vec: Vector3): this;
    scale(vec: Vector3): this;
    scaleScalar(k: number): this;
    lookAt(eye: Vector3, target: Vector3, up: Vector3): this;
    transformPoint(vec: Vector3): Vector3Values;
    transformDirection(vec: Vector3): Vector3Values;
    transformNormal(vec: Vector3): Vector3Values;
    asPerspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): this;
    asOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
}
declare var Matrix4: Matrix4Constructor;
declare const Matrix4Injector: Injector<Matrix4Constructor>;
