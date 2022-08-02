import { Injector } from "../../../patterns/injectors/Injector";
import { MathError } from "../../MathError";
import { Vector2, Vector2Values } from "../vectors/Vector2";
import { Vector3Values, Vector3 } from "../vectors/Vector3";

export { Matrix3Values };
export { Matrix3 };
export { Matrix3Injector };
export { Matrix3Base };

type Matrix3Values = [
  number, number, number,
  number, number, number,
  number, number, number
];

interface Matrix3Constructor {
	readonly prototype: Matrix3;
	new(): Matrix3;
	new(
    m11: number, m21: number, m31: number,
    m12: number, m22: number, m32: number,
    m13: number, m23: number, m33: number
  ): Matrix3;
  new(array: ArrayLike<number>): Matrix3;
  rotationX(angle: number): Matrix3;
  rotationY(angle: number): Matrix3;
  rotationZ(angle: number): Matrix3;
}

interface Matrix3 {
  readonly array: WritableArrayLike<number>;
  setValues(
    m11: number, m21: number, m31: number,
    m12: number, m22: number, m32: number,
    m13: number, m23: number, m33: number
  ): this;
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

class Matrix3Base implements Matrix3 {
  readonly array: Float32Array;

	constructor()
  constructor(array: ArrayLike<number>)
	constructor(
    m11: number, m21: number, m31: number,
    m12: number, m22: number, m32: number,
    m13: number, m23: number, m33: number
  )
	constructor(
    ...args: any[]
  ) {
		if (typeof args[0] === "number") {
			this.array = new Float32Array([
        args[0], args[1], args[2],
        args[3], args[4], args[5],
        args[6], args[7], args[8]
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
			this.array = new Float32Array([
        0, 0, 0,
        0, 0, 0,
        0, 0, 0
      ]);
		}
  }

  get row1(): Vector3Values {
		return [
      this.array[0],
      this.array[3],
      this.array[6]
    ];
	}

	set row1(row: Vector3Values) {
    this.array[0] = row[0];
    this.array[3] = row[1];
    this.array[6] = row[2];
  }

  get row2(): Vector3Values {
		return [
      this.array[1],
      this.array[4],
      this.array[7]
    ];
	}

	set row2(row: Vector3Values) {
    this.array[1] = row[0];
    this.array[4] = row[1];
    this.array[7] = row[2]
  }

  get row3(): Vector3Values {
		return [
      this.array[2],
      this.array[5],
      this.array[8]
    ];
	}

	set row3(row: Vector3Values) {
    this.array[2] = row[0];
    this.array[5] = row[1];
    this.array[8] = row[2]
  }

  get col1(): Vector3Values {
		return [
      this.array[0],
      this.array[1],
      this.array[2]
    ];
	}

	set col1(col: Vector3Values) {
    this.array[0] = col[0];
    this.array[1] = col[1];
    this.array[2] = col[2];
  }

  get col2(): Vector3Values {
		return [
      this.array[3],
      this.array[4],
      this.array[5]
    ];
	}

	set col2(col: Vector3Values) {
    this.array[3] = col[0];
    this.array[4] = col[1];
    this.array[5] = col[2]
  }

  get col3(): Vector3Values {
		return [
      this.array[6],
      this.array[7],
      this.array[8]
    ];
	}

	set col3(col: Vector3Values) {
    this.array[6] = col[0];
    this.array[7] = col[1];
    this.array[8] = col[2];
  }

  get m11() {
		return this.array[0];
	}

	set m11(val: number) {
		this.array[0] = val;
  }
  
  get m12() {
		return this.array[3];
	}

	set m12(val: number) {
		this.array[3] = val;
  }
  
  get m13() {
		return this.array[6];
	}

	set m13(val: number) {
		this.array[6] = val;
  }
  
  get m21() {
		return this.array[1];
	}

	set m21(val: number) {
		this.array[1] = val;
  }
  
  get m22() {
		return this.array[4];
	}

	set m22(val: number) {
		this.array[4] = val;
  }
  
  get m23() {
		return this.array[7];
	}

	set m23(val: number) {
		this.array[7] = val;
  }
  
  get m31() {
		return this.array[2];
	}

  set m31(val: number) {
		this.array[2] = val;
  }
  
  get m32() {
		return this.array[5];
	}

	set m32(val: number) {
		this.array[5] = val;
  }
  
  get m33() {
		return this.array[8];
	}

  set m33(val: number) {
		this.array[8] = val;
  }

  private checkArray(array: ArrayLike<number>): void {
		if (array.length < 9) {
			throw new MathError(`Array must be of length 9 at least.`);
		}
	}

  getValues(): Matrix3Values {
		return [
      this.array[0], this.array[1], this.array[2],
      this.array[3], this.array[4], this.array[5],
      this.array[6], this.array[7], this.array[8],
    ];
	}

	setValues(
    m11: number, m21: number, m31: number,
    m12: number, m22: number, m32: number,
    m13: number, m23: number, m33: number
  ): this {
    this.array[0] = m11;
    this.array[1] = m21;
    this.array[2] = m31;
    this.array[3] = m12;
    this.array[4] = m22;
    this.array[5] = m32;
    this.array[6] = m13;
    this.array[7] = m23;
    this.array[8] = m33;

    return this;
  }

	equals(other: Matrix3): boolean {
    const o = other.array;
    return this.array[0] === o[0]
      && this.array[1] === o[1]
      && this.array[2] === o[2]
      && this.array[3] === o[3]
      && this.array[4] === o[4]
      && this.array[5] === o[5]
      && this.array[6] === o[6]
      && this.array[7] === o[7]
      && this.array[8] === o[8];
  }

  copy(mat: Matrix3): this {
    const o = this.array;
    const m = mat.array;

    o[0] = m[0];
    o[1] = m[1];
    o[2] = m[2];
    o[3] = m[3];
    o[4] = m[4];
    o[5] = m[5];
    o[6] = m[6];
    o[7] = m[7];
    o[8] = m[8];

    return this;
  }

  clone(): this {
    return new Matrix3Base(
      this.array[0], this.array[1], this.array[2],
      this.array[3], this.array[4], this.array[5],
      this.array[6], this.array[7], this.array[8]
    ) as this;
  }

  setIdentity(): this {
    const o = this.array;

    o[0] = 1;
    o[1] = 0;
    o[2] = 0;
    o[3] = 0;
    o[4] = 1;
    o[5] = 0;
    o[6] = 0;
    o[7] = 0;
    o[8] = 1;

    return this;
  }

  setZeros(): this {
    const o = this.array;

    o[0] = 0;
    o[1] = 0;
    o[2] = 0;
    o[3] = 0;
    o[4] = 0;
    o[5] = 0;
    o[6] = 0;
    o[7] = 0;
    o[8] = 0;

    return this;
  }

  det(): number {
    const o = this.array;

    const x = o[0] * ((o[4] * o[8]) - (o[5] * o[7]));
    const y = o[1] * ((o[3] * o[8]) - (o[5] * o[6]));
    const z = o[2] * ((o[3] * o[7]) - (o[4] * o[6]));

    return x - y + z;
  }

  trace(): number {
    const o = this.array;
    
    return o[0] + o[4] + o[8];
  }

  negate(): this {
    const o = this.array;

    o[0] = -o[0];
    o[1] = -o[1];
    o[2] = -o[2];
    o[3] = -o[3];
    o[4] = -o[4];
    o[5] = -o[5];
    o[6] = -o[6];
    o[7] = -o[7];
    o[8] = -o[8];

    return this;
  }

  transpose(): this {
    const o = this.array;

    let t;

    t = o[1];
    o[1] = o[3];
    o[3] = t;

    t = o[2];
    o[2] = o[6];
    o[6] = t;

    t = o[5];
    o[5] = o[7];
    o[7] = t;
    
    return this;
  }

  invert(): this {
    const o = this.array;

    const t11 = o[1 * 3 + 1] * o[2 * 3 + 2] - o[1 * 3 + 2] * o[2 * 3 + 1];
    const t12 = o[0 * 3 + 1] * o[2 * 3 + 2] - o[0 * 3 + 2] * o[2 * 3 + 1];
    const t13 = o[0 * 3 + 1] * o[1 * 3 + 2] - o[0 * 3 + 2] * o[1 * 3 + 1];

    const t21 = o[1 * 3 + 0] * o[2 * 3 + 2] - o[1 * 3 + 2] * o[2 * 3 + 0];
    const t22 = o[0 * 3 + 0] * o[2 * 3 + 2] - o[0 * 3 + 2] * o[2 * 3 + 0];
    const t23 = o[0 * 3 + 0] * o[1 * 3 + 2] - o[0 * 3 + 2] * o[1 * 3 + 0];

    const t31 = o[1 * 3 + 0] * o[2 * 3 + 1] - o[1 * 3 + 1] * o[2 * 3 + 0];
    const t32 = o[0 * 3 + 0] * o[2 * 3 + 1] - o[0 * 3 + 1] * o[2 * 3 + 0];
    const t33 = o[0 * 3 + 0] * o[1 * 3 + 1] - o[0 * 3 + 1] * o[1 * 3 + 0];

    const d = 1.0 / (o[0 * 3 + 0] * t11 - o[1 * 3 + 0] * t12 + o[2 * 3 + 0] * t13);

    if (d == 0) {
      throw new MathError(`Matrix is not invertible.`);
    }

    o[0] = d * t11;
    o[1] = -d * t12;
    o[2] = d * t13;

    o[3] = -d * t21;
    o[4] = d * t22;
    o[5] = -d * t23;

    o[6] = d * t31;
    o[7] = -d * t32;
    o[8] = d * t33;

    return this;
  }

  add(mat: Matrix3): this {
    const o = this.array;
    const m = mat.array;

    o[0] = o[0] + m[0];
    o[1] = o[1] + m[1];
    o[2] = o[2] + m[2];
    o[3] = o[3] + m[3];
    o[4] = o[4] + m[4];
    o[5] = o[5] + m[5];
    o[6] = o[6] + m[6];
    o[7] = o[7] + m[7];
    o[8] = o[8] + m[8];

    return this;
  }

  sub(mat: Matrix3Base): this {
    const o = this.array;
    const m = mat.array;

    o[0] = o[0] - m[0];
    o[1] = o[1] - m[1];
    o[2] = o[2] - m[2];
    o[3] = o[3] - m[3];
    o[4] = o[4] - m[4];
    o[5] = o[5] - m[5];
    o[6] = o[6] - m[6];
    o[7] = o[7] - m[7];
    o[8] = o[8] - m[8];

    return this;
  }

  mult(mat: Matrix3): this {
    const o = this.array;
    const m = mat.array;

    const a11 = o[0 * 3 + 0];
    const a12 = o[0 * 3 + 1];
    const a13 = o[0 * 3 + 2];
    const a21 = o[1 * 3 + 0];
    const a22 = o[1 * 3 + 1];
    const a23 = o[1 * 3 + 2];
    const a31 = o[2 * 3 + 0];
    const a32 = o[2 * 3 + 1];
    const a33 = o[2 * 3 + 2];
    const b11 = m[0 * 3 + 0];
    const b12 = m[0 * 3 + 1];
    const b13 = m[0 * 3 + 2];
    const b21 = m[1 * 3 + 0];
    const b22 = m[1 * 3 + 1];
    const b23 = m[1 * 3 + 2];
    const b31 = m[2 * 3 + 0];
    const b32 = m[2 * 3 + 1];
    const b33 = m[2 * 3 + 2];

    o[0] = b11 * a11 + b12 * a21 + b13 * a31;
    o[1] = b11 * a12 + b12 * a22 + b13 * a32;
    o[2] = b11 * a13 + b12 * a23 + b13 * a33;
    o[3] = b21 * a11 + b22 * a21 + b23 * a31;
    o[4] = b21 * a12 + b22 * a22 + b23 * a32;
    o[5] = b21 * a13 + b22 * a23 + b23 * a33;
    o[6] = b31 * a11 + b32 * a21 + b33 * a31;
    o[7] = b31 * a12 + b32 * a22 + b33 * a32;
    o[8] = b31 * a13 + b32 * a23 + b33 * a33;

    return this;
  }

  multScalar(k: number): this {
    const o = this.array;

    o[0] = o[0] * k;
    o[1] = o[1] * k;
    o[2] = o[2] * k;
    o[3] = o[3] * k;
    o[4] = o[4] * k;
    o[5] = o[5] * k;
    o[6] = o[6] * k;
    o[7] = o[7] * k;
    o[8] = o[8] * k;

    return this;
  }

  writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const m = this.array;

		out[offset     ] = m[ 0];
		out[offset +  1] = m[ 1];
    out[offset +  2] = m[ 2];
    out[offset +  3] = m[ 3];
		out[offset +  4] = m[ 4];
    out[offset +  5] = m[ 5];
    out[offset +  6] = m[ 6];
		out[offset +  7] = m[ 7];
    out[offset +  8] = m[ 8];
  }
    
  readFromArray(arr: ArrayLike<number>, offset: number = 0): void {
		const o = this.array;

		o[ 0] = arr[offset     ];
		o[ 1] = arr[offset +  1];
    o[ 2] = arr[offset +  2];
    o[ 3] = arr[offset +  3];
    o[ 4] = arr[offset +  4];
    o[ 5] = arr[offset +  5];
    o[ 6] = arr[offset +  6];
		o[ 7] = arr[offset +  7];
    o[ 8] = arr[offset +  8];
  }

  static rotationX(angle: number): Matrix3Base {
    return new Matrix3Base().setRotationX(angle);
  }

  setRotationX(angle: number): this {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    this.array[0] = 1;
    this.array[1] = 0;
    this.array[2] = 0;
    this.array[3] = 0;
    this.array[4] = cosAngle;
    this.array[5] = sinAngle;
    this.array[6] = 0;
    this.array[7] = -sinAngle;
    this.array[8] = cosAngle;

    return this;
  }
  
  static rotationY(angle: number): Matrix3Base {
    return new Matrix3Base().setRotationY(angle);
  }

  setRotationY(angle: number): this {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);
    
    this.array[0] = cosAngle;
    this.array[1] = 0;
    this.array[2] = -sinAngle;
    this.array[3] = 0;
    this.array[4] = 1;
    this.array[5] = 0;
    this.array[6] = sinAngle;
    this.array[7] = 0;
    this.array[8] = cosAngle;
    
    return this;
  }

