import { Injector } from "../../../patterns/injectors/Injector";
import { MathError } from "../../MathError";
import { Vector2, Vector2Values } from "../vectors/Vector2";
import { Vector3, Vector3Values } from "../vectors/Vector3";
import { Vector4, Vector4Values } from "../vectors/Vector4";
import { Matrix3Values } from "./Matrix3";


export { Matrix4Values };
export { Matrix4 };
export { Matrix4Injector };
export { Matrix4Base };

type Matrix4Values = [
  number, number, number, number,
  number, number, number, number,
  number, number, number, number,
  number, number, number, number
];

type Matrix34Values = [
  number, number, number,
  number, number, number,
  number, number, number,
  number, number, number
];

interface Matrix4Constructor {
	readonly prototype: Matrix4;
	new(): Matrix4;
	new(values: Matrix4Values): Matrix4;
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

class Matrix4Base {
  protected _array: WritableArrayLike<number>;

	constructor()
	constructor(values: Matrix4Values)
	constructor(values?: Matrix4Values) {
		this._array = (values) ? [
      values[ 0], values[ 1], values[ 2], values[ 3],
      values[ 4], values[ 5], values[ 6], values[ 7],
      values[ 8], values[ 9], values[10], values[11],
      values[12], values[13], values[14], values[15]
		] : [
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0
    ];
  }
  
  public get array(): ArrayLike<number> {
    return this._array;
  }

  public get values(): Matrix4Values {
		return [
      this._array[ 0], this._array[ 1], this._array[ 2], this._array[ 3],
      this._array[ 4], this._array[ 5], this._array[ 6], this._array[ 7],
      this._array[ 8], this._array[ 9], this._array[10], this._array[11],
      this._array[12], this._array[13], this._array[14], this._array[15]
    ];
	}

	public set values(values: Matrix4Values) {
    this._array[ 0] = values[ 0];
    this._array[ 1] = values[ 1];
    this._array[ 2] = values[ 2];
    this._array[ 3] = values[ 3];
    this._array[ 4] = values[ 4];
    this._array[ 5] = values[ 5];
    this._array[ 6] = values[ 6];
    this._array[ 7] = values[ 7];
    this._array[ 8] = values[ 8];
    this._array[ 9] = values[ 9];
    this._array[10] = values[10];
    this._array[11] = values[11];
    this._array[12] = values[12];
    this._array[13] = values[13];
    this._array[14] = values[14];
    this._array[15] = values[15];
  }

  public get row1(): Vector4Values {
		return [
      this._array[0],
      this._array[1],
      this._array[2],
      this._array[3]
    ];
	}

	public set row1(row1: Vector4Values) {
    this._array[0] = row1[0];
    this._array[1] = row1[1];
    this._array[2] = row1[2];
    this._array[3] = row1[3];
  }

  public get row2(): Vector4Values {
		return [
      this._array[4],
      this._array[5],
      this._array[6],
      this._array[7]
    ];
	}

	public set row2(row2: Vector4Values) {
    this._array[4] = row2[0];
    this._array[5] = row2[1];
    this._array[6] = row2[2];
    this._array[7] = row2[3];
  }

  public get row3(): Vector4Values {
		return [
      this._array[ 8],
      this._array[ 9],
      this._array[10],
      this._array[11]
    ];
	}

	public set row3(row3: Vector4Values) {
    this._array[ 8] = row3[0];
    this._array[ 9] = row3[1];
    this._array[10] = row3[2];
    this._array[11] = row3[3];
  }

  public get row4(): Vector4Values {
		return [
      this._array[12],
      this._array[13],
      this._array[14],
      this._array[15]
    ];
	}

	public set row4(row4: Vector4Values) {
    this._array[12] = row4[0];
    this._array[13] = row4[1];
    this._array[14] = row4[2];
    this._array[15] = row4[3];
  }

  public get col1(): Vector4Values {
		return [
      this._array[ 0],
      this._array[ 4],
      this._array[ 8],
      this._array[12]
    ];
	}

	public set col1(col1: Vector4Values) {
    this._array[ 0] = col1[0];
    this._array[ 4] = col1[1];
    this._array[ 8] = col1[2];
    this._array[12] = col1[3];
  }

  public get col2(): Vector4Values {
		return [
      this._array[ 1],
      this._array[ 5],
      this._array[ 9],
      this._array[13]
    ];
	}

	public set col2(col2: Vector4Values) {
    this._array[ 1] = col2[0];
    this._array[ 5] = col2[1];
    this._array[ 9] = col2[2];
    this._array[13] = col2[3];
  }

  public get col3(): Vector4Values {
		return [
      this._array[ 2],
      this._array[ 6],
      this._array[10],
      this._array[14]
    ];
	}

	public set col3(col3: Vector4Values) {
    this._array[ 2] = col3[0];
    this._array[ 6] = col3[1];
    this._array[10] = col3[2];
    this._array[14] = col3[3];
  }

  public get col4(): Vector4Values {
		return [
      this._array[ 3],
      this._array[ 7],
      this._array[11],
      this._array[15]
    ];
	}

	public set col4(col4: Vector4Values) {
    this._array[ 3] = col4[0];
    this._array[ 7] = col4[1];
    this._array[11] = col4[2];
    this._array[15] = col4[3];
  }

  public get m11(): number {
		return this._array[0];
	}

	public set m11(m11: number) {
		this._array[0] = m11;
  }
  
  public get m12() {
		return this._array[1];
	}

	public set m12(m12: number) {
		this._array[1] = m12;
  }
  
  public get m13() {
		return this._array[2];
	}

	public set m13(m13: number) {
		this._array[2] = m13;
  }
  
  public get m14() {
		return this._array[3];
	}

	public set m14(m14: number) {
		this._array[3] = m14;
  }
  
  public get m21() {
		return this._array[4];
	}

	public set m21(m21: number) {
		this._array[4] = m21;
  }
  
  public get m22() {
		return this._array[5];
	}

	public set m22(m22: number) {
		this._array[5] = m22;
  }
  
  public get m23() {
		return this._array[6];
	}

	public set m23(m23: number) {
		this._array[6] = m23;
  }
  
