import { MathError } from "engine/libs/maths/MathError";
import { Injector } from "engine/libs/patterns/injectors/Injector";

export { Vector3Values };
export { Vector3Constructor };
export { Vector3 };
export { Vector3Base };
export { Vector3Injector };

type Vector3Values = [number, ...number[]] & { length: 3 };

interface Vector3Constructor {
	readonly prototype: Vector3;
	new(): Vector3;
	new(values: Vector3Values): Vector3;
	new(values?: Vector3Values): Vector3;
}

interface Vector3 {
	readonly array: ArrayLike<number>;
	values: Vector3Values;
	x: number;
	y: number;
	z: number;
	setArray(array: WritableArrayLike<number>): this;
	setValues(v: Vector3Values): this;
	equals(vec: Vector3): boolean;
	copy(vec: Vector3): this;
	clone(): this;
	setZeros(): this;
	add(vec: Vector3): this;
	addScalar(k: number): this;
	sub(vec: Vector3): this;
	lerp(vec: Vector3, t: number): this;
	max(vecB: Vector3): this;
	min(vecB: Vector3): this;
	clamp(min: Vector3, max: Vector3): this;
	multScalar(k: number): this;
	cross(vec: Vector3): this;
	dot(vec: Vector3): number;
	len(): number;
	lenSq(): number;
	dist(vec: Vector3): number;
	distSq(vec: Vector3): number;
	normalize(): this;
	negate(): this;
	mult(vec: Vector3): this;
	addScaled(vec: Vector3, k: number): this;
	copyAndSub(vecA: Vector3, vecB: Vector3): this;
	copyAndCross(vecA: Vector3, vecB: Vector3): this;
	writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}

class Vector3Base {
	protected _array: WritableArrayLike<number>;

	constructor()
	constructor(values: Vector3Values)
	constructor(values?: Vector3Values) {
		this._array = (values) ? [
			values[0], values[1], values[2]
		] : [0, 0, 0];
	}

	public get array(): ArrayLike<number> {
		return this._array;
	}

	public get values(): Vector3Values {
		return [
			this._array[0],
			this._array[1],
			this._array[2]
		];
	}

