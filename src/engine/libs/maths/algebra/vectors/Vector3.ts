import { Matrix3 } from "engine/libs/maths/algebra/matrices/Matrix3";
import { Injector } from "../../../patterns/injectors/Injector";
import { MathError } from "../../MathError";

export { Vector3Constructor };
export { Vector3 };
export { Vector3Base };
export { Vector3Injector };

export type Vector3Values = [number, ...number[]] & { length: 3 };

interface Vector3Constructor {
	readonly prototype: Vector3;
	new(): Vector3;
	new(x: number, y: number, z: number): Vector3;
  	new(array: ArrayLike<number>): Vector3;
	angle(vectorA: Vector3, vectorB: Vector3): number;
}

interface Vector3 extends Iterable<number> {
	readonly array: Float32Array;
	values: Vector3Values;
	x: number;
	y: number;
	z: number;
	toString(): string;
	setValues(
		x: number,
		y: number,
		z: number
	): this;
	equals(vec: Vector3): boolean;
	copy(vec: Vector3): this;
	clone(): this;
	setUnit(): this;
	setZeros(): this;
	toCartesian(center: Vector3): this;
	toSpherical(center: Vector3): this;
	add(vec: Vector3): this;
	addScalar(k: number): this;
	sub(vec: Vector3): this;
	lerp(from: Vector3, to: Vector3, t: number): this;
	max(vecB: Vector3): this;
	min(vecB: Vector3): this;
	clamp(min: Vector3, max: Vector3): this;
	scale(k: number): this;
	cross(vec: Vector3): this;
	dot(vec: Vector3): number;
	length(): number;
	lengthSquared(): number;
	distance(vec: Vector3): number;
	distanceSquared(vec: Vector3): number;
	normalize(): this;
	negate(): this;
	mult(vec: Vector3): this;
	mult(mat: Matrix3): this;
	addScaled(vec: Vector3, k: number): this;
	copyAndSub(vecA: Vector3, vecB: Vector3): this;
	copyAndCross(vecA: Vector3, vecB: Vector3): this;
	writeIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}

class Vector3Base implements Vector3 {
	readonly array: Float32Array;

	constructor()
	constructor(array: ArrayLike<number>)
	  constructor(
	  x: number, y: number, z: number
	)
	constructor(
	  ...args: any[]
	) {
		if (typeof args[0] === "number") {
			this.array = new Float32Array([args[0], args[2], args[1]]);
		}
		else if (typeof args[0] === "object") {
			const array = args[0];
			if (array.length < 3) {
				throw new MathError(`Array must be of length 3 at least.`);
			}
			if (array instanceof Float32Array) {
				this.array = array;
			}
			else {
				this.array = new Float32Array(array);
			}
		}
		else {
			this.array = new Float32Array([0, 0, 0]);
		}
	}

	toString(): string {
		return `Vector3([${Array.from(this.array).join(", ")}])`;
	}

	static angle(vectorA: Vector3, vectorB: Vector3): number {
		const temp = new Vector3();
		return Math.acos(temp.copy(vectorA).dot(vectorB) / (Math.sqrt(temp.copy(vectorA).dot(vectorA)) * Math.sqrt(temp.copy(vectorB).dot(vectorB))));
	}

	get values(): Vector3Values {
		return [
			this.array[0],
			this.array[1],
			this.array[2]
		];
	}

	set values(values: Vector3Values) {
		this.array[0] = values[0];
		this.array[1] = values[1];
		this.array[2] = values[2];
	}

	get x() {
		return this.array[0];
	}

	set x(x: number) {
		this.array[0] = x;
	}

	get y() {
		return this.array[1];
	}

	set y(y: number) {
		this.array[1] = y;
	}

	get z() {
		return this.array[2];
	}

	set z(z: number) {
		this.array[2] = z;
	}

	setValues(x: number, y: number, z: number): this {
		this.array[0] = x;
		this.array[1] = y;
		this.array[2] = z;

		return this;
	}
	
