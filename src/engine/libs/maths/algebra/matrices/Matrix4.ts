import { Injector } from "../../../patterns/injectors/Injector";
import { Vector3Pool } from "../../extensions/pools/Vector3Pools";
import { MathError } from "../../MathError";
import { Quaternion } from "../quaternions/Quaternion";
import { Vector2, Vector2Values } from "../vectors/Vector2";
import { Vector3, Vector3Values } from "../vectors/Vector3";
import { Vector4, Vector4Values } from "../vectors/Vector4";
import { Matrix3, Matrix3Values } from "./Matrix3";

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

interface Matrix4Constructor {
	readonly prototype: Matrix4;
	new(): Matrix4;
	new(
    m11: number, m21: number, m31: number, m41: number,
    m12: number, m22: number, m32: number, m42: number,
    m13: number, m23: number, m33: number, m43: number,
    m14: number, m24: number, m34: number, m44: number
  ): Matrix4;
  new(array: ArrayLike<number>): Matrix4;

  fromValues(
    m11: number, m21: number, m31: number, m41: number,
    m12: number, m22: number, m32: number, m42: number,
    m13: number, m23: number, m33: number, m43: number,
    m14: number, m24: number, m34: number, m44: number
  ): Matrix4;
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
  frustrum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4;
}

/**
 * 4x4 matrix. Values are stored in column major order.
 */
interface Matrix4 {
  readonly array: Float32Array;
  getValues(): Matrix4Values
  setValues(
    m11: number, m21: number, m31: number, m41: number,
    m12: number, m22: number, m32: number, m42: number,
    m13: number, m23: number, m33: number, m43: number,
    m14: number, m24: number, m34: number, m44: number
  ): this;
  /*row1: Vector4Values;
  row2: Vector4Values;
  row3: Vector4Values;
  row4: Vector4Values;
  col1: Vector4Values;
  col2: Vector4Values;
  col3: Vector4Values;
  col4: Vector4Values;*/
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
  //setArray(array: WritableArrayLike<number>): this;
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

  rotate(vector: Vector3, angle: number): this
  rotation(matrix: Matrix3): this;

  setScaling(vector: Vector3): this;
  scale(vector: Vector3): this;

  lookAt(eye: Vector3 | Vector3Values, target: Vector3, up: Vector3): this;

  transformPoint(point: Vector3): Vector3;
  transformDirection(direction: Vector3): Vector3;
  transformNormal(normal: Vector3): Vector3;
  
  setFrustrum(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
  setPerspective(fieldOfViewYInRadians: number, aspect: number, zNear: number, zFar: number): this;
  setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this;
}

class Matrix4Base implements Matrix4 {
  readonly array: Float32Array;

	constructor()
  constructor(
    m11: number, m21: number, m31: number, m41: number,
    m12: number, m22: number, m32: number, m42: number,
    m13: number, m23: number, m33: number, m43: number,
    m14: number, m24: number, m34: number, m44: number
  )
  constructor(array: ArrayLike<number>)
	constructor(
    ...args: any[]
  ) {
		if (typeof args[0] === "number") {
			this.array = new Float32Array([
        args[ 0], args[ 1], args[ 2], args[ 3],
        args[ 4], args[ 5], args[ 6], args[ 7],
        args[ 8], args[ 9], args[10], args[11],
        args[12], args[13], args[14], args[15]
      ]);
		}
		else if (typeof args[0] === "object") {
      const array = args[0];
      this.checkArray(array);
      if (array instanceof Float32Array) {
        this.array = array;
      }
      else {
        this.array = new Float32Array(array);
      }
		}
		else {
			this.array = new Float32Array(16);
		}
  }

  static fromValues(
    m11: number, m21: number, m31: number, m41: number,
    m12: number, m22: number, m32: number, m42: number,
    m13: number, m23: number, m33: number, m43: number,
    m14: number, m24: number, m34: number, m44: number
  ): Matrix4Base {
    return new Matrix4Base(
      m11, m21, m31, m41,
      m12, m22, m32, m42,
      m13, m23, m33, m43,
      m14, m24, m34, m44
    );
  }

  static fromArray(array: ArrayLike<number>): Matrix4Base {
    if (array.length < 16) {
      throw new Error(`Matrix4 needs an array of size 16 at least.`);
    }
    return new Matrix4Base(array);
  }

  getValues(): Matrix4Values {
    const thisArray = this.array;
		return [
      thisArray[ 0], thisArray[ 1], thisArray[ 2], thisArray[ 3],
      thisArray[ 4], thisArray[ 5], thisArray[ 6], thisArray[ 7],
      thisArray[ 8], thisArray[ 9], thisArray[10], thisArray[11],
      thisArray[12], thisArray[13], thisArray[14], thisArray[15]
    ];
	}

	setValues(
    m11: number, m21: number, m31: number, m41: number,
    m12: number, m22: number, m32: number, m42: number,
    m13: number, m23: number, m33: number, m43: number,
    m14: number, m24: number, m34: number, m44: number
  ): this {
    const thisArray = this.array;
    thisArray[ 0] = m11;
    thisArray[ 1] = m21;
    thisArray[ 2] = m31;
    thisArray[ 3] = m41;
    thisArray[ 4] = m12;
    thisArray[ 5] = m22;
    thisArray[ 6] = m32;
    thisArray[ 7] = m42;
    thisArray[ 8] = m13;
    thisArray[ 9] = m23;
    thisArray[10] = m33;
    thisArray[11] = m43;
    thisArray[12] = m14;
    thisArray[13] = m24;
    thisArray[14] = m34;
    thisArray[15] = m44;

    return this;
  }
  
