import { Injector } from "../../../patterns/injectors/Injector";
import { StackPool } from "../../../patterns/pools/StackPool";
import { MathError } from "../../MathError";
import { Vector2Values, Vector2 } from "../vectors/Vector2";

export { Matrix2Values };
export { Matrix2 };
export { Matrix2Base };
export { Matrix2Injector };
export { Matrix2Pool };

type Matrix2Values = [
  number, number,
  number, number
];

interface Matrix2Constructor {
	readonly prototype: Matrix2;
	new(): Matrix2;
	new(values: Matrix2Values): Matrix2;
	new(values?: Matrix2Values): Matrix2;
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

class Matrix2Base {
  protected _array: WritableArrayLike<number>;

	constructor()
	constructor(values: Matrix2Values)
	constructor(values?: Matrix2Values) {
		this._array = (values) ? [
      values[0], values[1],
      values[2], values[3],
		] : [
      0, 0,
      0, 0
    ];
  }

  public get array(): ArrayLike<number> {
    return this._array;
  }
  
  public get values(): Matrix2Values {
		return [
      this._array[0], this._array[1],
      this._array[2], this._array[3]
    ];
	}

	public set values(values: Matrix2Values) {
    this._array[0] = values[0];
    this._array[1] = values[1];
    this._array[2] = values[2];
    this._array[3] = values[3];
  }

  public get row1(): Vector2Values {
		return [
      this._array[0],
      this._array[1]
    ];
	}

	public set row1(row1: Vector2Values) {
    this._array[0] = row1[0];
    this._array[1] = row1[1];
  }

  public get row2(): Vector2Values {
		return [
      this._array[2],
      this._array[3]
    ];
	}

	public set row2(row2: Vector2Values) {
    this._array[2] = row2[0];
    this._array[3] = row2[1];
  }

  public get col1(): Vector2Values {
		return [
      this._array[0],
      this._array[2]
    ];
	}

	public set col1(col1: Vector2Values) {
    this._array[0] = col1[0];
    this._array[2] = col1[1];
  }

  public get col2(): Vector2Values {
		return [
      this._array[1],
      this._array[3]
    ];
	}