	copy(vec: Vector3): this {
		const v = vec.array;

		this.array[0] = v[0];
		this.array[1] = v[1];
		this.array[2] = v[2];

		return this;
	}

	clone(): this {
		return new Vector3Base(this.values) as this;
	}

	equals(vector: Vector3): boolean {
		return vector.array[0] === this.array[0]
			&& vector.array[1] === this.array[1]
			&& vector.array[2] === this.array[2];
	}

	setZeros(): this {
		this.array[0] = 0;
		this.array[1] = 0;
		this.array[2] = 0;

		return this;
	}

	setUnit(): this {
		this.array[0] = 1;
		this.array[1] = 1;
		this.array[2] = 1;

		return this;
	}

	add(vector: Vector3): this {
		this.array[0] = this.array[0] + vector.array[0];
		this.array[1] = this.array[1] + vector.array[1];
		this.array[2] = this.array[2] + vector.array[2];

		return this;
	}

	addScalar(k: number): this {
		this.array[0] = this.array[0] + k;
		this.array[1] = this.array[1] + k;
		this.array[2] = this.array[2] + k;

		return this;
	}

	sub(vector: Vector3): this {
		this.array[0] = this.array[0] - vector.array[0];
		this.array[1] = this.array[1] - vector.array[1];
		this.array[2] = this.array[2] - vector.array[2];
		
		return this;
	}

	lerp(from: Vector3, to: Vector3, t: number): this {
		
		this.array[0] = (1 - t) * from.x + t * (to.x - from.x);
		this.array[1] = (1 - t) * from.y + t * (to.y - from.y);
		this.array[2] = (1 - t) * from.z + t * (to.z - from.z);

		return this;
	}

	max(vectorB: Vector3): this {
		this.array[0] = Math.max(this.array[0], vectorB.array[0]);
		this.array[1] = Math.max(this.array[1], vectorB.array[1]);
		this.array[2] = Math.max(this.array[2], vectorB.array[2]);

		return this;
	}

	min(vectorB: Vector3): this {
		this.array[0] = Math.min(this.array[0], vectorB.array[0]);
		this.array[1] = Math.min(this.array[1], vectorB.array[1]);
		this.array[2] = Math.min(this.array[2], vectorB.array[2]);

		return this;
	}

	clamp(min: Vector3, max: Vector3): this {
		this.array[0] = Math.min(max.array[0], Math.max(this.array[0], min.array[0]));
		this.array[1] = Math.min(max.array[1], Math.max(this.array[1], min.array[1]));
		this.array[2] = Math.min(max.array[2], Math.max(this.array[2], min.array[2]));
		
		return this;
	}

	scale(k: number): this {
		this.array[0] = this.array[0] * k;
		this.array[1] = this.array[1] * k;
		this.array[2] = this.array[2] * k;

		return this;
	}

	cross(vector: Vector3): this {
		const t0 = this.array[1] * vector.array[2] - this.array[2] * vector.array[1];
		const t1 = this.array[2] * vector.array[0] - this.array[0] * vector.array[2];
		const t2 = this.array[0] * vector.array[1] - this.array[1] * vector.array[0];
		
		this.array[0] = t0;
		this.array[1] = t1;
		this.array[2] = t2;
		
		return this;
	}