  public get m24() {
		return this._array[7];
	}

	public set m24(m24: number) {
		this._array[7] = m24;
  }
  
  public get m31() {
		return this._array[8];
	}

  public set m31(m31: number) {
		this._array[8] = m31;
  }
  
  public get m32() {
		return this._array[9];
	}

	public set m32(m32: number) {
		this._array[9] = m32;
  }
  
  public get m33() {
		return this._array[10];
	}

  public set m33(m33: number) {
		this._array[10] = m33;
  }
  
  public get m34() {
		return this._array[11];
	}

	public set m34(m34: number) {
		this._array[11] = m34;
  }
  
  public get m41() {
		return this._array[12];
	}

	public set m41(m41: number) {
		this._array[12] = m41;
  }
  
  public get m42() {
		return this._array[13];
	}

	public set m42(m42: number) {
		this._array[13] = m42;
  }
  
  public get m43() {
		return this._array[14];
	}

	public set m43(m43: number) {
		this._array[14] = m43;
  }
  
  public get m44() {
		return this._array[15];
	}

	public set m44(m44: number) {
		this._array[15] = m44;
  }

	public setArray(array: WritableArrayLike<number>): this {
		if (array.length < 16) {
			throw new MathError(`Array must be of length 16 at least.`);
		}
		this._array = array;
		return this;
	}

  public setValues(m: Matrix4Values): this {
		const o = this._array;

    o[ 0] = m[ 0];
    o[ 1] = m[ 1];
    o[ 2] = m[ 2];
    o[ 3] = m[ 3];
    o[ 4] = m[ 4];
    o[ 5] = m[ 5];
    o[ 6] = m[ 6];
    o[ 7] = m[ 7];
    o[ 8] = m[ 8];
    o[ 9] = m[ 9];
    o[10] = m[10];
    o[11] = m[11];
    o[12] = m[12];
    o[13] = m[13];
    o[14] = m[14];
    o[15] = m[15];

    return this;
  }

  public getUpper33(): Matrix3Values {
    const m = this._array;

    return [
      m[ 0], m[ 1], m[ 2],
      m[ 4], m[ 5], m[ 6],
      m[ 8], m[ 9], m[10]
    ];
  }
  
  public setUpper33(m: Matrix3Values): this {
    const o = this._array;

    o[ 0] = m[0];
    o[ 1] = m[1];
    o[ 2] = m[2];
    o[ 4] = m[3];
    o[ 5] = m[4];
    o[ 6] = m[5];
    o[ 8] = m[6];
    o[ 9] = m[7];
    o[10] = m[8];

    return this;
  }

  public getUpper34(): Matrix34Values {
    const m = this._array;
    return [
      m[ 0], m[ 1], m[ 2], m[ 3],
      m[ 4], m[ 5], m[ 6], m[ 7],
      m[ 8], m[ 9], m[10], m[11]
    ];
  }

  public setUpper34(m : Matrix34Values): this {
    const o = this._array;

    o[ 0] = m[ 0];
    o[ 1] = m[ 1];
    o[ 2] = m[ 2];
    o[ 3] = m[ 3];
    o[ 4] = m[ 4];
    o[ 5] = m[ 5];
    o[ 6] = m[ 6];
    o[ 7] = m[ 7];
    o[ 8] = m[ 8];
    o[ 9] = m[ 9];
    o[10] = m[10];
    o[11] = m[11];

    return this;
  }

  public getRow(idx: number): Vector4Values {
    const m = this._array;
    const offset = idx * 4;

    return [
      m[offset    ],
      m[offset + 1],
      m[offset + 2],
      m[offset + 3]
    ];
  }

  public setRow(idx: number, row: Vector4Values): this {
    const o = this._array;
    const offset = idx * 4;

    o[offset    ] = row[0];
    o[offset + 1] = row[1];
    o[offset + 2] = row[2];
    o[offset + 3] = row[3];

    return this;
  }

  public setCol(idx: number, col: Vector4Values): this {
    const o = this._array;

    o[     idx] = col[0];
    o[4  + idx] = col[1];
    o[8  + idx] = col[2];
    o[12 + idx] = col[3];

    return this;
  }

  public getCol(idx: number): Vector4Values {
    const m = this._array;

    return [
      m[     idx],
      m[4  + idx],
      m[8  + idx],
      m[12 + idx]
    ];
  }

  public getAt(idx: number): number {
    return this._array[idx];
  }

  public setAt(idx: number, val: number): this {
    this._array[idx] = val;

    return this;
  }

  public getEntry(row: number, col: number): number {
    return this._array[4 * row + col];
  }

  public setEntry(row: number, col: number, val: number): this {
    this._array[4 * row + col] = val;

    return this;
  }

  public equals(mat: Matrix4): boolean {
    const o = this._array;
    const m = mat.array;

    return o[ 0] === m[ 0]
      && o[ 1] === m[ 1]
      && o[ 2] === m[ 2]
      && o[ 3] === m[ 3]
      && o[ 4] === m[ 4]
      && o[ 5] === m[ 5]
      && o[ 6] === m[ 6]
      && o[ 7] === m[ 7]
      && o[ 8] === m[ 8]
      && o[ 9] === m[ 9]
      && o[10] === m[10]
      && o[11] === m[11]
      && o[12] === m[12]
      && o[13] === m[13]
      && o[14] === m[14]
      && o[15] === m[15];
  }

  public copy(mat: Matrix4): this {
    const o = this._array;
    const m = mat.array;

    o[ 0] = m[ 0];
    o[ 1] = m[ 1];
    o[ 2] = m[ 2];
    o[ 3] = m[ 3];
    o[ 4] = m[ 4];
    o[ 5] = m[ 5];
    o[ 6] = m[ 6];
    o[ 7] = m[ 7];
    o[ 8] = m[ 8];
    o[ 9] = m[ 9];
    o[10] = m[10];
    o[11] = m[11];
    o[12] = m[12];
    o[13] = m[13];
    o[14] = m[14];
    o[15] = m[15];

    return this;
  }

  public clone(): this {
    return new Matrix4Base(this.values) as this;
  }