  get m11(): number {
		return this.array[0];
	}

	set m11(val: number) {
		this.array[0] = val;
  }
  
  get m12() {
		return this.array[4];
	}

	set m12(val: number) {
		this.array[4] = val;
  }
  
  get m13() {
		return this.array[8];
	}

	set m13(val: number) {
		this.array[8] = val;
  }
  
  get m14() {
		return this.array[12];
	}

	set m14(val: number) {
		this.array[12] = val;
  }
  
  get m21() {
		return this.array[1];
	}

	set m21(val: number) {
		this.array[1] = val;
  }
  
  get m22() {
		return this.array[5];
	}

	set m22(val: number) {
		this.array[5] = val;
  }
  
  get m23() {
		return this.array[9];
	}

	set m23(val: number) {
		this.array[9] = val;
  }
  
  get m24() {
		return this.array[13];
	}

	set m24(val: number) {
		this.array[13] = val;
  }
  
  get m31() {
		return this.array[2];
	}

  set m31(val: number) {
		this.array[2] = val;
  }
  
  get m32() {
		return this.array[6];
	}

	set m32(val: number) {
		this.array[6] = val;
  }
  
  get m33() {
		return this.array[10];
	}

  set m33(val: number) {
		this.array[10] = val;
  }
  
  get m34() {
		return this.array[14];
	}

	set m34(m34: number) {
		this.array[14] = m34;
  }
  
  get m41() {
		return this.array[3];
	}

	set m41(val: number) {
		this.array[3] = val;
  }
  
  get m42() {
		return this.array[7];
	}

	set m42(val: number) {
		this.array[7] = val;
  }
  
  get m43() {
		return this.array[11];
	}

	set m43(val: number) {
		this.array[11] = val;
  }
  
  get m44() {
		return this.array[15];
	}

	set m44(m44: number) {
		this.array[15] = m44;
  }

  private checkArray(array: ArrayLike<number>): void {
		if (array.length < 16) {
			throw new MathError(`Array must be of length 16 at least.`);
		}
	}

	// setArray(array: WritableArrayLike<number>): this {
	// 	this._checkArray(array);
	// 	thisArray = array;
	// 	return this;
	// }

  getRotation(): Quaternion {
    const thisArray = this.array;
    const m11 = thisArray[0], m12 = thisArray[4], m13 = thisArray[ 8],
          m21 = thisArray[1], m22 = thisArray[5], m23 = thisArray[ 9],
          m31 = thisArray[2], m32 = thisArray[6], m33 = thisArray[10];
    const trace = m11 + m22 + m33;
    
    let x = 0;
    let y = 0;
    let z = 0;
    let w = 0;

    if (trace > 0) {
      const s = Math.sqrt(trace + 1) * 2;
      w = 0.25 * s;
      x = (m32 - m23) / s;
      y = (m13 - m31) / s;
      z = (m21 - m12) / s;
    }
    else if (m11 > m22 && m11 > m33) {
      const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
      w = (m32 - m23) / s;
      x = 0.25 * s;
      y = (m12 + m21) / s;
      z = (m13 + m31) / s;
    }
    else if (m22 > m33) {
      const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
      w = (m13 - m31) / s;
      x = (m12 + m21) / s;
      y = 0.25 * s;
      z = (m23 + m32) / s;
    }
    else {
      const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
      w = (m21 - m12) / s;
      x = (m13 + m31) / s;
      y = (m23 + m32) / s;
      z = 0.25 * s;
    }
    
    return new Quaternion(x, y, z, w);
  }

  setTRS(translation: Vector3, rotation: Quaternion, scaling: Vector3): this {
    const thisArray = this.array;
    const rotationArray = rotation.array;
    const translationArray = translation.array;
    const scalingArray = scaling.array;

    const x = rotationArray[0];
    const y = rotationArray[1];
    const z = rotationArray[2];
    const w = rotationArray[3];

    const x2 = x + x;
    const y2 = y + y;
    const z2 = z + z;

    const xx = x * x2;
    const xy = x * y2;
    const xz = x * z2;
    const yy = y * y2;
    const yz = y * z2;
    const zz = z * z2;
    const wx = w * x2;
    const wy = w * y2;
    const wz = w * z2;
    const sx = scalingArray[0];
    const sy = scalingArray[1];
    const sz = scalingArray[2];

    thisArray[0] = (1 - (yy + zz)) * sx;
    thisArray[1] = (xy + wz) * sx;
    thisArray[2] = (xz - wy) * sx;
    thisArray[3] = 0;
    thisArray[4] = (xy - wz) * sy;
    thisArray[5] = (1 - (xx + zz)) * sy;
    thisArray[6] = (yz + wx) * sy;
    thisArray[7] = 0;
    thisArray[8] = (xz + wy) * sz;
    thisArray[9] = (yz - wx) * sz;
    thisArray[10] = (1 - (xx + yy)) * sz;
    thisArray[11] = 0;
    thisArray[12] = translationArray[0];
    thisArray[13] = translationArray[1];
    thisArray[14] = translationArray[2];
    thisArray[15] = 1;

    return this;
  }
  