	public set values(values: Vector3Values) {
		this._array[0] = values[0];
		this._array[1] = values[1];
		this._array[2] = values[2];
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

	public get z() {
		return this._array[2];
	}

	public set z(z: number) {
		this._array[2] = z;
	}

	public setArray(array: WritableArrayLike<number>): this {
		if (array.length < 3) {
			throw new MathError(`Array must be of length 3 at least.`);
		}
		this._array = array;
		return this;
	}

	public setValues(v: Vector3Values): this {
		const o = this._array;

		o[0] = v[0];
		o[1] = v[1];
		o[2] = v[2];

		return this;
	}
	
	public copy(vec: Vector3): this {
		const o = this._array;
		const v = vec.array;

		o[0] = v[0];
		o[1] = v[1];
		o[2] = v[2];

		return this;
	}

	public clone(): this {
		return new Vector3Base(this.values) as this;
	}

	public equals(vec: Vector3): boolean {
		const o = this._array;
		const v = vec.array;
		
		return v[0] === o[0]
			&& v[1] === o[1]
			&& v[2] === o[2];
	}

	public setZeros(): this {
		const o = this._array;

		o[0] = 0;
		o[1] = 0;
		o[2] = 0;

		return this;
	}

	public add(vec: Vector3): this {
		const o = this._array;
		const v = vec.array;

		o[0] = o[0] + v[0];
		o[1] = o[1] + v[1];
		o[2] = o[2] + v[2];

		return this;
	}

	public addScalar(k: number): this {
		const o = this._array;

		o[0] = o[0] + k;
		o[1] = o[1] + k;
		o[2] = o[2] + k;

		return this;
	}

	public sub(vec: Vector3): this {
		const o = this._array;
		const v = vec.array;

		o[0] = o[0] - v[0];
		o[1] = o[1] - v[1];
		o[2] = o[2] - v[2];
		
		return this;
	}

	public lerp(vec: Vector3, t: number): this {
		const o = this._array;
		const v = vec.array;

		o[0] = t * (v[0] - o[0]);
		o[1] = t * (v[1] - o[1]);
		o[2] = t * (v[2] - o[2]);

		return this;
	}

	public max(vecB: Vector3): this {
		const o = this._array;
		const b = vecB.array;
		
		o[0] = Math.max(o[0], b[0]);
		o[1] = Math.max(o[1], b[1]);
		o[2] = Math.max(o[2], b[2]);

		return this;
	}

	public min(vecB: Vector3): this {
		const o = this._array;
		const b = vecB.array;

		o[0] = Math.min(o[0], b[0]);
		o[1] = Math.min(o[1], b[1]);
		o[2] = Math.min(o[2], b[2]);

		return this;
	}

	public clamp(min: Vector3, max: Vector3): this {
		const o = this._array;
		const l = min.array;
		const g = max.array;

		o[0] = Math.min(g[0], Math.max(o[0], l[0]));
		o[1] = Math.min(g[1], Math.max(o[1], l[1]));
		o[2] = Math.min(g[2], Math.max(o[2], l[2]));
		
		return this;
	}

	public multScalar(k: number): this {
		const o = this._array;

		o[0] = o[0] * k;
		o[1] = o[1] * k;
		o[2] = o[2] * k;

		return this;
	}

	public cross(vec: Vector3): this {
		const o = this._array;
		const v = vec.array;
		
		const t0 = o[1] * v[2] - o[2] * v[1];
		const t1 = o[2] * v[0] - o[0] * v[2];
		const t2 = o[0] * v[1] - o[1] * v[0];
		
		o[0] = t0;
		o[1] = t1;
		o[2] = t2;
		
		return this;
	}

	public dot(vec: Vector3): number {
		const a = this._array;
		const b = vec.array;

		return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]);
	}

	public len(): number {
		const a = this._array;

		return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
	}

	public lenSq(): number {
		const a = this._array;

		return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
	}

	public dist(vec: Vector3): number {
		const a = this._array;
		const b = vec.array;

		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
		const dz = a[2] - b[2];

		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	}

	public distSq(vec: Vector3): number {
		const a = this._array;
		const b = vec.array;

		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
		const dz = a[2] - b[2];

		return dx * dx + dy * dy + dz * dz;
	}

	public normalize(): this {
		const o = this._array;

		const len = this.len();
		if (len > Number.EPSILON) {
			o[0] = o[0] / len;
			o[1] = o[1] / len;
			o[2] = o[2] / len;
		}
		else {
			o[0] = 0;
			o[1] = 0;
			o[2] = 0;
		}

		return this;
	}

	public negate(): this {
		const o = this._array;

		o[0] = -o[0];
		o[1] = -o[1];
		o[2] = -o[2];

		return this;
	}

	public mult(vec: Vector3): this {
		const o = this._array;
		const v = vec.array;

		o[0] = o[0] * v[0];
		o[1] = o[1] * v[1];
		o[2] = o[2] * v[2];

		return this;
	}

	public writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const v = this._array;

		out[offset    ] = v[0];
		out[offset + 1] = v[1];
		out[offset + 2] = v[2];
    }
    
    public readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		const o = this._array;

		o[0] = arr[offset    ];
		o[1] = arr[offset + 1];
		o[2] = arr[offset + 2];

		return this;
    }

	public addScaled(vec: Vector3, k: number): this {
		const o = this._array;
		const v = vec.array;

		o[0] = o[0] + v[0] * k;
		o[1] = o[1] + v[1] * k;
		o[2] = o[2] + v[2] * k;

		return this;
	}
	
	public copyAndSub(vecA: Vector3, vecB: Vector3): this {
		const o = this._array;
		const a = vecA.array;
		const b = vecB.array;
	
		o[0] = a[0] - b[0];
		o[1] = a[1] - b[1];
		o[2] = a[2] - b[2];

		return this;
	}

	public copyAndCross(vecA: Vector3, vecB: Vector3): this {
		const o = this._array;
		const a = vecA.array;
		const b = vecB.array;
		
		const t0 = a[1] * b[2] - a[2] * b[1];
		const t1 = a[2] * b[0] - a[0] * b[2];
		const t2 = a[0] * b[1] - a[1] * b[0];

		o[0] = t0;
		o[1] = t1;
		o[2] = t2;
	
		return this;
	}
}

var Vector3: Vector3Constructor = Vector3Base;

const Vector3Injector: Injector<Vector3Constructor> = new Injector({
	defaultCtor: Vector3Base,
	onDefaultOverride:
		(ctor: Vector3Constructor) => {
			Vector3 = ctor;
		}
});