  public setIdentity(): this {
    const o = this._array;

    o[ 0] = 1;
    o[ 1] = 0;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = 1;
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = 0;
    o[10] = 1;
    o[11] = 0;
    o[12] = 0;
    o[13] = 0;
    o[14] = 0;
    o[15] = 1;

    return this;
  }

  public setZeros(): this {
    const o = this._array;

    o[ 0] = 0;
    o[ 1] = 0;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = 0;
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = 0;
    o[10] = 0;
    o[11] = 0;
    o[12] = 0;
    o[13] = 0;
    o[14] = 0;
    o[15] = 0;

    return this;
  }

  public det(): number {
    const o = this._array;

    const det2_01_01 = o[0] * o[5] - o[1] * o[4];
    const det2_01_02 = o[0] * o[6] - o[2] * o[4];
    const det2_01_03 = o[0] * o[7] - o[3] * o[4];
    const det2_01_12 = o[1] * o[6] - o[2] * o[5];
    const det2_01_13 = o[1] * o[7] - o[3] * o[5];
    const det2_01_23 = o[2] * o[7] - o[3] * o[6];
    const det3_201_012 = o[8] * det2_01_12 - o[ 9] * det2_01_02 + o[10] * det2_01_01;
    const det3_201_013 = o[8] * det2_01_13 - o[ 9] * det2_01_03 + o[11] * det2_01_01;
    const det3_201_023 = o[8] * det2_01_23 - o[10] * det2_01_03 + o[11] * det2_01_02;
    const det3_201_123 = o[9] * det2_01_23 - o[10] * det2_01_13 + o[11] * det2_01_12;

    return -det3_201_123 * o[12] + det3_201_023 * o[13]
      - det3_201_013 * o[14] + det3_201_012 * o[15];
  }

  public trace(): number {
    const o = this._array;

    return o[0] + o[5] + o[10] + o[15];
  }

  public negate(): this {
    const o = this._array;
    const m = this._array;

    o[ 0] = -m[ 0];
    o[ 1] = -m[ 1];
    o[ 2] = -m[ 2];
    o[ 3] = -m[ 3];
    o[ 4] = -m[ 4];
    o[ 5] = -m[ 5];
    o[ 6] = -m[ 6];
    o[ 7] = -m[ 7];
    o[ 8] = -m[ 8];
    o[ 9] = -m[ 9];
    o[10] = -m[10];
    o[11] = -m[11];
    o[12] = -m[12];
    o[13] = -m[13];
    o[14] = -m[14];
    o[15] = -m[15];

    return this;
  }

  public transpose(): this {
    const m = this._array;
    const o = this._array;

    o[ 0] = m[ 0];
    o[ 1] = m[ 4];
    o[ 2] = m[ 8];
    o[ 3] = m[12];
    o[ 4] = m[ 1];
    o[ 5] = m[ 5];
    o[ 6] = m[ 9];
    o[ 7] = m[13];
    o[ 8] = m[ 2];
    o[ 9] = m[ 6];
    o[10] = m[10];
    o[11] = m[14];
    o[12] = m[ 3];
    o[13] = m[ 7];
    o[14] = m[11];
    o[15] = m[15];
    
    return this;
  }

  public invert(): this {
    const o = this._array;

    const o00 = o[ 0];
    const o01 = o[ 1];
    const o02 = o[ 2];
    const o03 = o[ 3];
    const o10 = o[ 4];
    const o11 = o[ 5];
    const o12 = o[ 6];
    const o13 = o[ 7];
    const o20 = o[ 8];
    const o21 = o[ 9];
    const o22 = o[10];
    const o23 = o[11];
    const o30 = o[12];
    const o31 = o[13];
    const o32 = o[14];
    const o33 = o[15];

    const t00 = o00 * o11 - o01 * o10;
    const t01 = o00 * o12 - o02 * o10;
    const t02 = o00 * o13 - o03 * o10;
    const t03 = o01 * o12 - o02 * o11;
    const t04 = o01 * o13 - o03 * o11;
    const t05 = o02 * o13 - o03 * o12;
    const t06 = o20 * o31 - o21 * o30;
    const t07 = o20 * o32 - o22 * o30;
    const t08 = o20 * o33 - o23 * o30;
    const t09 = o21 * o32 - o22 * o31;
    const t10 = o21 * o33 - o23 * o31;
    const t11 = o22 * o33 - o23 * o32;

    const d = (t00 * t11 - t01 * t10 + t02 * t09 + t03 * t08 - t04 * t07 + t05 * t06);
    
    if (d == 0) {
      throw new MathError(`Matrix is not invertible.`);
    }

    const invDet = 1.0 / d;

    o[ 0] = (o11 * t11 - o12 * t10 + o13 * t09) * invDet;
    o[ 1] = (-o01 * t11 + o02 * t10 - o03 * t09) * invDet;
    o[ 2] = (o31 * t05 - o32 * t04 + o33 * t03) * invDet;
    o[ 3] = (-o21 * t05 + o22 * t04 - o23 * t03) * invDet;
    o[ 4] = (-o10 * t11 + o12 * t08 - o13 * t07) * invDet;
    o[ 5] = (o00 * t11 - o02 * t08 + o03 * t07) * invDet;
    o[ 6] = (-o30 * t05 + o32 * t02 - o33 * t01) * invDet;
    o[ 7] = (o20 * t05 - o22 * t02 + o23 * t01) * invDet;
    o[ 8] = (o10 * t10 - o11 * t08 + o13 * t06) * invDet;
    o[ 9] = (-o00 * t10 + o01 * t08 - o03 * t06) * invDet;
    o[10] = (o30 * t04 - o31 * t02 + o33 * t00) * invDet;
    o[11] = (-o20 * t04 + o21 * t02 - o23 * t00) * invDet;
    o[12] = (-o10 * t09 + o11 * t07 - o12 * t06) * invDet;
    o[13] = (o00 * t09 - o01 * t07 + o02 * t06) * invDet;
    o[14] = (-o30 * t03 + o31 * t01 - o32 * t00) * invDet;
    o[15] = (o20 * t03 - o21 * t01 + o22 * t00) * invDet;

    return this;
  }