	dot(vec: Vector3): number {
		const a = this.array;
		const b = vec.array;

		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	length(): number {
		const a = this.array;

		return Math.sqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
	}

	lengthSquared(): number {
		const a = this.array;
		
		return a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
	}

	distance(vec: Vector3): number {
		const a = this.array;
		const b = vec.array;

		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
		const dz = a[2] - b[2];

		return Math.hypot(dx, dy, dz);
	}

	distanceSquared(vec: Vector3): number {
		const a = this.array;
		const b = vec.array;

		const dx = a[0] - b[0];
		const dy = a[1] - b[1];
		const dz = a[2] - b[2];

		return dx * dx + dy * dy + dz * dz;
	}

	normalize(): this {
		const {array} = this;
		const length = this.length();
		if (length > Number.EPSILON) {
			array[0] /= length;
			array[1] /= length;
			array[2] /= length;
		}
		else {
			array[0] = 0;
			array[1] = 0;
			array[2] = 0;
		}

		return this;
	}

	negate(): this {
		this.array[0] *= -1;
		this.array[1] *= -1;
		this.array[2] *= -1;

		return this;
	}

	mult(mat: Matrix3): this
	mult(vec: Vector3): this
	mult(arg0: Matrix3 | Vector3): this {
		if (arg0 instanceof Vector3) {
			const v = arg0.array;

			this.array[0] = this.array[0] * v[0];
			this.array[1] = this.array[1] * v[1];
			this.array[2] = this.array[2] * v[2];

			return this;
		}
		else {
			const x = this.x;
			const y = this.y;
			const z = this.z;

			const m = arg0.array;

			this.x = x * m[0] + y * m[3] + z * m[6];
			this.y = x * m[1] + y * m[4] + z * m[7];
			this.z = x * m[2] + y * m[5] + z * m[8];

			return this;
		}
	}

	toSpherical(center: Vector3): this {
        const thisArray = this.array;
        const centerArray = center.array;

        const x = thisArray[0] - centerArray[0];
        const y = thisArray[1] - centerArray[1];
        const z = thisArray[2] - centerArray[2];

        const roh = Math.hypot(x, y, z);
        const theta = Math.acos(y / roh);
        const phi = Math.atan2(z, x);
        thisArray[0] = roh;
        thisArray[1] = theta;
        thisArray[2] = phi;

		return this;
    }

    toCartesian(center: Vector3): this {
        const thisArray = this.array;
        const centerArray = center.array;

        const roh = thisArray[0];
        const theta = thisArray[1];
        const phi = thisArray[2];

        const x = roh * Math.sin(theta) * Math.cos(phi) + centerArray[0];
        const y = roh * Math.cos(theta) + centerArray[1];
        const z = roh * Math.sin(theta) * Math.sin(phi) + centerArray[2];
        thisArray[0] = x;
        thisArray[1] = y;
        thisArray[2] = z;

		return this;
    }

	static mult(mat: Matrix3, vec: Vector3): Vector3 {
		const m = mat.array;
		const v = vec.array;

		return new Vector3Base([
			m[0] * v[0] + m[1] * v[1] + m[2] * v[2],
			m[3] * v[0] + m[4] * v[1] + m[5] * v[2],
			m[6] * v[0] + m[7] * v[1] + m[8] * v[2]
		]);
	}

	writeIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const v = this.array;

		out[offset    ] = v[0];
		out[offset + 1] = v[1];
		out[offset + 2] = v[2];
    }
    
    readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		this.array[0] = arr[offset    ];
		this.array[1] = arr[offset + 1];
		this.array[2] = arr[offset + 2];

		return this;
    }

	addScaled(vector: Vector3, k: number): this {
		this.array[0] = this.array[0] + vector.array[0] * k;
		this.array[1] = this.array[1] + vector.array[1] * k;
		this.array[2] = this.array[2] + vector.array[2] * k;

		return this;
	}
	
	copyAndSub(vecA: Vector3, vecB: Vector3): this {
		const a = vecA.array;
		const b = vecB.array;
	
		this.array[0] = a[0] - b[0];
		this.array[1] = a[1] - b[1];
		this.array[2] = a[2] - b[2];

		return this;
	}

	copyAndCross(vecA: Vector3, vecB: Vector3): this {
		const a = vecA.array;
		const b = vecB.array;
		
		const t0 = a[1] * b[2] - a[2] * b[1];
		const t1 = a[2] * b[0] - a[0] * b[2];
		const t2 = a[0] * b[1] - a[1] * b[0];

		this.array[0] = t0;
		this.array[1] = t1;
		this.array[2] = t2;
	
		return this;
	}

	[Symbol.iterator] (): Iterator<number> {
		const {array} = this;
		const {length} = array;
		let i = 0;
		return {
			next() {
				if (i < length) {
					return {
						value: array[i++], done: false
					};
				}
				return {
					value: undefined, done: true
				}
			}
		}
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