  setRotation(quaternion: Quaternion): this {
    const thisArray = this.array;
    const quaternionArray = quaternion.array;
		const quaternionLengthSquared = quaternion.lengthSquared();
		const s = 2.0 / quaternionLengthSquared;

		const x = quaternionArray[0];
		const y = quaternionArray[1];
		const z = quaternionArray[2];
		const w = quaternionArray[3];

		const xs = x * s;
		const ys = y * s;
		const zs = z * s;
	  
		const wx = w * xs;
		const wy = w * ys;
		const wz = w * zs;
	  
		const xx = x * xs;
		const xy = x * ys;
		const xz = x * zs;
		
		const yy = y * ys;
		const yz = y * zs;
		const zz = z * zs;

    const m11 = 1 - (yy + zz);
    const m21 = xy + wz;
    const m31 = xz - wy;
    const m12 = xy - wz;
    const m22 = 1 - (xx + zz);
    const m32 = yz + wx;
    const m13 = xz + wy;
    const m23 = yz - wx;
    const m33 = 1 - (xx + yy);

    thisArray[ 0] = m11;
    thisArray[ 1] = m21;
    thisArray[ 2] = m31;
    thisArray[ 4] = m12;
    thisArray[ 5] = m22;
    thisArray[ 6] = m32;
    thisArray[ 8] = m13;
    thisArray[ 9] = m23;
    thisArray[10] = m33;

    return this;
  }

  equals(mat: Matrix4): boolean {
    const thisArray = this.array;
    const matArray = mat.array;
    return thisArray[ 0] === matArray[ 0]
      && thisArray[ 1] === matArray[ 1]
      && thisArray[ 2] === matArray[ 2]
      && thisArray[ 3] === matArray[ 3]
      && thisArray[ 4] === matArray[ 4]
      && thisArray[ 5] === matArray[ 5]
      && thisArray[ 6] === matArray[ 6]
      && thisArray[ 7] === matArray[ 7]
      && thisArray[ 8] === matArray[ 8]
      && thisArray[ 9] === matArray[ 9]
      && thisArray[10] === matArray[10]
      && thisArray[11] === matArray[11]
      && thisArray[12] === matArray[12]
      && thisArray[13] === matArray[13]
      && thisArray[14] === matArray[14]
      && thisArray[15] === matArray[15];
  }

  copy(mat: Matrix4): this {
    const thisArray = this.array;
    const matArray = mat.array;

    thisArray[ 0] = matArray[ 0];
    thisArray[ 1] = matArray[ 1];
    thisArray[ 2] = matArray[ 2];
    thisArray[ 3] = matArray[ 3];
    thisArray[ 4] = matArray[ 4];
    thisArray[ 5] = matArray[ 5];
    thisArray[ 6] = matArray[ 6];
    thisArray[ 7] = matArray[ 7];
    thisArray[ 8] = matArray[ 8];
    thisArray[ 9] = matArray[ 9];
    thisArray[10] = matArray[10];
    thisArray[11] = matArray[11];
    thisArray[12] = matArray[12];
    thisArray[13] = matArray[13];
    thisArray[14] = matArray[14];
    thisArray[15] = matArray[15];

    return this;
  }

  clone(): this {
    const thisArray = this.array;
    return new Matrix4Base(
      thisArray[ 0], thisArray[ 1], thisArray[ 2], thisArray[ 3],
      thisArray[ 4], thisArray[ 5], thisArray[ 6], thisArray[ 7],
      thisArray[ 8], thisArray[ 9], thisArray[10], thisArray[11],
      thisArray[12], thisArray[13], thisArray[14], thisArray[15]
    ) as this;
  }

  static identity(): Matrix4Base {
    return new Matrix4Base(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    );
  }

  setIdentity(): this {
    const thisArray = this.array;
    thisArray[ 0] = 1;
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = 1;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = 0;
    thisArray[10] = 1;
    thisArray[11] = 0;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = 0;
    thisArray[15] = 1;

    return this;
  }

  static zeros(): Matrix4Base {
    return new Matrix4Base(
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0,
      0, 0, 0, 0
    );
  }

  setZeros(): this {
    const thisArray = this.array;
    thisArray[ 0] = 0;
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = 0;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = 0;
    thisArray[10] = 0;
    thisArray[11] = 0;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = 0;
    thisArray[15] = 0;

    return this;
  }

  det(): number {
    const thisArray = this.array;
    const det2_01_01 = thisArray[0] * thisArray[5] - thisArray[1] * thisArray[4];
    const det2_01_02 = thisArray[0] * thisArray[6] - thisArray[2] * thisArray[4];
    const det2_01_03 = thisArray[0] * thisArray[7] - thisArray[3] * thisArray[4];
    const det2_01_12 = thisArray[1] * thisArray[6] - thisArray[2] * thisArray[5];
    const det2_01_13 = thisArray[1] * thisArray[7] - thisArray[3] * thisArray[5];
    const det2_01_23 = thisArray[2] * thisArray[7] - thisArray[3] * thisArray[6];
    const det3_201_012 = thisArray[8] * det2_01_12 - thisArray[ 9] * det2_01_02 + thisArray[10] * det2_01_01;
    const det3_201_013 = thisArray[8] * det2_01_13 - thisArray[ 9] * det2_01_03 + thisArray[11] * det2_01_01;
    const det3_201_023 = thisArray[8] * det2_01_23 - thisArray[10] * det2_01_03 + thisArray[11] * det2_01_02;
    const det3_201_123 = thisArray[9] * det2_01_23 - thisArray[10] * det2_01_13 + thisArray[11] * det2_01_12;

    return -det3_201_123 * thisArray[12] + det3_201_023 * thisArray[13]
      - det3_201_013 * thisArray[14] + det3_201_012 * thisArray[15];
  }

