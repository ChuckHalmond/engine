import { Injector } from "../../../patterns/injectors/Injector";
import { MathError } from "../../MathError";
import { Matrix4 } from "../matrices/Matrix4";

export { Vector4 };
export { Vector4Constructor };
export { Vector4Injector };
export { Vector4Base };

export type Vector4Values = [number, ...number[]] & { length: 4 };

interface Vector4Constructor {
	readonly prototype: Vector4;
	new(): Vector4;
	new(values: Vector4Values): Vector4;
	mult(mat: Matrix4, vec: Vector4): Vector4;
}

interface Vector4 {
	readonly array: Float32Array;
	values: Vector4Values;
	x: number;
	y: number;
	z: number;
	w: number;
	setValues(
		x: number,
		y: number,
		z: number,
		w: number
	): this;
	copy(vec: Vector4): this;
	clone(): this;
	equals(vec: Vector4): boolean;
	setZeros(): this;
	setUnit(): this;
	add(vec: Vector4): this;
	addScalar(k: number): this;
	sub(vec: Vector4): this;
	lerp(vec: Vector4, t: number): this;
	clamp(min: Vector4, max: Vector4): this;
	multScalar(k: number): this;
	dot(vec: Vector4): number;
	length(): number;
	lengthSquared(): number;
	dist(vec: Vector4): number;
	distSquared(vec: Vector4): number;
	normalize(): this;
	negate(): this;
	mult(vec: Vector4): this;
	addScaled(vec: Vector4, k: number): this;
	writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}

class Vector4Base implements Vector4 {
	readonly array: Float32Array;

	constructor()
	constructor(values: Vector4Values)
	constructor(values?: Vector4Values) {
		this.array = (values) ? new Float32Array([
			values[0], values[1], values[2], values[3]
		]) : new Float32Array([0, 0, 0, 0]);
	}
	
	get values(): Vector4Values {
		return [
			this.array[0],
			this.array[1],
			this.array[2],
			this.array[3]
		];
	}

	set values(values: Vector4Values) {
		this.array[0] = values[0];
		this.array[1] = values[1];
		this.array[2] = values[2];
		this.array[3] = values[3];
	}

	get 0() {
		return this.array[0];
	}

	set 0(x: number) {
		this.array[0] = x;
	}

	get 1() {
		return this.array[1];
	}

	set 1(y: number) {
		this.array[1] = y;
	}

	get 2() {
		return this.array[2];
	}

	set 2(z: number) {
		this.array[2] = z;
	}

	get 3() {
		return this.array[3];
	}

	set 3(w: number) {
		this.array[3] = w;
	}

	get x() {
		return this.array[0];
	}

	set x(x: number) {
		this.array[0] = x;
	}

	get y(): number {
		return this.array[1];
	}

	set y(y: number) {
		this.array[1] = y;
	}

	get z(): number {
		return this.array[2];
	}

	set z(z: number) {
		this.array[2] = z;
    }
    
	get w(): number {
		return this.array[3];
	}

	set w(w: number) {
		this.array[3] = w;
	}

	setValues(x: number, y: number, z: number, w: number): this {
		const o = this.array;
		
		o[0] = x;
		o[1] = y;
		o[2] = z;
		o[3] = w;

		return this;
	}

	copy(vec: Vector4): this {
		const o = this.array;
		const v = vec.array;

		o[0] = v[0];
		o[1] = v[1];
		o[2] = v[2];
		o[3] = v[3];

		return this;
	}

	clone(): this {
		return new Vector4Base(this.values) as this;
	}

	equals(vec: Vector4): boolean {
		const o = this.array;
		const v = vec.array;
		
		return v[0] === o[0]
			&& v[1] === o[1]
			&& v[2] === o[2]
			&& v[3] === o[3];
	}

	setZeros(): this {
		const o = this.array;

		o[0] = 0;
		o[1] = 0;
		o[2] = 0;
		o[3] = 0;

		return this;
	}

	setUnit(): this {
		const o = this.array;

		o[0] = 1;
		o[1] = 1;
		o[2] = 1;
		o[3] = 1;

		return this;
	}

	add(vec: Vector4): this {
		const o = this.array;
		const v = vec.array;

		o[0] = o[0] + v[0];
		o[1] = o[1] + v[1];
		o[2] = o[2] + v[2];
		o[3] = o[3] + v[3];

		return this;
	}

	addScalar(k: number): this {
		const o = this.array;

		o[0] = o[0] + k;
		o[1] = o[1] + k;
		o[2] = o[2] + k;
		o[3] = o[3] + k;

		return this;
	}

