import { Injector } from "../../../patterns/injectors/Injector";
import { MathError } from "../../MathError";

export { Vector2Values };
export { Vector2Injector };
export { Vector2 };
export { Vector2Base };

type Vector2Values = [number, ...number[]] & { length: 2 };

interface Vector2Constructor {
	readonly prototype: Vector2;
	new(): Vector2;
	new(values: Vector2Values): Vector2;
	new(values?: Vector2Values): Vector2;
}

interface Vector2 {
	readonly array: ArrayLike<number>;
	values: Vector2Values;
	x: number;
	y: number;
	setValues(v: Vector2Values): this;
	setArray(array: WritableArrayLike<number>): this;
	copy(vec: Vector2): this;
	clone(): this;
	equals(vec: Vector2): boolean;
	setZeros(): this;
	add(vec: Vector2): this;
	addScalar(k: number): this;
	sub(vec: Vector2): this;
	lerp(vec: Vector2, t: number): this;
	clamp(min: Vector2, max: Vector2): this;
	multScalar(k: number): this;
	cross(vec: Vector2): number;
	dot(vec: Vector2): number;
	len(): number;
	lenSq(): number;
	dist(vec: Vector2): number;
	distSq(vec: Vector2): number;
	normalize(): this;
	negate(): this;
	mult(vec: Vector2): this;
	addScaled(vec: Vector2, k: number): this;
	copyAndSub(vecA: Vector2, vecB: Vector2): this;
	writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}

class Vector2Base {
	protected _array: WritableArrayLike<number>;

	constructor()
	constructor(values: Vector2Values)
	constructor(values?: Vector2Values) {
		this._array = (values) ? [
			values[0], values[1]
		] : [0, 0];
	}

	public get array(): ArrayLike<number> {
		return this._array;
	}

	public get values(): Vector2Values {
		return [
			this._array[0],
			this._array[1]
		];
	}

	public set values(values: Vector2Values) {
		this._array[0] = values[0];
		this._array[1] = values[1];
	}

	public get x() {
		return this._array[0];
	}

	public set x(x: number) {
		this._array[0] = x;
	}

	public get y() {
		return this._array[1];
	}

	public set y(y: number) {
		this._array[1] = y;
	}

	public setArray(array: WritableArrayLike<number>): this {
		if (array.length < 2) {
			throw new MathError(`Array must be of length 2 at least.`);
		}
		this._array = array;
		return this;
	}

	public setValues(v: Vector2Values): this {
		const o = this._array;

		o[0] = v[0];
		o[1] = v[1];

		return this;
	}

	public equals(vec: Vector2Base): boolean {
		const v = vec._array;
		const o = this._array;
		
		return v[0] === o[0]
			&& v[1] === o[1];
	}

	public copy(vec: Vector2Base): this {
		const o = this._array;
		const v = vec._array;

		o[0] = v[0];
		o[1] = v[1];

		return this;
	}

	public clone(): this {
		return new Vector2Base(this.values) as this;
	}

	public setZeros(): this {
		const o = this._array;

		o[0] = 0;
		o[1] = 0;

		return this;
	}

	public add(vec: Vector2Base): this {
		const v = vec._array;
		const o = this._array;

		o[0] = o[0] + v[0];
		o[1] = o[1] + v[1];

		return this;
	}

	public addScalar(k: number): this {
		const o = this._array;

		o[0] = o[0] + k;
		o[1] = o[1] + k;

		return this;
	}

	public sub(vec: Vector2Base): this {
		const v = vec._array;
		const o = this._array;

		o[0] = o[0] - v[0];
		o[1] = o[1] - v[1];

		return this;
	}

	public lerp(vec: Vector2Base, t: number): this {
		const v = vec._array;
		const o = this._array;

		o[0] = t * (v[0] - o[0]);
		o[1] = t * (v[1] - o[1]);

		return this;
	}

	public clamp(min: Vector2Base, max: Vector2Base): this {
		const o = this._array;
		const l = min._array;
		const g = max._array;

		o[0] = Math.min(g[0], Math.min(o[0], l[0])),
		o[1] = Math.min(g[1], Math.min(o[1], l[1]))
		
		return this;
	}

	public multScalar(k: number): this {
		const o = this._array;

		o[0] = o[0] * k;
		o[1] = o[1] * k;

		return this;
	}

	public cross(vec: Vector2Base): number {
		const a = this._array;
		const b = vec._array;

		return a[0] * b[1] - a[1] * b[0];
	}

	public dot(vec: Vector2Base): number {
		const a = this._array;
		const b = vec._array;

		return (a[0] * b[0]) + (a[1] * b[1]);
	}

	public len(): number {
		const v = this._array;

		return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
	}

	public lenSq(): number {
		const v = this._array;

		return v[0] * v[0] + v[1] * v[1];
	}

	public dist(vec: Vector2Base): number {
		const a = this._array;
		const b = vec._array;

		const dx = a[0] - b[0];
		const dy = a[1] - b[1];

		return Math.sqrt(dx * dx + dy * dy);
	}

	public distSq(vec: Vector2Base): number {
		const a = this._array;
		const b = vec._array;

		const dx = a[0] - b[0];
		const dy = a[1] - b[1];

		return dx * dx + dy * dy;
	}

	public normalize(): this {
		const o = this._array;

		const lenSq = o[0] * o[0] + o[1] * o[1];
		const len = Math.sqrt(lenSq);
		if (len > Number.EPSILON) {
			o[0] = o[0] / len;
			o[1] = o[1] / len;
		}
		else {
			o[0] = 0;
			o[1] = 0;
		}

		return this;
	}

	public negate(): this {
		const o = this._array;

		o[0] = -o[0];
		o[1] = -o[1];

		return this;
	}

	public mult(vec: Vector2Base): this {
		const v = vec._array;
		const o = this._array;

		o[0] = o[0] * v[0];
		o[1] = o[1] * v[1];

		return this;
	}

	public addScaled(vec: Vector2Base, k: number): this {
		const v = vec._array;
		const o = this._array;

		o[0] = o[0] + v[0] * k;
		o[1] = o[1] + v[1] * k;

		return this;
	}

	public writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const v = this._array;

		out[offset    ] = v[0];
		out[offset + 1] = v[1];
    }
    
    public readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		const o = this._array;

		o[0] = arr[offset    ];
		o[1] = arr[offset + 1];

		return this;
    }

	public copyAndSub(vecA: Vector2Base, vecB: Vector2Base): this {
		const o = this._array;
		const a = vecA._array;
		const b = vecB._array;
	
		o[0] = a[0] - b[0];
		o[1] = a[1] - b[1];
		
		return this;
	}
}

var Vector2: Vector2Constructor = Vector2Base;
const Vector2Injector: Injector<Vector2Constructor> = new Injector({
	defaultCtor: Vector2Base,
	onDefaultOverride:
		(ctor: Vector2Constructor) => {
			Vector2 = ctor;
		}
});