  public inverseTranspose(): this {
    const o = this._array;

    const o00 = o[ 0];
    const o01 = o[ 1];
    const o02 = o[ 2];
    const o03 = o[ 3];
    const o10 = o[ 4];
    const o11 = o[ 5];
    const o12 = o[ 6];
    const o13 = o[ 7];
    const o20 = o[ 8];
    const o21 = o[ 9];
    const o22 = o[10];
    const o23 = o[11];
    const o30 = o[12];
    const o31 = o[13];
    const o32 = o[14];
    const o33 = o[15];

    const t00 = o00 * o11 - o01 * o10;
    const t01 = o00 * o12 - o02 * o10;
    const t02 = o00 * o13 - o03 * o10;
    const t03 = o01 * o12 - o02 * o11;
    const t04 = o01 * o13 - o03 * o11;
    const t05 = o02 * o13 - o03 * o12;
    const t06 = o20 * o31 - o21 * o30;
    const t07 = o20 * o32 - o22 * o30;
    const t08 = o20 * o33 - o23 * o30;
    const t09 = o21 * o32 - o22 * o31;
    const t10 = o21 * o33 - o23 * o31;
    const t11 = o22 * o33 - o23 * o32;

    const d = (t00 * t11 - t01 * t10 + t02 * t09 + t03 * t08 - t04 * t07 + t05 * t06);
    
    if (d == 0) {
      throw new MathError(`Matrix is not inversible.`);
    }

    const invDet = 1.0 / d;

    const m11 = (o11 * t11 - o12 * t10 + o13 * t09) * invDet;
    const m12 = (-o01 * t11 + o02 * t10 - o03 * t09) * invDet;
    const m13 = (o31 * t05 - o32 * t04 + o33 * t03) * invDet;
    const m14 = (-o21 * t05 + o22 * t04 - o23 * t03) * invDet;
    const m21 = (-o10 * t11 + o12 * t08 - o13 * t07) * invDet;
    const m22 = (o00 * t11 - o02 * t08 + o03 * t07) * invDet;
    const m23 = (-o30 * t05 + o32 * t02 - o33 * t01) * invDet;
    const m24 = (o20 * t05 - o22 * t02 + o23 * t01) * invDet;
    const m31 = (o10 * t10 - o11 * t08 + o13 * t06) * invDet;
    const m32 = (-o00 * t10 + o01 * t08 - o03 * t06) * invDet;
    const m33 = (o30 * t04 - o31 * t02 + o33 * t00) * invDet;
    const m34 = (-o20 * t04 + o21 * t02 - o23 * t00) * invDet;
    const m41 = (-o10 * t09 + o11 * t07 - o12 * t06) * invDet;
    const m42 = (o00 * t09 - o01 * t07 + o02 * t06) * invDet;
    const m43 = (-o30 * t03 + o31 * t01 - o32 * t00) * invDet;
    const m44 = (o20 * t03 - o21 * t01 + o22 * t00) * invDet;

    o[ 0] = m11;
    o[ 1] = m12;
    o[ 2] = m13;
    o[ 3] = m14;
    o[ 4] = m21;
    o[ 5] = m22;
    o[ 6] = m23;
    o[ 7] = m24;
    o[ 8] = m31;
    o[ 9] = m32;
    o[10] = m33;
    o[11] = m34;
    o[12] = m41;
    o[13] = m42;
    o[14] = m43;
    o[15] = m44;

    return this;
  }

  public add(mat: Matrix4): this {
    const o = this._array;
    const m = mat.array;

    o[ 0] = o[ 0] + m[ 0];
    o[ 1] = o[ 1] + m[ 1];
    o[ 2] = o[ 2] + m[ 2];
    o[ 3] = o[ 3] + m[ 3];
    o[ 4] = o[ 4] + m[ 4];
    o[ 5] = o[ 5] + m[ 5];
    o[ 6] = o[ 6] + m[ 6];
    o[ 7] = o[ 7] + m[ 7];
    o[ 8] = o[ 8] + m[ 8];
    o[ 9] = o[ 9] + m[ 9];
    o[10] = o[10] + m[10];
    o[11] = o[11] + m[11];
    o[12] = o[12] + m[12];
    o[13] = o[13] + m[13];
    o[14] = o[14] + m[14];
    o[15] = o[15] + m[15];

    return this;
  }

  public sub(mat: Matrix4): this {
    const o = this._array;
    const m = mat.array;

    o[ 0] = o[ 0] - m[ 0];
    o[ 1] = o[ 1] - m[ 1];
    o[ 2] = o[ 2] - m[ 2];
    o[ 3] = o[ 3] - m[ 3];
    o[ 4] = o[ 4] - m[ 4];
    o[ 5] = o[ 5] - m[ 5];
    o[ 6] = o[ 6] - m[ 6];
    o[ 7] = o[ 7] - m[ 7];
    o[ 8] = o[ 8] - m[ 8];
    o[ 9] = o[ 9] - m[ 9];
    o[10] = o[10] - m[10];
    o[11] = o[11] - m[11];
    o[12] = o[12] - m[12];
    o[13] = o[13] - m[13];
    o[14] = o[14] - m[14];
    o[15] = o[15] - m[15];

    return this;
  }

