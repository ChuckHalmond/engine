import { Injector } from "engine/libs/patterns/injectors/Injector";
import { MathError } from "engine/libs/maths/MathError";
import { Vector2, Vector2Values } from "engine/libs/maths/algebra/vectors/Vector2";
import { Vector3, Vector3Values } from "engine/libs/maths/algebra/vectors/Vector3";

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
	new(values: Matrix3Values): Matrix3;
	new(values?: Matrix3Values): Matrix3;
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

class Matrix3Base {
  protected _array: WritableArrayLike<number>;

	constructor()
	constructor(values: Matrix3Values)
	constructor(values?: Matrix3Values) {
		this._array = (values) ? [
      values[0], values[1], values[2],
      values[3], values[4], values[5],
      values[6], values[7], values[8]
		] : [
      0, 0, 0,
      0, 0, 0,
      0, 0, 0
    ];
  }

  public get array(): ArrayLike<number> {
    return this._array;
  }
  
  public get values(): Matrix3Values {
		return [
      this._array[0], this._array[1], this._array[2],
      this._array[3], this._array[4], this._array[5],
      this._array[6], this._array[7], this._array[8]
    ];
	}

	public set values(values: Matrix3Values) {
    this._array[0] = values[0];
    this._array[1] = values[1];
    this._array[2] = values[2];
    this._array[3] = values[3];
    this._array[4] = values[4];
    this._array[5] = values[5];
    this._array[6] = values[6];
    this._array[7] = values[7];
    this._array[8] = values[8];
  }

  public get row1(): Vector3Values {
		return [
      this._array[0],
      this._array[1],
      this._array[2]
    ];
	}

	public set row1(row1: Vector3Values) {
    this._array[0] = row1[0];
    this._array[1] = row1[1];
    this._array[2] = row1[2];
  }

  public get row2(): Vector3Values {
		return [
      this._array[3],
      this._array[4],
      this._array[5]
    ];
	}

	public set row2(row2: Vector3Values) {
    this._array[3] = row2[0];
    this._array[4] = row2[1];
    this._array[5] = row2[2]
  }

  public get row3(): Vector3Values {
		return [
      this._array[6],
      this._array[7],
      this._array[8]
    ];
	}

	public set row3(row3: Vector3Values) {
    this._array[6] = row3[0];
    this._array[7] = row3[1];
    this._array[8] = row3[2]
  }

  public get col1(): Vector3Values {
		return [
      this._array[0],
      this._array[3],
      this._array[6]
    ];
	}

	public set col1(col1: Vector3Values) {
    this._array[0] = col1[0];
    this._array[3] = col1[1];
    this._array[6] = col1[2];
  }

  public get col2(): Vector3Values {
		return [
      this._array[1],
      this._array[4],
      this._array[7]
    ];
	}

	public set col2(col2: Vector3Values) {
    this._array[1] = col2[0];
    this._array[4] = col2[1];
    this._array[7] = col2[2]
  }

  public get col3(): Vector3Values {
		return [
      this._array[2],
      this._array[5],
      this._array[8]
    ];
	}

	public set col3(col3: Vector3Values) {
    this._array[2] = col3[0];
    this._array[5] = col3[1];
    this._array[8] = col3[2];
  }

  public get m11() {
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

	public setArray(array: WritableArrayLike<number>): this {
		if (array.length < 16) {
			throw new MathError(`Array must be of length 16 at least.`);
		}
		this._array = array;
		return this;
	}

  public setValues(m: Matrix3Values): this {
		const o = this._array;

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

  public getRow(idx: number): Vector3Values {
    const m = this._array;
    const offset = idx * 3;

    return [
      m[offset    ],
      m[offset + 1],
      m[offset + 2]
    ];
  }

  public setRow(idx: number, row: Vector3Values): this {
    const o = this._array;
    const offset = idx * 3;

    o[offset    ] = row[0];
    o[offset + 1] = row[1];
    o[offset + 2] = row[2];

    return this;
  }

  public setCol(idx: number, col: Vector3Values): this {
    const o = this._array;

    o[     idx] = col[0];
    o[3  + idx] = col[1];
    o[6  + idx] = col[2];

    return this;
  }

  public getCol(idx: number): Vector3Values {
    const m = this._array;

    return [
      m[     idx],
      m[3  + idx],
      m[6  + idx]
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
    return this._array[3 * row + col];
  }

  public setEntry(row: number, col: number, val: number): this {
    this._array[3 * row + col] = val;

    return this;
  }

	public equals(mat: Matrix3): boolean {
    const o = this._array;
    const m = mat.array;

    return o[0] === m[0]
      && o[1] === m[1]
      && o[2] === m[2]
      && o[3] === m[3]
      && o[4] === m[4]
      && o[5] === m[5]
      && o[6] === m[6]
      && o[7] === m[7]
      && o[8] === m[8];
  }

  public copy(mat: Matrix3): this {
    const o = this._array;
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

  public clone(): this {
    return new Matrix3Base(this.values) as this;
  }

  public setIdentity(): this {
    const o = this._array;

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

  public setZeros(): this {
    const o = this._array;

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

  public det(): number {
    const o = this._array;

    const x = o[0] * ((o[4] * o[8]) - (o[5] * o[7]));
    const y = o[1] * ((o[3] * o[8]) - (o[5] * o[6]));
    const z = o[2] * ((o[3] * o[7]) - (o[4] * o[6]));

    return x - y + z;
  }

  public trace(): number {
    const o = this._array;
    
    return o[0] + o[4] + o[8];
  }

  public negate(): this {
    const o = this._array;

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

  public transpose(): this {
    const o = this._array;

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

  public invert(): this {
    const o = this._array;

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

  public add(mat: Matrix3): this {
    const o = this._array;
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

  public sub(mat: Matrix3Base): this {
    const o = this._array;
    const m = mat._array;

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

  public mult(mat: Matrix3): this {
    const o = this._array;
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

  public multScalar(k: number): this {
    const o = this._array;

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
  }
    
  public readFromArray(arr: ArrayLike<number>, offset: number = 0): void {
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
  }

  public solve(vecB: Vector3): Vector3Values {
    const a = this._array;
    
    const a11 = a[0];
    const a12 = a[1];
    const a13 = a[2];
    const a21 = a[3];
    const a22 = a[4];
    const a23 = a[5];
    const a31 = a[6];
    const a32 = a[7];
    const a33 = a[8];
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

  public solve2(vecB: Vector2): Vector2Values {
    const a = this._array;

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