  static rotationZ(angle: number): Matrix3Base {
    return new Matrix3Base().setRotationZ(angle);
  }

  setRotationZ(angle: number): this {
    const cosAngle = Math.cos(angle);
    const sinAngle = Math.sin(angle);

    this.array[0] = cosAngle;
    this.array[1] = sinAngle;
    this.array[2] = 0;
    this.array[3] = -sinAngle;
    this.array[4] = cosAngle;
    this.array[5] = 0;
    this.array[6] = 0;
    this.array[7] = 0;
    this.array[8] = 1;

    return this;
  }

  solve(vecB: Vector3): Vector3Values {
    const a = this.array;
    
    const a11 = a[0];
    const a12 = a[1];
    const a13 = a[2];
    const a21 = a[3];
    const a22 = a[4];
    const a23 = a[5];
    const a31 = a[6];
    const a32 = a[7];
    const a33 = a[8];
    const bx = vecB.x;
    const by = vecB.y;
    const bz = vecB.z;

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

  solve2(vecB: Vector2): Vector2Values {
    const a = this.array;

    const a11 = a[0];
    const a12 = a[1];
    const a21 = a[3];
    const a22 = a[4];
    const bx = vecB.x - a[4];
    const by = vecB.y - a[7];
    
    let det = a11 * a22 - a12 * a21;

    if (det != 0.0) {
      det = 1.0 / det;
    }

    const x = det * (a22 * bx - a12 * by)
    const y = det * (a11 * by - a21 * bx);

    return [
      x, y
    ];
  }
}

var Matrix3: Matrix3Constructor = Matrix3Base;
const Matrix3Injector: Injector<Matrix3Constructor> = new Injector({
	defaultCtor: Matrix3Base,
	onDefaultOverride:
		(ctor: Matrix3Constructor) => {
			Matrix3 = ctor;
		}
});