  public mult(mat: Matrix4): this {
    const o = this._array;
    const m = mat.array;

    const a11 = o[     0];
    const a12 = o[     1];
    const a13 = o[     2];
    const a14 = o[     3];
    const a21 = o[ 4 + 0];
    const a22 = o[ 4 + 1];
    const a23 = o[ 4 + 2];
    const a24 = o[ 4 + 3];
    const a31 = o[ 8 + 0];
    const a32 = o[ 8 + 1];
    const a33 = o[ 8 + 2];
    const a34 = o[ 8 + 3];
    const a41 = o[12 + 0];
    const a42 = o[12 + 1];
    const a43 = o[12 + 2];
    const a44 = o[12 + 3];
    const b11 = m[     0];
    const b12 = m[     1];
    const b13 = m[     2];
    const b14 = m[     3];
    const b21 = m[ 4 + 0];
    const b22 = m[ 4 + 1];
    const b23 = m[ 4 + 2];
    const b24 = m[ 4 + 3];
    const b31 = m[ 8 + 0];
    const b32 = m[ 8 + 1];
    const b33 = m[ 8 + 2];
    const b34 = m[ 8 + 3];
    const b41 = m[12 + 0];
    const b42 = m[12 + 1];
    const b43 = m[12 + 2];
    const b44 = m[12 + 3];

    o[ 0] = a11 * b11 + a21 * b12 + a31 * b13 + a41 * b14;
    o[ 1] = a12 * b11 + a22 * b12 + a32 * b13 + a42 * b14;
    o[ 2] = a13 * b11 + a23 * b12 + a33 * b13 + a43 * b14;
    o[ 3] = a14 * b11 + a24 * b12 + a34 * b13 + a44 * b14;
    o[ 4] = a11 * b21 + a21 * b22 + a31 * b23 + a41 * b24;
    o[ 5] = a12 * b21 + a22 * b22 + a32 * b23 + a42 * b24;
    o[ 6] = a13 * b21 + a23 * b22 + a33 * b23 + a43 * b24;
    o[ 7] = a14 * b21 + a24 * b22 + a34 * b23 + a44 * b24;
    o[ 8] = a11 * b31 + a21 * b32 + a31 * b33 + a41 * b34;
    o[ 9] = a12 * b31 + a22 * b32 + a32 * b33 + a42 * b34;
    o[10] = a13 * b31 + a23 * b32 + a33 * b33 + a43 * b34;
    o[11] = a14 * b31 + a24 * b32 + a34 * b33 + a44 * b34;
    o[12] = a11 * b41 + a21 * b42 + a31 * b43 + a41 * b44;
    o[13] = a12 * b41 + a22 * b42 + a32 * b43 + a42 * b44;
    o[14] = a13 * b41 + a23 * b42 + a33 * b43 + a43 * b44;
    o[15] = a14 * b41 + a24 * b42 + a34 * b43 + a44 * b44;

    return this;
  }

  public multScalar(k: number): this {
    const o = this._array;
    
    o[ 0] = o[ 0] * k;
    o[ 1] = o[ 1] * k;
    o[ 2] = o[ 2] * k;
    o[ 3] = o[ 3] * k;
    o[ 4] = o[ 4] * k;
    o[ 5] = o[ 5] * k;
    o[ 6] = o[ 6] * k;
    o[ 7] = o[ 7] * k;
    o[ 8] = o[ 8] * k;
    o[ 9] = o[ 9] * k;
    o[10] = o[10] * k;
    o[11] = o[11] * k;
    o[12] = o[12] * k;
    o[13] = o[13] * k;
    o[14] = o[14] * k;
    o[15] = o[15] * k;

    return this;
  }

	public getMaxScaleOnAxis(): number {
    const o = this._array;

    const scaleXSq = o[ 0] * o[ 0] + o[ 1] * o[ 1] + o[ 2] * o[ 2];
    const scaleYSq = o[ 4] * o[ 4] + o[ 5] * o[ 5] + o[ 6] * o[ 6];
    const scaleZSq = o[ 8] * o[ 8] + o[ 9] * o[ 9] + o[10] * o[10];

    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }

  public writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const m = this._array;

		out[offset     ] = m[ 0];
		out[offset +  1] = m[ 1];
    out[offset +  2] = m[ 2];
    out[offset +  3] = m[ 3];
		out[offset +  4] = m[ 4];
    out[offset +  5] = m[ 5];
    out[offset +  6] = m[ 6];
		out[offset +  7] = m[ 7];
    out[offset +  8] = m[ 8];
    out[offset +  9] = m[ 9];
		out[offset + 10] = m[10];
    out[offset + 11] = m[11];
    out[offset + 12] = m[12];
		out[offset + 13] = m[13];
    out[offset + 14] = m[14];
    out[offset + 15] = m[15];
  }
    
  public readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
    const o = this._array;

    o[ 0] = arr[offset     ];
    o[ 1] = arr[offset +  1];
    o[ 2] = arr[offset +  2];
    o[ 3] = arr[offset +  3];
    o[ 4] = arr[offset +  4];
    o[ 5] = arr[offset +  5];
    o[ 6] = arr[offset +  6];
    o[ 7] = arr[offset +  7];
    o[ 8] = arr[offset +  8];
    o[ 9] = arr[offset +  9];
    o[10] = arr[offset + 10];
    o[11] = arr[offset + 11];
    o[12] = arr[offset + 12];
    o[13] = arr[offset + 13];
    o[14] = arr[offset + 14];
    o[15] = arr[offset + 15];