  trace(): number {
    const thisArray = this.array;
    return thisArray[0] + thisArray[5] + thisArray[10] + thisArray[15];
  }

  static negate(A: Matrix4, out: Matrix4): Matrix4 {
    const a = A.array;
    const o = out.array;

    o[ 0] = -a[ 0];
    o[ 1] = -a[ 1];
    o[ 2] = -a[ 2];
    o[ 3] = -a[ 3];
    o[ 4] = -a[ 4];
    o[ 5] = -a[ 5];
    o[ 6] = -a[ 6];
    o[ 7] = -a[ 7];
    o[ 8] = -a[ 8];
    o[ 9] = -a[ 9];
    o[10] = -a[10];
    o[11] = -a[11];
    o[12] = -a[12];
    o[13] = -a[13];
    o[14] = -a[14];
    o[15] = -a[15];

    return out;
  }

  negate(): this {
    return Matrix4Base.negate(this, this) as this;
  }

  static transpose(A: Matrix4, out: Matrix4): Matrix4 {
    const a = A.array;
    const o = out.array;

    const a11 = a[ 0];
    const a21 = a[ 1];
    const a31 = a[ 2];
    const a41 = a[ 3];
    const a12 = a[ 4];
    const a22 = a[ 5];
    const a32 = a[ 6];
    const a42 = a[ 7];
    const a13 = a[ 8];
    const a23 = a[ 9];
    const a33 = a[10];
    const a43 = a[11];
    const a14 = a[12];
    const a24 = a[13];
    const a34 = a[14];
    const a44 = a[15];

    o[ 0] = a11;
    o[ 1] = a12;
    o[ 2] = a13;
    o[ 3] = a14;
    o[ 4] = a21;
    o[ 5] = a22;
    o[ 6] = a23;
    o[ 7] = a24;
    o[ 8] = a31;
    o[ 9] = a32;
    o[10] = a33;
    o[11] = a34;
    o[12] = a41;
    o[13] = a42;
    o[14] = a43;
    o[15] = a44;
    
    return out;
  }

  transpose(): this {
    return Matrix4Base.transpose(this, this) as this;
  }

  static invert(A: Matrix4, out: Matrix4): Matrix4 {
    const a = A.array;
    const o = out.array;

    const o00 = a[ 0];
    const o01 = a[ 1];
    const o02 = a[ 2];
    const o03 = a[ 3];
    const o10 = a[ 4];
    const o11 = a[ 5];
    const o12 = a[ 6];
    const o13 = a[ 7];
    const o20 = a[ 8];
    const o21 = a[ 9];
    const o22 = a[10];
    const o23 = a[11];
    const o30 = a[12];
    const o31 = a[13];
    const o32 = a[14];
    const o33 = a[15];

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

    const invDet = 1 / d;

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

    return out;
  }

  invert(): this {
    return Matrix4Base.invert(this, this) as this;
  }

