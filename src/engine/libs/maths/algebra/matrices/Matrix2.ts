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
	new(
    m11: number, m12: number,
    m21: number, m22: number
  ): Matrix2;
  new(array: ArrayLike<number>): Matrix2;
}

interface Matrix2 {
  readonly array: Float32Array;
  row1: Vector2Values;
  row2: Vector2Values;
  col1: Vector2Values;
  col2: Vector2Values;
  m11: number;
  m12: number;
  m21: number;
  m22: number;
  getValues(): Matrix2Values;
  setValues(
    m11: number, m12: number,
    m21: number, m22: number
  ): this;
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

class Matrix2Base implements Matrix2 {
  public readonly array: Float32Array;

	constructor()
  constructor(array: ArrayLike<number>)
	constructor(
    m11: number, m12: number,
    m21: number, m22: number,
  )
	constructor(
    ...args: any[]
  ) {
		if (typeof args[0] === "number") {
			this.array = new Float32Array([
        args[0], args[2],
        args[1], args[3],
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
  
  public getValues(): Matrix2Values {
		return [
      this.array[0], this.array[1],
      this.array[2], this.array[3]
    ];
	}

  public setValues(
    m11: number, m12: number,
    m21: number, m22: number
  ): this {

    this.array[0] = m11;
    this.array[1] = m21;
    this.array[2] = m12;
    this.array[3] = m22;

    return this;
  }

  public get row1(): Vector2Values {
		return [
      this.array[0],
      this.array[2]
    ];
	}

	public set row1(row: Vector2Values) {
    this.array[0] = row[0];
    this.array[2] = row[1];
  }

  public get row2(): Vector2Values {
		return [
      this.array[1],
      this.array[3]
    ];
	}

	public set row2(row: Vector2Values) {
    this.array[1] = row[0];
    this.array[3] = row[1];
  }

  public get col1(): Vector2Values {
		return [
      this.array[0],
      this.array[2]
    ];
	}

	public set col1(col: Vector2Values) {
    this.array[0] = col[0];
    this.array[1] = col[1];
  }

  public get col2(): Vector2Values {
		return [
      this.array[2],
      this.array[3]
    ];
	}

	public set col2(col: Vector2Values) {
    this.array[2] = col[0];
    this.array[3] = col[1];
  }

  public get m11() {
		return this.array[0];
	}

	public set m11(val: number) {
		this.array[0] = val;
  }
  
  public get m12() {
		return this.array[2];
	}

	public set m12(val: number) {
		this.array[2] = val;
  }
  
  public get m21() {
		return this.array[1];
	}

	public set m21(val: number) {
		this.array[1] = val;
  }
  
  public get m22() {
		return this.array[3];
	}

	public set m22(val: number) {
		this.array[3] = val;
  }

  private checkArray(array: ArrayLike<number>): void {
		if (array.length < 4) {
			throw new MathError(`Array must be of length 4 at least.`);
		}
	}

	public equals(mat: Matrix2) {
    const o = this.array;
    const m = mat.array;

    return o[0] === m[0]
      && o[1] === m[1]
      && o[2] === m[2]
      && o[3] === m[3];
  }

  public copy(mat: Matrix2): this {
    const o = this.array;
    const m = mat.array;

    o[0] = m[0];
    o[1] = m[1];
    o[2] = m[2];
    o[3] = m[3];

    return this;
  }

  public clone(): this {
    return new Matrix2Base(this.getValues()) as this;
  }

  public det(): number {
    const o = this.array;

    return o[0] * o[3] - o[1] * o[2];
  }

  public trace(): number {
    const o = this.array;
    
    return o[0] + o[3];
  }

  public setIdentity(): this {
    const o = this.array;
  
    o[0] = 1;
    o[1] = 0;
    o[2] = 0;
    o[3] = 1;

    return this;
  }

  public setZeros(): this {
    const o = this.array;
  
    o[0] = 0;
    o[1] = 0;
    o[2] = 0;
    o[3] = 0;

    return this;
  }

  public negate(): this {
    const o = this.array;

    o[0] = -o[0];
    o[1] = -o[1];
    o[2] = -o[2];
    o[3] = -o[3];

    return this;
  }

  public transpose(): this {
    const o = this.array;

    let t;

    t = o[1];
    o[1] = o[3];
    o[3] = t;

    return this;
  }

  public invert(): this {
    const o = this.array;

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
    const o = this.array;
    const m = mat.array;

    o[0] = o[0] + m[0];
    o[1] = o[1] + m[1];
    o[2] = o[2] + m[2];
    o[3] = o[3] + m[3];

    return this;
  }

  public sub(mat: Matrix2): this {
    const o = this.array;
    const m = mat.array;

    o[0] = o[0] - m[0];
    o[1] = o[1] - m[1];
    o[2] = o[2] - m[2];
    o[3] = o[3] - m[3];

    return this;
  }

  public mult(mat: Matrix2): this {
    const o = this.array;
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
    const o = this.array;

    o[0] = o[0] * k;
    o[1] = o[1] * k;
    o[2] = o[2] * k;
    o[3] = o[3] * k;

    return this;
  }

  public writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const m = this.array;

		out[offset     ] = m[ 0];
		out[offset +  1] = m[ 1];
    out[offset +  2] = m[ 2];
    out[offset +  3] = m[ 3];
  }
    
  public readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		const o = this.array;

		o[ 0] = arr[offset     ];
		o[ 1] = arr[offset +  1];
    o[ 2] = arr[offset +  2];
    o[ 3] = arr[offset +  3];

    return this;
  }

  public solve(vecB: Vector2): Vector2Values {
    const a = this.array;

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