    return this;
  }

  public solve(vecB: Vector4): Vector4Values {
    const a = this._array;

    const a11 = a[ 0];
    const a12 = a[ 1];
    const a13 = a[ 2];
    const a14 = a[ 3];
    const a21 = a[ 4];
    const a22 = a[ 5];
    const a23 = a[ 6];
    const a24 = a[ 7];
    const a31 = a[ 8];
    const a32 = a[ 9];
    const a33 = a[10];
    const a34 = a[11];
    const a41 = a[12];
    const a42 = a[13];
    const a43 = a[14];
    const a44 = a[15];
    const b00 = a11 * a22 - a12 * a21;
    const b01 = a11 * a23 - a13 * a21;
    const b02 = a11 * a24 - a14 * a21;
    const b03 = a12 * a23 - a13 * a22;
    const b04 = a12 * a24 - a14 * a22;
    const b05 = a13 * a24 - a14 * a23;
    const b06 = a31 * a42 - a32 * a41;
    const b07 = a31 * a43 - a33 * a41;
    const b08 = a31 * a44 - a34 * a41;
    const b09 = a32 * a43 - a33 * a42;
    const b10 = a32 * a44 - a34 * a42;
    const b11 = a33 * a44 - a34 * a43;

    const bX = vecB.x;
    const bY = vecB.y;
    const bZ = vecB.z;
    const bW = vecB.w;

    let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

    if (det != 0.0) {
      det = 1.0 / det;
    }

    const x = det *
      ((a22 * b11 - a23 * b10 + a24 * b09) * bX -
      (a21 * b11 - a23 * b08 + a24 * b07) * bY +
      (a21 * b10 - a22 * b08 + a24 * b06) * bZ -
      (a21 * b09 - a22 * b07 + a23 * b06) * bW)
    const y = det *
      -((a12 * b11 - a13 * b10 + a14 * b09) * bX -
      (a11 * b11 - a13 * b08 + a14 * b07) * bY +
      (a11 * b10 - a12 * b08 + a14 * b06) * bZ -
      (a11 * b09 - a12 * b07 + a13 * b06) * bW)
    const z = det *
      ((a42 * b05 - a43 * b04 + a44 * b03) * bX -
      (a41 * b05 - a43 * b02 + a44 * b01) * bY +
      (a41 * b04 - a42 * b02 + a44 * b00) * bZ -
      (a41 * b03 - a42 * b01 + a43 * b00) * bW)
    const w = det *
      -((a32 * b05 - a33 * b04 + a34 * b03) * bX -
      (a31 * b05 - a33 * b02 + a34 * b01) * bY +
      (a31 * b04 - a32 * b02 + a34 * b00) * bZ -
      (a31 * b03 - a32 * b01 + a33 * b00) * bW);
    
    return [
      x, y, z, w
    ];
  }

  public solve2(vecB: Vector2): Vector2Values {
    const a = this._array;

    const a11 = a[0];
    const a12 = a[1];
    const a21 = a[4];
    const a22 = a[5];
    const bx = vecB.x - a[8];
    const by = vecB.y - a[9];
    
    let det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
      det = 1.0 / det;
    }

    const x = det * (a22 * bx - a12 * by);
    const y = det * (a11 * by - a21 * bx);

    return [
      x, y
    ];
  }

  public solve3(vecB: Vector3): Vector3Values {
    const a = this._array;

    const a11 = a[ 0];
    const a12 = a[ 1];
    const a13 = a[ 2];
    const a21 = a[ 4];
    const a22 = a[ 5];
    const a23 = a[ 6];
    const a31 = a[ 8];
    const a32 = a[ 9];
    const a33 = a[10];
    const bx = vecB.x - a[12];
    const by = vecB.y - a[13];
    const bz = vecB.z - a[14];

    let rx = a22 * a33 - a23 * a32;
    let ry = a23 * a31 - a21 * a33;
    let rz = a21 * a32 - a22 * a31;

    let det = a11 * rx + a12 * ry + a13 * rz;
    if (det != 0.0) {
      det = 1.0 / det;
    }

    const x = det * (bx * rx + by * ry + bz * rz);

    rx = -(a32 * bz - a33 * by);
    ry = -(a33 * bx - a31 * bz);
    rz = -(a31 * by - a32 * bx);
    
    const y = det * (a11 * rx + a12 * ry + a13 * rz);
    
    rx = -(by * a23 - bz * a22);
    ry = -(bz * a21 - bx * a23);
    rz = -(bx * a22 - by * a21);
    
    const z = det * (a11 * rx + a12 * ry + a13 * rz);

    return [
      x, y, z
    ];
  }

  public static translation(vec: Vector3): Matrix4Base {
    return new Matrix4Base().setTranslation(vec);
  }

  public setTranslation(vec: Vector3): this {
    const o = this._array;
    const x = vec.x;
    const y = vec.y;
    const z = vec.z;

    o[ 0] = 1;
    o[ 1] = 0;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = 1;
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = 0;
    o[10] = 1;
    o[11] = 0;
    o[12] = x;
    o[13] = y;
    o[14] = z;
    o[15] = 1;

    return this;
  }

  public translate(vec: Vector3): this {
    const o = this._array;

    const m11 = o[ 0];
    const m12 = o[ 1];
    const m13 = o[ 2];
    const m14 = o[ 3];
    const m21 = o[ 4];
    const m22 = o[ 5];
    const m23 = o[ 6];
    const m24 = o[ 7];
    const m31 = o[ 8];
    const m32 = o[ 9];
    const m33 = o[10];
    const m34 = o[11];
    const m41 = o[12];
    const m42 = o[13];
    const m43 = o[14];
    const m44 = o[15];

    const x = vec.x;
    const y = vec.y;
    const z = vec.z;

    o[12] = m11 * x + m21 * y + m31 * z + m41;
    o[13] = m12 * x + m22 * y + m32 * z + m42;
    o[14] = m13 * x + m23 * y + m33 * z + m43;
    o[15] = m14 * x + m24 * y + m34 * z + m44;

    return this;
  }

  public static rotationX(angleInRadians: number): Matrix4Base {
    return new Matrix4Base().setRotationX(angleInRadians);
  }

  public setRotationX(angleInRadians: number): this {
    const o = this._array;
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    o[ 0] = 1;
    o[ 1] = 0;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = c;
    o[ 6] = s;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = -s;
    o[10] = -c;
    o[11] = 0;
    o[12] = 0;
    o[13] = 0;
    o[14] = 0;
    o[15] = 1;

    return this;
  }

  public rotateX(angleInRadians: number): this {
    const o = this._array;

    const m21 = o[ 4];
    const m22 = o[ 5];
    const m23 = o[ 6];
    const m24 = o[ 7];
    const m31 = o[ 8];
    const m32 = o[ 9];
    const m33 = o[10];
    const m34 = o[11];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    o[ 8] = c * m21 + s * m31;
    o[ 9] = c * m22 + s * m32;
    o[10] = c * m23 + s * m33;
    o[11] = c * m24 + s * m34;
    o[12] = c * m31 - s * m21;
    o[13] = c * m32 - s * m22;
    o[14] = c * m33 - s * m23;
    o[15] = c * m34 - s * m24;

    return this;
  }

  public static rotationY(angleInRadians: number): Matrix4Base {
    return new Matrix4Base().setRotationY(angleInRadians);
  }

  public setRotationY(angleInRadians: number): this {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const o = this._array;

    o[ 0] = c;
    o[ 1] = 0;
    o[ 2] = -s;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = 1;
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = s;
    o[ 9] = 0;
    o[10] = c;
    o[11] = 0;
    o[12] = 0;
    o[13] = 0;
    o[14] = 0;
    o[15] = 1;
    
    return this;
  }

  public rotateY(angleInRadians: number): this {
    const o = this._array;

    const m11 = o[ 0];
    const m12 = o[ 1];
    const m13 = o[ 2];
    const m14 = o[ 3];
    const m31 = o[ 8];
    const m32 = o[ 9];
    const m33 = o[10];
    const m34 = o[11];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);

    o[ 0] = c * m11 - s * m31;
    o[ 1] = c * m12 - s * m32;
    o[ 2] = c * m13 - s * m33;
    o[ 3] = c * m14 - s * m34;

    o[12] = c * m31 + s * m11;
    o[13] = c * m32 + s * m12;
    o[14] = c * m33 + s * m13;
    o[15] = c * m34 + s * m14;

    return this;
  }

  public static rotationZ(angleInRadians: number): Matrix4Base {
    return new Matrix4Base().setRotationZ(angleInRadians);
  }

  public setRotationZ(angleInRadians: number): this {
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const o = this._array;

    o[ 0] = c;
    o[ 1] = s;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = -s;
    o[ 5] = c;
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = 0;
    o[10] = 1;
    o[11] = 0;
    o[12] = 0;
    o[13] = 0;
    o[14] = 0;
    o[15] = 1;

    return this;
  }

  public rotateZ(angleInRadians: number): this {
    const o = this._array;
    const m11 = o[0];
    const m12 = o[1];
    const m13 = o[2];
    const m14 = o[3];
    const m21 = o[4];
    const m22 = o[5];
    const m23 = o[6];
    const m24 = o[7];
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    
    o[ 4] = c * m11 + s * m21;
    o[ 5] = c * m12 + s * m22;
    o[ 6] = c * m13 + s * m23;
    o[ 7] = c * m14 + s * m24;
    o[ 8] = c * m21 - s * m11;
    o[ 9] = c * m22 - s * m12;
    o[10] = c * m23 - s * m13;
    o[11] = c * m24 - s * m14;

    return this;
  }

  public rotate(x: number, y: number, z: number): this {
    this.rotateX(x);
    this.rotateY(y);
    this.rotateZ(z);

    return this;
  }

  public axisRotation(axis: Vector3, angleInRadians: number): this {
    let x = axis.x;
    let y = axis.y;
    let z = axis.z;

    const n = Math.sqrt(x * x + y * y + z * z);
    x /= n;
    y /= n;
    z /= n;
    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const oneMinusCosine = 1 - c;
    const o = this._array;

    o[ 0] = xx + (1 - xx) * c;
    o[ 1] = x * y * oneMinusCosine + z * s;
    o[ 2] = x * z * oneMinusCosine - y * s;
    o[ 3] = 0;
    o[ 4] = x * y * oneMinusCosine - z * s;
    o[ 5] = yy + (1 - yy) * c;
    o[ 6] = y * z * oneMinusCosine + x * s;
    o[ 7] = 0;
    o[ 8] = x * z * oneMinusCosine + y * s;
    o[ 9] = y * z * oneMinusCosine - x * s;
    o[10] = zz + (1 - zz) * c;
    o[11] = 0;
    o[12] = 0;
    o[13] = 0;
    o[14] = 0;
    o[15] = 1;

    return this;
  }

  public rotateAxis(axis: Vector3, angleInRadians: number): this {
    const o = this._array;

    let x = axis.x;
    let y = axis.y;
    let z = axis.z;
    const n = Math.sqrt(x * x + y * y + z * z);
    x /= n;
    y /= n;
    z /= n;

    const xx = x * x;
    const yy = y * y;
    const zz = z * z;
    const c = Math.cos(angleInRadians);
    const s = Math.sin(angleInRadians);
    const oneMinusCosine = 1 - c;

    const r11 = xx + (1 - xx) * c;
    const r12 = x * y * oneMinusCosine + z * s;
    const r13 = x * z * oneMinusCosine - y * s;
    const r21 = x * y * oneMinusCosine - z * s;
    const r22 = yy + (1 - yy) * c;
    const r23 = y * z * oneMinusCosine + x * s;
    const r31 = x * z * oneMinusCosine + y * s;
    const r32 = y * z * oneMinusCosine - x * s;
    const r33 = zz + (1 - zz) * c;

    const m11 = o[ 0];
    const m12 = o[ 1];
    const m13 = o[ 2];
    const m14 = o[ 3];
    const m21 = o[ 4];
    const m22 = o[ 5];
    const m23 = o[ 6];
    const m24 = o[ 7];
    const m31 = o[ 8];
    const m32 = o[ 9];
    const m33 = o[10];
    const m34 = o[11];

    o[ 0] = r11 * m11 + r12 * m21 + r13 * m31;
    o[ 1] = r11 * m12 + r12 * m22 + r13 * m32;
    o[ 2] = r11 * m13 + r12 * m23 + r13 * m33;
    o[ 3] = r11 * m14 + r12 * m24 + r13 * m34;
    o[ 4] = r21 * m11 + r22 * m21 + r23 * m31;
    o[ 5] = r21 * m12 + r22 * m22 + r23 * m32;
    o[ 6] = r21 * m13 + r22 * m23 + r23 * m33;
    o[ 7] = r21 * m14 + r22 * m24 + r23 * m34;
    o[ 8] = r31 * m11 + r32 * m21 + r33 * m31;
    o[ 9] = r31 * m12 + r32 * m22 + r33 * m32;
    o[10] = r31 * m13 + r32 * m23 + r33 * m33;
    o[11] = r31 * m14 + r32 * m24 + r33 * m34;

    return this;
  }

  public setScaling(vec: Vector3): this {
    const x = vec.x;
    const y = vec.y;
    const z = vec.z;
    const o = this._array;

    o[ 0] = x;
    o[ 1] = 0;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = y;
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = 0;
    o[10] = z;
    o[11] = 0;
    o[12] = 0;
    o[13] = 0;
    o[14] = 0;
    o[15] = 1;

    return this;
  }

  public scale(vec: Vector3): this {
    const o = this._array;

    const x = vec.x;
    const y = vec.y;
    const z = vec.z;

    o[ 0] = x * o[ 0];
    o[ 1] = x * o[ 1];
    o[ 2] = x * o[ 2];
    o[ 3] = x * o[ 3];
    o[ 4] = y * o[ 4];
    o[ 5] = y * o[ 5];
    o[ 6] = y * o[ 6];
    o[ 7] = y * o[ 7];
    o[ 8] = z * o[ 8];
    o[ 9] = z * o[ 9];
    o[10] = z * o[10];
    o[11] = z * o[11];

    return this;
  }

  public scaleScalar(k: number): this {
    const o = this._array;

    o[ 0] = k * o[ 0];
    o[ 1] = k * o[ 1];
    o[ 2] = k * o[ 2];
    o[ 3] = k * o[ 3];
    o[ 4] = k * o[ 4];
    o[ 5] = k * o[ 5];
    o[ 6] = k * o[ 6];
    o[ 7] = k * o[ 7];
    o[ 8] = k * o[ 8];
    o[ 9] = k * o[ 9];
    o[10] = k * o[10];
    o[11] = k * o[11];

    return this;
  }


  public lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
    const o = this._array;

    const e = eye.array;
    const e0 = e[0];
		const e1 = e[1];
    const e2 = e[2];

    const t = target.array;
    const t0 = t[0];
		const t1 = t[1];
    const t2 = t[2];

    const u = up.array;
    const u0 = u[0];
		const u1 = u[1];
    const u2 = u[2];

    let z0 = e0 - t0;
		let z1 = e1 - t1;
    let z2 = e2 - t2;
    const zLen = Math.sqrt(z0 * z0 + z1 * z1 + z2 * z2);
    if (zLen > Number.EPSILON) {
      z0 = z0 / zLen;
      z1 = z1 / zLen;
      z2 = z2 / zLen;
		}
		else {
			z0 = 0;
			z1 = 0;
			z2 = 0;
    }

    let x0 = u1 * z2 - u2 * z1;
		let x1 = u2 * z0 - u0 * z2;
    let x2 = u0 * z1 - u1 * z0;
    const xLen = Math.sqrt(x0 * x0 + x1 * x1 + x2 * x2);
    if (xLen > Number.EPSILON) {
      x0 = x0 / xLen;
      x1 = x1 / xLen;
      x2 = x2 / xLen;
		}
		else {
			x0 = 0;
			x1 = 0;
			x2 = 0;
    }

    let y0 = z1 * x2 - z2 * x1;
		let y1 = z2 * x0 - z0 * x2;
		let y2 = z0 * x1 - z1 * x0;
    const yLen = Math.sqrt(y0 * y0 + y1 * y1 + y2 * y2);
    if (yLen > Number.EPSILON) {
      y0 = y0 / yLen;
      y1 = y1 / yLen;
      y2 = y2 / yLen;
		}
		else {
			y0 = 0;
			y1 = 0;
			y2 = 0;
    }

    o[ 0] = x0;
    o[ 1] = x1;
    o[ 2] = x2;
    o[ 3] = 0;
    o[ 4] = y0;
    o[ 5] = y1;
    o[ 6] = y2;
    o[ 7] = 0;
    o[ 8] = z0;
    o[ 9] = z1;
    o[10] = z2;
    o[11] = 0;
    o[12] = e0;
    o[13] = e1;
    o[14] = e2;
    o[15] = 1;

    return this;
  }

  public transformPoint(vec: Vector3): Vector3Values {
    const m = this._array;

    const x = vec.x;
    const y = vec.y;
    const z = vec.z;
    const d = x * m[3] + y * m[7] + z * m[11] + m[15];

    return [
        (x * m[0] + y * m[4] + z * m[ 8] + m[12]) / d,
        (x * m[1] + y * m[5] + z * m[ 9] + m[13]) / d,
        (x * m[2] + y * m[6] + z * m[10] + m[14]) / d
    ];
  }

  public transformDirection(vec: Vector3): Vector3Values {
    const m = this._array;

    const x = vec.x;
    const y = vec.y;
    const z = vec.z;

    return [
        x * m[0] + y * m[4] + z * m[ 8],
        x * m[1] + y * m[5] + z * m[ 9],
        x * m[2] + y * m[6] + z * m[10]
    ];
  }

  public transformNormal(vec: Vector3): Vector3Values {
    let out: Vector3Values;

    const backup = this.values;

    const m = this.invert().array;

    const x = vec.x;
    const y = vec.y;
    const z = vec.z;

    out = [
      x * m[0] + y * m[4] + z * m[ 8],
      x * m[1] + y * m[5] + z * m[ 9],
      x * m[2] + y * m[6] + z * m[10]
    ];

    this.values = backup;

    return out;
  }

  public asPerspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): this {
    const f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewYInRadians);
    const rangeInv = 1.0 / (zNear - zFar);
    const o = this._array;

    o[ 0] = f / aspect;
    o[ 1] = 0;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = f;
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = 0;
    o[10] = (zNear + zFar) * rangeInv;
    o[11] = -1;
    o[12] = 0;
    o[13] = 0;
    o[14] = zNear * zFar * rangeInv * 2;
    o[15] = 0;
    
    return this;
  }

  public asOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    const o = this._array;

    o[ 0] = 2 / (right - left);
    o[ 1] = 0;
    o[ 2] = 0;
    o[ 3] = 0;
    o[ 4] = 0;
    o[ 5] = 2 / (top - bottom);
    o[ 6] = 0;
    o[ 7] = 0;
    o[ 8] = 0;
    o[ 9] = 0;
    o[10] = 2 / (near - far);
    o[11] = 0;
    o[12] = (right + left) / (left - right);
    o[13] = (top + bottom) / (bottom - top);
    o[14] = (far + near) / (near - far);
    o[15] = 1;
    
    return this;
  }
}

var Matrix4: Matrix4Constructor = Matrix4Base;
const Matrix4Injector: Injector<Matrix4Constructor> = new Injector({
	defaultCtor: Matrix4Base,
	onDefaultOverride:
		(ctor: Matrix4Constructor) => {
			Matrix4 = ctor;
		}
});