  static add(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4 {
    const a = A.array;
    const b = B.array;
    const o = out.array;

    o[ 0] = a[ 0] + b[ 0];
    o[ 1] = a[ 1] + b[ 1];
    o[ 2] = a[ 2] + b[ 2];
    o[ 3] = a[ 3] + b[ 3];
    o[ 4] = a[ 4] + b[ 4];
    o[ 5] = a[ 5] + b[ 5];
    o[ 6] = a[ 6] + b[ 6];
    o[ 7] = a[ 7] + b[ 7];
    o[ 8] = a[ 8] + b[ 8];
    o[ 9] = a[ 9] + b[ 9];
    o[10] = a[10] + b[10];
    o[11] = a[11] + b[11];
    o[12] = a[12] + b[12];
    o[13] = a[13] + b[13];
    o[14] = a[14] + b[14];
    o[15] = a[15] + b[15];

    return out;
  }

  add(matrix: Matrix4): this {
    return Matrix4Base.add(this, matrix, this) as this;
  }

  static sub(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4 {
    const a = A.array;
    const b = B.array;
    const o = out.array;

    o[ 0] = a[ 0] - b[ 0];
    o[ 1] = a[ 1] - b[ 1];
    o[ 2] = a[ 2] - b[ 2];
    o[ 3] = a[ 3] - b[ 3];
    o[ 4] = a[ 4] - b[ 4];
    o[ 5] = a[ 5] - b[ 5];
    o[ 6] = a[ 6] - b[ 6];
    o[ 7] = a[ 7] - b[ 7];
    o[ 8] = a[ 8] - b[ 8];
    o[ 9] = a[ 9] - b[ 9];
    o[10] = a[10] - b[10];
    o[11] = a[11] - b[11];
    o[12] = a[12] - b[12];
    o[13] = a[13] - b[13];
    o[14] = a[14] - b[14];
    o[15] = a[15] - b[15];

    return out;
  }

  sub(matrix: Matrix4): this {
    return Matrix4Base.sub(this, matrix, this) as this;
  }

  static mult(A: Matrix4, B: Matrix4, out: Matrix4): Matrix4 {
    const a = A.array;
    const b = B.array;
    const o = out.array;

    const a11 = a[ 0];
    const a21 = a[ 1];
    const a31 = a[ 2];
    const a41 = a[ 3];
    const a12 = a[ 4];
    const a22 = a[ 5];
    const a32 = a[ 6];
    const a42 = a[ 7];
    const a13 = a[ 8];
    const a23 = a[ 9];
    const a33 = a[10];
    const a43 = a[11];
    const a14 = a[12];
    const a24 = a[13];
    const a34 = a[14];
    const a44 = a[15];

    const b11 = b[ 0];
    const b21 = b[ 1];
    const b31 = b[ 2];
    const b41 = b[ 3];
    const b12 = b[ 4];
    const b22 = b[ 5];
    const b32 = b[ 6];
    const b42 = b[ 7];
    const b13 = b[ 8];
    const b23 = b[ 9];
    const b33 = b[10];
    const b43 = b[11];
    const b14 = b[12];
    const b24 = b[13];
    const b34 = b[14];
    const b44 = b[15];

    o[ 0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
    o[ 1] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
    o[ 2] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
    o[ 3] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
    o[ 4] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
    o[ 5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
    o[ 6] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
    o[ 7] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
    o[ 8] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
    o[ 9] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
    o[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
    o[11] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
    o[12] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;
    o[13] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;
    o[14] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;
    o[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

    return out;
  }

  mult(matrix: Matrix4): this {
    return Matrix4Base.mult(this, matrix, this) as this;
  }

	getMaxScaleOnAxis(): number {
    const thisArray = this.array;
    const scaleXSq = thisArray[ 0] * thisArray[ 0] + thisArray[ 1] * thisArray[ 1] + thisArray[ 2] * thisArray[ 2];
    const scaleYSq = thisArray[ 4] * thisArray[ 4] + thisArray[ 5] * thisArray[ 5] + thisArray[ 6] * thisArray[ 6];
    const scaleZSq = thisArray[ 8] * thisArray[ 8] + thisArray[ 9] * thisArray[ 9] + thisArray[10] * thisArray[10];

    return Math.sqrt(Math.max(scaleXSq, scaleYSq, scaleZSq));
  }

  writeIntoArray(array: WritableArrayLike<number>, offset: number = 0): void {
    const thisArray = this.array;
		array[offset     ] = thisArray[ 0];
		array[offset +  1] = thisArray[ 1];
    array[offset +  2] = thisArray[ 2];
    array[offset +  3] = thisArray[ 3];
		array[offset +  4] = thisArray[ 4];
    array[offset +  5] = thisArray[ 5];
    array[offset +  6] = thisArray[ 6];
		array[offset +  7] = thisArray[ 7];
    array[offset +  8] = thisArray[ 8];
    array[offset +  9] = thisArray[ 9];
		array[offset + 10] = thisArray[10];
    array[offset + 11] = thisArray[11];
    array[offset + 12] = thisArray[12];
		array[offset + 13] = thisArray[13];
    array[offset + 14] = thisArray[14];
    array[offset + 15] = thisArray[15];
  }
    
  readFromArray(array: ArrayLike<number>, offset: number = 0): this {
    const thisArray = this.array;
    thisArray[ 0] = array[offset     ];
    thisArray[ 1] = array[offset +  1];
    thisArray[ 2] = array[offset +  2];
    thisArray[ 3] = array[offset +  3];
    thisArray[ 4] = array[offset +  4];
    thisArray[ 5] = array[offset +  5];
    thisArray[ 6] = array[offset +  6];
    thisArray[ 7] = array[offset +  7];
    thisArray[ 8] = array[offset +  8];
    thisArray[ 9] = array[offset +  9];
    thisArray[10] = array[offset + 10];
    thisArray[11] = array[offset + 11];
    thisArray[12] = array[offset + 12];
    thisArray[13] = array[offset + 13];
    thisArray[14] = array[offset + 14];
    thisArray[15] = array[offset + 15];

    return this;
  }

  solve(vecB: Vector4): Vector4Values {
    const a = this.array;

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

    if (det != 0) {
      det = 1 / det;
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

  solve2(vecB: Vector2): Vector2Values {
    const a = this.array;

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

  solve3(vecB: Vector3): Vector3Values {
    const a = this.array;

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

  static translation(vector: Vector3): Matrix4Base {
    return new Matrix4Base().setTranslation(vector);
  }

  setTranslation(vec: Vector3): this {
    const thisArray = this.array;
    const vecArray = vec.array;

    const x = vecArray[0];
    const y = vecArray[1];
    const z = vecArray[2];

    /*thisArray[ 0] = 1;
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = 1;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = 0;
    thisArray[10] = 1;
    thisArray[11] = 0;*/
    thisArray[12] = x;
    thisArray[13] = y;
    thisArray[14] = z;
    //thisArray[15] = 1;

    return this;
  }

  translate(vector: Vector3): this {
    const thisArray = this.array;
    const vectorArray = vector.array;

    const tx = vectorArray[0];
    const ty = vectorArray[1];
    const tz = vectorArray[2];
    const tw = 1;

    const t1 = thisArray[0] * tx + thisArray[4] * ty + thisArray[ 8] * tz + thisArray[12] * tw;
    const t2 = thisArray[1] * tx + thisArray[5] * ty + thisArray[ 9] * tz + thisArray[13] * tw;
    const t3 = thisArray[2] * tx + thisArray[6] * ty + thisArray[10] * tz + thisArray[14] * tw;
    const t4 = thisArray[3] * tx + thisArray[7] * ty + thisArray[11] * tz + thisArray[15] * tw;

    thisArray[12] = t1;
    thisArray[13] = t2;
    thisArray[14] = t3;
    thisArray[15] = t4;

    return this;
  }

  static rotationX(angle: number): Matrix4Base {
    return new Matrix4Base().setRotationX(angle);
  }

  setRotationX(angle: number): this {
    const thisArray = this.array;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    thisArray[ 0] = 1;
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = cosAngle;
    thisArray[ 6] = sinAngle;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = -sinAngle;
    thisArray[10] = cosAngle;
    thisArray[11] = 0;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = 0;
    thisArray[15] = 1;

    return this;
  }

  rotateX(angle: number): this {
    const thisArray = this.array;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const t1 = thisArray[4] *  cosAngle + thisArray[ 8] * sinAngle;
    const t2 = thisArray[5] *  cosAngle + thisArray[ 9] * sinAngle;
    const t3 = thisArray[6] *  cosAngle + thisArray[10] * sinAngle;
    const t4 = thisArray[7] *  cosAngle + thisArray[11] * sinAngle;
    const t5 = thisArray[4] * -sinAngle + thisArray[ 8] * cosAngle;
    const t6 = thisArray[5] * -sinAngle + thisArray[ 9] * cosAngle;
    const t7 = thisArray[6] * -sinAngle + thisArray[10] * cosAngle;
    const t8 = thisArray[7] * -sinAngle + thisArray[11] * cosAngle;

    thisArray[ 4] = t1;
    thisArray[ 5] = t2;
    thisArray[ 6] = t3;
    thisArray[ 7] = t4;
    thisArray[ 8] = t5;
    thisArray[ 9] = t6;
    thisArray[10] = t7;
    thisArray[11] = t8;

    return this;
  }

  static rotationY(angle: number): Matrix4Base {
    return new Matrix4Base().setRotationY(angle);
  }

  setRotationY(angle: number): this {
    const thisArray = this.array;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    thisArray[ 0] = cosAngle;
    thisArray[ 1] = 0;
    thisArray[ 2] = -sinAngle;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = 1;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = sinAngle;
    thisArray[ 9] = 0;
    thisArray[10] = cosAngle;
    thisArray[11] = 0;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = 0;
    thisArray[15] = 1;
    
    return this;
  }

  rotateY(angle: number): this {
    const thisArray = this.array;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const t1 = thisArray[ 0] * cosAngle + thisArray[ 8] * -sinAngle;
    const t2 = thisArray[ 1] * cosAngle + thisArray[ 9] * -sinAngle;
    const t3 = thisArray[ 2] * cosAngle + thisArray[10] * -sinAngle;
    const t4 = thisArray[ 3] * cosAngle + thisArray[11] * -sinAngle;
    const t5 = thisArray[ 0] * sinAngle + thisArray[ 8] *  cosAngle;
    const t6 = thisArray[ 1] * sinAngle + thisArray[ 9] *  cosAngle;
    const t7 = thisArray[ 2] * sinAngle + thisArray[10] *  cosAngle;
    const t8 = thisArray[ 3] * sinAngle + thisArray[11] *  cosAngle;

    thisArray[ 0] = t1;
    thisArray[ 1] = t2;
    thisArray[ 2] = t3;
    thisArray[ 3] = t4;
    thisArray[ 8] = t5;
    thisArray[ 9] = t6;
    thisArray[10] = t7;
    thisArray[11] = t8;

    return this;
  }

  static rotationZ(angle: number): Matrix4Base {
    return new Matrix4Base().setRotationZ(angle);
  }

  setRotationZ(angle: number): this {
    const thisArray = this.array;
    const cosAngle = Math.cos(angle);
    const sinAngles = Math.sin(angle);

    thisArray[ 0] = cosAngle;
    thisArray[ 1] = sinAngles;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = -sinAngles;
    thisArray[ 5] = cosAngle;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = 0;
    thisArray[10] = 1;
    thisArray[11] = 0;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = 0;
    thisArray[15] = 1;

    return this;
  }

  rotateZ(angle: number): this {
    const thisArray = this.array;
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    const t1 = thisArray[0] *  cosAngle + thisArray[4] * sinAngle;
    const t2 = thisArray[1] *  cosAngle + thisArray[5] * sinAngle;
    const t3 = thisArray[2] *  cosAngle + thisArray[6] * sinAngle;
    const t4 = thisArray[3] *  cosAngle + thisArray[7] * sinAngle;
    const t5 = thisArray[0] * -sinAngle + thisArray[4] * cosAngle;
    const t6 = thisArray[1] * -sinAngle + thisArray[5] * cosAngle;
    const t7 = thisArray[2] * -sinAngle + thisArray[6] * cosAngle;
    const t8 = thisArray[3] * -sinAngle + thisArray[7] * cosAngle;
    
    thisArray[0] = t1;
    thisArray[1] = t2;
    thisArray[2] = t3;
    thisArray[3] = t4;
    thisArray[4] = t5;
    thisArray[5] = t6;
    thisArray[6] = t7;
    thisArray[7] = t8;

    return this;
  }

  static rotation(matrix: Matrix3): Matrix4Base {
    return new Matrix4Base().rotation(matrix);
  }

  rotation(matrix: Matrix3): this {
    const thisArray = this.array;
    const matArray = matrix.array;

    thisArray[ 0] = matArray[0];
    thisArray[ 1] = matArray[1];
    thisArray[ 2] = matArray[2];
    thisArray[ 4] = matArray[3];
    thisArray[ 5] = matArray[4];
    thisArray[ 6] = matArray[5];
    thisArray[ 8] = matArray[6];
    thisArray[ 9] = matArray[7];
    thisArray[10] = matArray[8];

    return this;
  }

  rotate(axis: Vector3, angle: number): this {
    const thisArray = this.array;
    const axisArray = axis.array;
    const axisLength = axis.length();
    const x = axisArray[0] / axisLength;
    const y = axisArray[1] / axisLength;
    const z = axisArray[2] / axisLength;
    const c = Math.cos(angle);
    const s = Math.sin(angle);
    const C = 1.0 - c;
    const m11 = x * x * C + c;
    const m12 = x * y * C - z * s;
    const m13 = x * z * C + y * s;
    const m21 = y * x * C + z * s;
    const m22 = y * y * C + c;
    const m23 = y * z * C - x * s;
    const m31 = z * x * C - y * s;
    const m32 = z * y * C + x * s;
    const m33 = z * z * C + c;
    const t1  = thisArray[0] * m11 + thisArray[4] * m21 + thisArray[8] * m31;
    const t2  = thisArray[1] * m11 + thisArray[5] * m21 + thisArray[9] * m31;
    const t3  = thisArray[2] * m11 + thisArray[6] * m21 + thisArray[10] * m31;
    const t4  = thisArray[3] * m11 + thisArray[7] * m21 + thisArray[11] * m31;
    const t5  = thisArray[0] * m12 + thisArray[4] * m22 + thisArray[8] * m32;
    const t6  = thisArray[1] * m12 + thisArray[5] * m22 + thisArray[9] * m32;
    const t7  = thisArray[2] * m12 + thisArray[6] * m22 + thisArray[10] * m32;
    const t8  = thisArray[3] * m12 + thisArray[7] * m22 + thisArray[11] * m32;
    const t9  = thisArray[0] * m13 + thisArray[4] * m23 + thisArray[8] * m33;
    const t10 = thisArray[1] * m13 + thisArray[5] * m23 + thisArray[9] * m33;
    const t11 = thisArray[2] * m13 + thisArray[6] * m23 + thisArray[10] * m33;
    const t12 = thisArray[3] * m13 + thisArray[7] * m23 + thisArray[11] * m33;
    thisArray[ 0] = t1;
    thisArray[ 1] = t2;
    thisArray[ 2] = t3;
    thisArray[ 3] = t4;
    thisArray[ 4] = t5;
    thisArray[ 5] = t6;
    thisArray[ 6] = t7;
    thisArray[ 7] = t8;
    thisArray[ 8] = t9;
    thisArray[ 9] = t10;
    thisArray[10] = t11;
    thisArray[11] = t12;

    return this;
  }

  static scaling(vec: Vector3): Matrix4Base {
    return new Matrix4Base().setScaling(vec);
  }

  setScaling(vec: Vector3): this {
    const thisArray = this.array;
    const vecArray = vec.array;
    const sx = vecArray[0];
    const sy = vecArray[1];
    const sz = vecArray[2];
    const sw = 1;

    thisArray[ 0] = sx;
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = sy;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = 0;
    thisArray[10] = sz;
    thisArray[11] = 0;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = 0;
    thisArray[15] = sw;

    return this;
  }

  scale(vec: Vector3): this {
    const thisArray = this.array;
    const vecArray = vec.array;
    const sx = vecArray[0];
    const sy = vecArray[1];
    const sz = vecArray[2];
    const sw = 1;

    thisArray[ 0] *= sx;
    thisArray[ 1] *= sx;
    thisArray[ 2] *= sx;
    thisArray[ 3] *= sx;
    thisArray[ 4] *= sy;
    thisArray[ 5] *= sy;
    thisArray[ 6] *= sy;
    thisArray[ 7] *= sy;
    thisArray[ 8] *= sz;
    thisArray[ 9] *= sz;
    thisArray[10] *= sz;
    thisArray[11] *= sz;
    thisArray[12] *= sw;
    thisArray[13] *= sw;
    thisArray[14] *= sw;
    thisArray[15] *= sw;

    return this;
  }

  static lookAt(eye: Vector3, target: Vector3, up: Vector3, out: Matrix4): Matrix4 {
    const eyeArray = eye.array;
    const upArray = up.array;
    const targetArray = target.array;
    const outArray = out.array;
    const e0 = eyeArray[0];
    const e1 = eyeArray[1];
    const e2 = eyeArray[2];
    const u0 = upArray[0];
    const u1 = upArray[1];
    const u2 = upArray[2];
    const t0 = targetArray[0];
    const t1 = targetArray[1];
    const t2 = targetArray[2];
    let x0, x1, x2, y0, y1, y2, z0, z1, z2, length;

    z0 = e0 - t0;
    z1 = e1 - t1;
    z2 = e2 - t2;
    length = Math.hypot(z0, z1, z2);
    if (length > 0) {
      length = 1 / Math.hypot(z0, z1, z2);
      z0 *= length;
      z1 *= length;
      z2 *= length;
    }
  
    x0 = u1 * z2 - u2 * z1;
    x1 = u2 * z0 - u0 * z2;
    x2 = u0 * z1 - u1 * z0;
    length = Math.hypot(x0, x1, x2);
    if (length > 0) {
      length = 1 / length;
      x0 *= length;
      x1 *= length;
      x2 *= length;
    }

    y0 = z1 * x2 - z2 * x1;
    y1 = z2 * x0 - z0 * x2;
    y2 = z0 * x1 - z1 * x0;
    length = Math.hypot(y0, y1, y2);
    if (length > 0) {
      length = 1 / length;
      y0 *= length;
      y1 *= length;
      y2 *= length;
    }
  
    outArray[ 0] = x0;
    outArray[ 1] = x1;
    outArray[ 2] = x2;
    outArray[ 3] = 0;
    outArray[ 4] = y0;
    outArray[ 5] = y1;
    outArray[ 6] = y2;
    outArray[ 7] = 0;
    outArray[ 8] = z0;
    outArray[ 9] = z1;
    outArray[10] = z2;
    outArray[11] = 0;
    outArray[12] = e0;
    outArray[13] = e1;
    outArray[14] = e2;
    outArray[15] = 1;
  
    return out;
  }

  lookAt(eye: Vector3, target: Vector3, up: Vector3): this {
    return Matrix4Base.lookAt(eye, target, up, this) as this;
  }

  transformPoint(point: Vector3): Vector3 {
    const thisArray = this.array;
    const pointArray = point.array;

    const x = pointArray[0];
    const y = pointArray[1];
    const z = pointArray[2];

    const d = x * thisArray[3] + y * thisArray[7] + z * thisArray[11] + thisArray[15];

    point.setValues([
      (x * thisArray[0] + y * thisArray[4] + z * thisArray[ 8] + thisArray[12]) / d,
      (x * thisArray[1] + y * thisArray[5] + z * thisArray[ 9] + thisArray[13]) / d,
      (x * thisArray[2] + y * thisArray[6] + z * thisArray[10] + thisArray[14]) / d
    ]);

    return point;
  }

  transformDirection(direction: Vector3): Vector3 {
    const thisArray = this.array;
    const directionArray = direction.array;

    const x = directionArray[0];
    const y = directionArray[1];
    const z = directionArray[2];

    direction.setValues([
      x * thisArray[0] + y * thisArray[4] + z * thisArray[ 8],
      x * thisArray[1] + y * thisArray[5] + z * thisArray[ 9],
      x * thisArray[2] + y * thisArray[6] + z * thisArray[10]
    ]);

    return direction;
  }

  transformNormal(normal: Vector3): Vector3 {
    const normalArray = normal.array;

    const thisInvArray = this.invert().array;

    const x = normalArray[0];
    const y = normalArray[1];
    const z = normalArray[2];

    normal.setValues([
      x * thisInvArray[0] + y * thisInvArray[4] + z * thisInvArray[ 8],
      x * thisInvArray[1] + y * thisInvArray[5] + z * thisInvArray[ 9],
      x * thisInvArray[2] + y * thisInvArray[6] + z * thisInvArray[10]
    ]);

    this.invert();

    return normal;
  }

  static perspective(fov: number, aspect: number, zNear: number, zFar: number): Matrix4Base {
    return new Matrix4Base().setPerspective(fov, aspect, zNear, zFar);
  }

  setPerspective(fov: number, aspect: number, zNear: number, zFar: number): this {
    const thisArray = this.array;
    const width = Math.tan(Math.PI * 0.5 - 0.5 * fov);
    const height = width / aspect;
    const rangeInv = 1 / (zNear - zFar);

    thisArray[ 0] = height;
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = width;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = 0;
    thisArray[10] = (zNear + zFar) * rangeInv;
    thisArray[11] = -1;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = (2 * zNear * zFar) * rangeInv;
    thisArray[15] = 0;
    
    return this;
  }

  static orthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4Base {
    return new Matrix4Base().setOrthographic(left, right, bottom, top, near, far);
  }

  setOrthographic(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    const thisArray = this.array;
    thisArray[ 0] = 2 / (right - left);
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = 2 / (top - bottom);
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = 0;
    thisArray[ 9] = 0;
    thisArray[10] = 2 / (near - far);
    thisArray[11] = 0;
    thisArray[12] = (right + left) / (left - right);
    thisArray[13] = (top + bottom) / (bottom - top);
    thisArray[14] = (far + near) / (near - far);
    thisArray[15] = 1;
    
    return this;
  }

  static frustrum(left: number, right: number, bottom: number, top: number, near: number, far: number): Matrix4Base {
    return new Matrix4Base().setFrustrum(left, right, bottom, top, near, far);
  }

  setFrustrum(left: number, right: number, bottom: number, top: number, near: number, far: number): this {
    const thisArray = this.array;
    const invWidth = 1 / (right - left);
    const invHeight = 1 / (top - bottom);
    const invDepth = 1 / (near - far);

    thisArray[ 0] = near * 2 * invWidth;
    thisArray[ 1] = 0;
    thisArray[ 2] = 0;
    thisArray[ 3] = 0;
    thisArray[ 4] = 0;
    thisArray[ 5] = near * 2 * invHeight;
    thisArray[ 6] = 0;
    thisArray[ 7] = 0;
    thisArray[ 8] = (right + left) * invWidth;
    thisArray [9] = (top + bottom) * invHeight;
    thisArray[10] = (far + near) * invDepth;
    thisArray[11] = -1;
    thisArray[12] = 0;
    thisArray[13] = 0;
    thisArray[14] = far * near * 2 * invDepth;
    thisArray[15] = 0;
    
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