	public set col2(col2: Vector2Values) {
    this._array[1] = col2[0];
    this._array[3] = col2[1];
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

	public setArray(array: WritableArrayLike<number>): this {
		if (array.length < 16) {
			throw new MathError(`Array must be of length 16 at least.`);
		}
		this._array = array;
		return this;
	}

  public setValues(m: Matrix2Values): this {
		const o = this._array;

    o[0] = m[0];
    o[1] = m[1];
    o[2] = m[2];
    o[3] = m[3];

		return this;
	}

  public getRow(idx: number): Vector2Values {
    const m = this._array;
    const offset = idx * 2;

    return [
      m[offset    ],
      m[offset + 1]
    ];
  }

  public setRow(idx: number, row: Vector2Values): this {
    const o = this._array;
    const offset = idx * 2;

    o[offset    ] = row[0];
    o[offset + 1] = row[1];

    return this;
  }

  public setCol(idx: number, col: Vector2Values): this {
    const o = this._array;

    o[     idx] = col[0];
    o[2  + idx] = col[1];

    return this;
  }

  public getCol(idx: number): Vector2Values {
    const m = this._array;

    return [
      m[     idx],
      m[2  + idx]
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
    return this._array[2 * row + col];
  }

  public setEntry(row: number, col: number, val: number): this {
    this._array[2 * row + col] = val;

    return this;
  }
  
	public equals(mat: Matrix2) {
    const o = this._array;
    const m = mat.array;

    return o[0] === m[0]
      && o[1] === m[1]
      && o[2] === m[2]
      && o[3] === m[3];
  }

  public getValues(): Matrix2Values {
		const m = this._array;

    return [
      m[ 0], m[ 1],
      m[ 2], m[ 3]
    ];
	}

  public copy(mat: Matrix2): this {
    const o = this._array;
    const m = mat.array;

    o[0] = m[0];
    o[1] = m[1];
    o[2] = m[2];
    o[3] = m[3];

    return this;
  }

  public clone(): this {
    return new Matrix2Base(this.values) as this;
  }

  public det(): number {
    const o = this._array;

    return o[0] * o[3] - o[1] * o[2];
  }

  public trace(): number {
    const o = this._array;
    
    return o[0] + o[3];
  }

  public setIdentity(): this {
    const o = this._array;
  
    o[0] = 1;
    o[1] = 0;
    o[2] = 0;
    o[3] = 1;

    return this;
  }

  public setZeros(): this {
    const o = this._array;
  
    o[0] = 0;
    o[1] = 0;
    o[2] = 0;
    o[3] = 0;

    return this;
  }

  public negate(): this {
    const o = this._array;

    o[0] = -o[0];
    o[1] = -o[1];
    o[2] = -o[2];
    o[3] = -o[3];

    return this;
  }

  public transpose(): this {
    const o = this._array;

    let t;

    t = o[1];
    o[1] = o[3];
    o[3] = t;

    return this;
  }

  public invert(): this {
    const o = this._array;

    const d = 1.0 / (o[0] * o[3] - o[1] * o[2]);

    if (d == 0) {
      throw new MathError(`Matrix is not invertible.`);
    }

    o[0] =  d * o[2];
    o[1] = -d * o[1];
    o[2] = -d * o[3];
    o[3] =  d * o[0];

    return this;
  }

  public add(mat: Matrix2): this {
    const o = this._array;
    const m = mat.array;

    o[0] = o[0] + m[0];
    o[1] = o[1] + m[1];
    o[2] = o[2] + m[2];
    o[3] = o[3] + m[3];

    return this;
  }

  public sub(mat: Matrix2): this {
    const o = this._array;
    const m = mat.array;

    o[0] = o[0] - m[0];
    o[1] = o[1] - m[1];
    o[2] = o[2] - m[2];
    o[3] = o[3] - m[3];

    return this;
  }

  public mult(mat: Matrix2): this {
    const o = this._array;
    const m = mat.array;

    const a00 = o[0 * 3 + 0];
    const a01 = o[0 * 3 + 1];
    const a10 = o[1 * 3 + 0];
    const a11 = o[1 * 3 + 1];
    const b00 = m[0 * 3 + 0];
    const b01 = m[0 * 3 + 1];
    const b10 = m[1 * 3 + 0];
    const b11 = m[1 * 3 + 1];

    o[0] = b00 * a00 + b01 * a10;
    o[1] = b00 * a01 + b01 * a11;
    o[3] = b10 * a00 + b11 * a10;
    o[4] = b10 * a01 + b11 * a11;

    return this;
  }

  public multScalar(k: number): this {
    const o = this._array;

    o[0] = o[0] * k;
    o[1] = o[1] * k;
    o[2] = o[2] * k;
    o[3] = o[3] * k;

    return this;
  }

  public writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const m = this._array;

		out[offset     ] = m[ 0];
		out[offset +  1] = m[ 1];
    out[offset +  2] = m[ 2];
    out[offset +  3] = m[ 3];
  }
    
  public readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		const o = this._array;

		o[ 0] = arr[offset     ];
		o[ 1] = arr[offset +  1];
    o[ 2] = arr[offset +  2];
    o[ 3] = arr[offset +  3];

    return this;
  }

  public solve(vecB: Vector2): Vector2Values {
    const a = this._array;

    const a11 = a[0];
    const a12 = a[1];
    const a21 = a[2];
    const a22 = a[3];
    const bx = vecB.x;
    const by = vecB.y;
    
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

var Matrix2: Matrix2Constructor = Matrix2Base;
const Matrix2Pool: StackPool<Matrix2> = new StackPool(Matrix2Base);
const Matrix2Injector: Injector<Matrix2Constructor> = new Injector({
	defaultCtor: Matrix2Base,
	onDefaultOverride:
		(ctor: Matrix2Constructor) => {
			Matrix2 = ctor;
		}
});