	sub(vec: Vector4): this {
		const v = vec.array;
		const o = this.array;

		o[0] = o[0] - v[0];
		o[1] = o[1] - v[1];
		o[2] = o[2] - v[2];
		o[3] = o[3] - v[3];

		return this;
	}

	lerp(vec: Vector4, t: number): this {
		const o = this.array;
		const v = vec.array;

		o[0] = t * (v[0] - o[0]);
		o[1] = t * (v[1] - o[1]);
		o[2] = t * (v[2] - o[2]);
		o[3] = t * (v[3] - o[3]);

		return this;
	}

	clamp(min: Vector4, max: Vector4): this {
		const o = this.array;
		const l = min.array;
		const g = max.array;
		
		o[0] = Math.min(g[0], Math.max(l[0], o[0]));
		o[1] = Math.min(g[1], Math.max(l[0], o[1]));
		o[2] = Math.min(g[2], Math.max(l[0], o[2]));
		o[3] = Math.min(g[3], Math.max(l[0], o[3]));
		
		return this;
	}

	multScalar(k: number): this {
		const o = this.array;

		o[0] = o[0] * k;
		o[1] = o[1] * k;
		o[2] = o[2] * k;
		o[3] = o[3] * k;

		return this;
	}

	dot(vec: Vector4): number {
		const a = this.array;
		const b = vec.array;

		return (a[0] * b[0]) + (a[1] * b[1]) + (a[2] * b[2]) + (a[3] * b[3]);
	}

	length(): number {
		const v = this.array;

		return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3]);
	}

	lengthSquared(): number {
		const v = this.array;

		return v[0] * v[0] + v[1] * v[1] + v[2] * v[2] + v[3] * v[3];
	}

	dist(vec: Vector4): number {
		const a = this.array;
		const b = vec.array;
		
		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
        const dz = a[2] - b[2];
        const dw = a[3] - b[3];

		return Math.sqrt(dx * dx + dy * dy + dz * dz + dw * dw);
	}

	distSquared(vec: Vector4): number {
		const a = this.array;
		const b = vec.array;

		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
        const dz = a[2] - b[2];
		const dw = a[3] - b[3];
		
		return dx * dx + dy * dy + dz * dz + dw * dw;
	}

	normalize(): this {
		const o = this.array;

		const lenSq = o[0] * o[0] + o[1] * o[1] + o[2] * o[2] + o[3] * o[3];
		const len = Math.sqrt(lenSq);
		if (len > Number.EPSILON) {
			o[0] = o[0] / len;
			o[1] = o[1] / len;
			o[2] = o[2] / len;
			o[3] = o[3] / len;
		}
		else {
			o[0] = 0;
			o[1] = 0;
            o[2] = 0;
			o[3] = 0;
		}

		return this;
	}

	negate(): this {
		const o = this.array;

		o[0] = -o[0];
		o[1] = -o[1];
		o[2] = -o[2];
		o[3] = -o[3];

		return this;
	}

	mult(vec: Vector4): this {
		const o = this.array;
		const v = vec.array;

		o[0] = o[0] * v[0];
		o[1] = o[1] * v[1];
		o[2] = o[2] * v[2];
		o[3] = o[3] * v[3];

		return this;
	}

	static mult(mat: Matrix4, vec: Vector4): Vector4 {
		const m = mat.array;
		const v = vec.array;

		return new Vector4Base([
			m[ 0] * v[0] + m[ 1] * v[1] + m[ 2] * v[2] + m[ 3] * v[3],
			m[ 4] * v[0] + m[ 5] * v[1] + m[ 6] * v[2] + m[ 7] * v[3],
			m[ 8] * v[0] + m[ 9] * v[1] + m[10] * v[2] + m[11] * v[3],
			m[12] * v[0] + m[13] * v[1] + m[14] * v[2] + m[15] * v[3]
		]);
	}

	addScaled(vec: Vector4, k: number): this {
		const v = vec.array;
		const o = this.array;

		o[0] = o[0] + v[0] * k;
		o[1] = o[1] + v[1] * k;
		o[2] = o[2] + v[2] * k;
		o[3] = o[3] + v[3] * k;

		return this;
	}

	writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const v = this.array;

		out[offset    ] = v[0];
		out[offset + 1] = v[1];
		out[offset + 2] = v[2];
		out[offset + 3] = v[3];
    }
    
    readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		const o = this.array;

		o[0] = arr[offset    ];
		o[1] = arr[offset + 1];
		o[2] = arr[offset + 2];
		o[3] = arr[offset + 3];

		return this;
    }
}

var Vector4: Vector4Constructor = Vector4Base;
const Vector4Injector: Injector<Vector4Constructor> = new Injector({
	defaultCtor: Vector4Base,
	onDefaultOverride:
		(ctor: Vector4Constructor) => {
			Vector4 = ctor;
		}
});