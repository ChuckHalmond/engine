import { Injector } from "../../../patterns/injectors/Injector";
import { Quaternion } from "../quaternions/Quaternion";
import { Vector2, Vector2Values } from "../vectors/Vector2";
import { Vector3, Vector3Values } from "../vectors/Vector3";
import { Vector4, Vector4Values } from "../vectors/Vector4";
import { Matrix3 } from "./Matrix3";
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
interface Matrix4Constructor {
    readonly prototype: Matrix4;
    new (): Matrix4;
    new (m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number): Matrix4;
    new (array: ArrayLike<number>): Matrix4;
    fromValues(m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number): Matrix4;
    fromArray(array: ArrayLike<number>): Matrix4;
    invert(A: Matrix4, out: Matrix4): Matrix4;
    transpose(A: Matrix4, out: Matrix4): Matrix4;
    add(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4;
    sub(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4;
    mult(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4;
    identity(): Matrix4;
    zeros(): Matrix4;
    translation(vector: Vector3): Matrix4;
    rotationX(angle: number): Matrix4;
    rotationY(angle: number): Matrix4;
    rotationZ(angle: number): Matrix4;
    rotation(matrix: Matrix3): Matrix4;
    scaling(vector: Vector3): Matrix4;
    perspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): Matrix4;
    orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
    frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
}
/**
 * 4x4 matrix. Values are stored in column major order.
 */
interface Matrix4 {
    readonly array: Float32Array;
    getValues(): Matrix4Values;
    setValues(m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number): this;
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
    getRotation(): Quaternion;
    setRotation(rotation: Quaternion): this;
    setTRS(translation: Vector3, rotation: Quaternion, scaling: Vector3): this;
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
    getMaxScaleOnAxis(): number;
    solve(vecB: Vector4): Vector4Values;
    solve2(vecB: Vector2): Vector2Values;
    solve3(vecB: Vector3): Vector3Values;
    writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
    setTranslation(vector: Vector3): this;
    translate(vector: Vector3): this;
    setRotationX(angle: number): this;
    rotateX(angle: number): this;
    setRotationY(angle: number): this;
    rotateY(angle: number): this;
    setRotationZ(angle: number): this;
    rotateZ(angle: number): this;
    rotate(vector: Vector3, angle: number): this;
    rotation(matrix: Matrix3): this;
    setScaling(vector: Vector3): this;
    scale(vector: Vector3): this;
    lookAt(eye: Vector3 | Vector3Values, target: Vector3, up: Vector3): this;
    transformPoint(point: Vector3): Vector3;
    transformPoint4(point: Vector4): Vector4;
    transformDirection(direction: Vector3): Vector3;
    transformNormal(normal: Vector3): Vector3;
    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    setPerspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): this;
    setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
}
declare class Matrix4Base implements Matrix4 {
    readonly array: Float32Array;
    constructor();
    constructor(m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number);
    constructor(array: ArrayLike<number>);
    static fromValues(m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number): Matrix4Base;
    static fromArray(array: ArrayLike<number>): Matrix4Base;
    getValues(): Matrix4Values;
    setValues(m11: number, m21: number, m31: number, m41: number, m12: number, m22: number, m32: number, m42: number, m13: number, m23: number, m33: number, m43: number, m14: number, m24: number, m34: number, m44: number): this;
    get m11(): number;
    set m11(val: number);
    get m12(): number;
    set m12(val: number);
    get m13(): number;
    set m13(val: number);
    get m14(): number;
    set m14(val: number);
    get m21(): number;
    set m21(val: number);
    get m22(): number;
    set m22(val: number);
    get m23(): number;
    set m23(val: number);
    get m24(): number;
    set m24(val: number);
    get m31(): number;
    set m31(val: number);
    get m32(): number;
    set m32(val: number);
    get m33(): number;
    set m33(val: number);
    get m34(): number;
    set m34(m34: number);
    get m41(): number;
    set m41(val: number);
    get m42(): number;
    set m42(val: number);
    get m43(): number;
    set m43(val: number);
    get m44(): number;
    set m44(m44: number);
    private checkArray;
    getRotation(): Quaternion;
    setTRS(translation: Vector3, rotation: Quaternion, scaling: Vector3): this;
    setRotation(quaternion: Quaternion): this;
    equals(mat: Matrix4): boolean;
    copy(mat: Matrix4): this;
    clone(): this;
    static identity(): Matrix4Base;
    setIdentity(): this;
    static zeros(): Matrix4Base;
    setZeros(): this;
    det(): number;
    trace(): number;
    static negate(A: Matrix4, out: Matrix4): Matrix4;
    negate(): this;
    static transpose(A: Matrix4, out: Matrix4): Matrix4;
    transpose(): this;
    static invert(A: Matrix4, out: Matrix4): Matrix4;
    invert(): this;
    static add(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4;
    add(matrix: Matrix4): this;
    static sub(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4;
    sub(matrix: Matrix4): this;
    static mult(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4;
    mult(matrix: Matrix4): this;
    getMaxScaleOnAxis(): number;
    writeIntoArray(array: WritableArrayLike<number>, offset?: number): void;
    readFromArray(array: ArrayLike<number>, offset?: number): this;
    solve(vecB: Vector4): Vector4Values;
    solve2(vecB: Vector2): Vector2Values;
    solve3(vecB: Vector3): Vector3Values;
    static translation(vector: Vector3): Matrix4Base;
    setTranslation(vec: Vector3): this;
    translate(vector: Vector3): this;
    static rotationX(angle: number): Matrix4Base;
    setRotationX(angle: number): this;
    rotateX(angle: number): this;
    static rotationY(angle: number): Matrix4Base;
    setRotationY(angle: number): this;
    rotateY(angle: number): this;
    static rotationZ(angle: number): Matrix4Base;
    setRotationZ(angle: number): this;
    rotateZ(angle: number): this;
    static rotation(matrix: Matrix3): Matrix4Base;
    rotation(matrix: Matrix3): this;
    rotate(axis: Vector3, angle: number): this;
    static scaling(vec: Vector3): Matrix4Base;
    setScaling(vec: Vector3): this;
    scale(vec: Vector3): this;
    static lookAt(eye: Vector3, target: Vector3, up: Vector3, out: Matrix4): Matrix4;
    lookAt(eye: Vector3, target: Vector3, up: Vector3): this;
    transformPoint(point: Vector3): Vector3;
    transformPoint4(point: Vector4): Vector4;
    transformDirection(direction: Vector3): Vector3;
    transformNormal(normal: Vector3): Vector3;
    static perspective(fov: number, aspect: number, zNear: number, zFar: number): Matrix4Base;
    setPerspective(fov: number, aspect: number, zNear: number, zFar: number): this;
    static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4Base;
    setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
    static frustum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4Base;
    setFrustum(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
}
declare var Matrix4: Matrix4Constructor;
declare const Matrix4Injector: Injector<Matrix4Constructor>;
