import { Injector } from "../../../patterns/injectors/Injector";
import { StackPool } from "../../../patterns/pools/StackPool";
import { Space } from "../../geometry/space/Space";
import { MathError } from "../../MathError";
import { qSqrt } from "../../Snippets";
import { Matrix3 } from "../matrices/Matrix3";
import { Matrix4 } from "../matrices/Matrix4";
import { Vector3 } from "../vectors/Vector3";

export { QuaternionValues };
export { Quaternion };
export { QuaternionInjector };
export { QuaternionPool };

type QuaternionValues = [number, ...number[]] & { length: 4 };

interface QuaternionConstructor {
	readonly prototype: Quaternion;
	new(): Quaternion;
	new(x: number, y: number, z: number, w: number): Quaternion;
	new(array: WritableArrayLike<number>): Quaternion;
	slerp(from: Quaternion, to: Quaternion, t: number): Quaternion
	slerp(from: Quaternion, to: Quaternion, t: number, out: Quaternion): Quaternion
	fromArray(vector: ArrayLike<number>): Quaternion;
	fromAxisAngle(axis: Vector3, angle?: number): Quaternion;
	fromEuler(pitch: number, yaw: number, roll: number): Quaternion;
	fromVector(vector: Vector3): Quaternion;
	fromMatrix(matrix: Matrix3): Quaternion;
}
// TODO?:
// roll => pitch
// pitch => yaw
// yaw => roll
interface Quaternion {
	readonly array: WritableArrayLike<number>;
	x: number;
	y: number;
	z: number;
	w: number;
	pitch: number;
	yaw: number;
	roll: number;
	getValues(): QuaternionValues;
	setValues(
	  x: number, y: number,
	  z: number, w: number
	): this;
	//setArray(array: WritableArrayLike<number>): this;
	lookAt(source: Vector3, dest: Vector3): Quaternion ;
	setEuler(pitch: number, yaw: number, roll: number): this;

	setMatrix(matrix: Matrix3): Quaternion;
	setMatrix(matrix: Matrix4): Quaternion;

	setAxisAngle(axis: Vector3, angle: number): this;
	setVectors(from: Vector3, to: Vector3): this;
	
	copy(quat: Quaternion): this;
	clone(): this;
	getAxis(out: Vector3): Vector3;

	getMatrix(): Matrix3;
	
	rotate(vec: Vector3): Vector3;
	toVector(): Vector3;

	angleTo(quat: Quaternion): number;
	rotateTowards(quat: Quaternion): this;
	invert(): this;
	conjugate(): this;
	dot(quat: Quaternion): number;
	lengthSquared(): number;
	length(): number;
	normalize(): this;
	add(quat: Quaternion): this;
	sub(quat: Quaternion): this;
	mult(quat: Quaternion): this;
	scale(scalar: number): this;
	slerp(from: Quaternion, to: Quaternion, t: number): this;
	equals(quat: Quaternion): boolean;
	copyIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): void;
}

class QuaternionBase {
	private _array: WritableArrayLike<number>;

	public get array(): WritableArrayLike<number> {
		return this._array;
	}

	constructor()
	constructor(array: WritableArrayLike<number>)
	constructor(x: number, y: number, z: number, w: number)
	constructor(...args: any[]) {
		if (typeof args[0] === "number") {
			this._array = [
				args[0], args[1], args[2], args[3]
			];
		}
		else if (typeof args[0] === "object") {
			this._checkArray(args[0]);
			this._array = args[0];
		}
		else {
			this._array = [0, 0, 0, 0];
		}
	}

	public get x(): number {
        return this._array[0];
    }

    public set x(x: number) {
		this._array[0] = x;
    }

    public get y(): number {
        return this._array[1];
    }

    public set y(y: number) {
		this._array[1] = y;
    }

    public set z(z: number) {
		this._array[2] = z;
	}
	
    public get z(): number {
		return this._array[2];
    }

    public set w(w: number) {
		this._array[3] = w;
	}

    public get w(): number {
		return this._array[3];
	}
	
	public get pitch(): number {
		const array = this.array;
		const x = array[0];
		const y = array[1];
		const z = array[2];
		const w = array[3];
		const sinPitch = 2 * (w * y - z * x);
		if (Math.abs(sinPitch) >= 1) {
            return Math.sign(sinPitch) * (Math.PI / 2);
        }
		else {
            return Math.asin(sinPitch);
        }
	}

	public get yaw(): number {
		const array = this.array;
		const x = array[0];
		const y = array[1];
		const z = array[2];
		const w = array[3];
		const sinYawCosPitch = 2 * (w * z + x * y);
		const cosYawCosPitch = 1 - 2 * (y * y + z * z);
		return Math.atan2(sinYawCosPitch, cosYawCosPitch);
	}

	public get roll(): number {
		const array = this.array;
		const x = array[0];
		const y = array[1];
		const z = array[2];
		const w = array[3];
		const sinRollCosPitch = 2 * (w * x + y * z);
		const cosRollCosPitch = 1 - 2 * (x * x + y * y);
		return Math.atan2(sinRollCosPitch, cosRollCosPitch);
	}

	public getValues(): QuaternionValues {
		return [
			this._array[0],
			this._array[1],
			this._array[2],
			this._array[3]
		];
	}

	public setValues(x: number, y: number, z: number, w: number): this {
		this._array[0] = x;
		this._array[1] = y;
		this._array[2] = z;
		this._array[3] = w;

		return this;
	}

	private _checkArray(array: WritableArrayLike<number>): void {
		if (array.length < 4) {
			throw new MathError(`Array must be of length 4 at least.`);
		}
	}

	/*public setArray(array: WritableArrayLike<number>): this {
		this._checkArray(array);
		this._array = array;
		return this;
	}*/

	public static fromArray(array: WritableArrayLike<number>): QuaternionBase {
		return new QuaternionBase(array);
	}

	public static fromAxisAngle(axis: Vector3, angle: number): QuaternionBase {
		return new QuaternionBase().setAxisAngle(axis, angle);
	}

	public static fromVector(vector: Vector3): QuaternionBase {
		return new QuaternionBase(vector.x, vector.y, vector.z, 1);
	}
	
	public static fromEuler(yaw: number, pitch: number, roll: number): QuaternionBase {
		return new QuaternionBase().setEuler(yaw, pitch, roll);
	}

	public copy(quat: Quaternion): this {
		const o = this._array;
		const q = quat.array;

		o[0] = q[0];
		o[1] = q[1];
		o[2] = q[2];
		o[3] = q[3];

		return this;
	}

	public clone(): this {
		return new QuaternionBase(this.x, this.y, this.z, this.w) as this;
	}

	public equals(quat: Quaternion): boolean {
		const thisArray = this.array;
		const quatArray = quat.array;

		return (thisArray[0] === quatArray[0])
			&& (thisArray[1] === quatArray[1])
			&& (thisArray[2] === quatArray[2])
			&& (thisArray[3] === quatArray[3]);
	}

	public getAxis(out: Vector3): Vector3 {
		const thisArray = this.array;
		const outArray = out.array;

		const den = 1 - (thisArray[3] * thisArray[3]);

		if (den < Number.EPSILON) {
		  return out.setZeros();
		}
	  
		const scale = qSqrt(den);
		
		outArray[0] = thisArray[0] * scale;
		outArray[1] = thisArray[1] * scale;
		outArray[2] = thisArray[2] * scale;

		return out;
	}

	public getMatrix(): Matrix3 {
		const thisArray = this.array;
		const thisLengthSquared = this.lengthSquared();
		const s = 2.0 / thisLengthSquared;

		const x = thisArray[0];
		const y = thisArray[1];
		const z = thisArray[2];
		const w = thisArray[3];

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

		return new Matrix3([
			1 - (yy + zz),	xy + wz,		xz - wy,
			xy - wz,		1 - (xx + zz),	yz + wx,
			xz + wy,		yz - wx,		1 - (xx + yy)
		]);
	}

	public rotate(vector: Vector3): Vector3 {
		const thisArray = this.array;
		const vectorArray = vector.array;

		const vx = vectorArray[0];
		const vy = vectorArray[1];
		const vz = vectorArray[2];		
		
		const qx = thisArray[0];
		const qy = thisArray[1];
		const qz = thisArray[2];
		const qw = thisArray[3];

		const tx = qw * vx + -qx * 0 + -qy * vz + qz * vy;
		const ty = qw * vy + -qy * 0 + -qz * vx + qx * vz;
		const tz = qw * vz + -qz * 0 + -qx * vy + qy * vx;
		const tw = qx * vx + qw * 0 + qy * vy + qz * vz;

		vectorArray[0] = tw * qz + tz * qw + tx * qy - ty * qx;
		vectorArray[1] = tw * qy + ty * qw + tz * qx - tx * qz;
		vectorArray[2] = tw * qx + tx * qw + ty * qz - tz * qy;

		return vector;
	}

	public toVector(): Vector3 {
		return new Vector3([
			this.x, this.y, this.z
		]);
	}
	
	public setEuler(pitch: number, yaw: number, roll: number): this {
		const cosYaw = Math.cos(yaw * 0.5);
		const sinYaw = Math.sin(yaw * 0.5);
		const cosPitch = Math.cos(pitch * 0.5);
		const sinPitch = Math.sin(pitch * 0.5);
		const cosRoll = Math.cos(roll * 0.5);
		const sinRoll = Math.sin(roll * 0.5);
		const thisArray = this.array;

        thisArray[0] = sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw;
        thisArray[1] = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
        thisArray[2] = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
		thisArray[3] = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
        
		return this;
	}

	public setAxisAngle(axis: Vector3, angle: number = 0): this {
		const axisLength = axis.length();
		if (axisLength === 0) {
		  return this;
		}
		const halfSin = Math.sin(angle * 0.5) / axisLength;
		const axisArray = axis.array;
		const thisArray = this.array;
		thisArray[0] = axisArray[0] * halfSin;
		thisArray[1] = axisArray[1] * halfSin;
		thisArray[2] = axisArray[2] * halfSin;
		thisArray[3] = Math.cos(angle * 0.5);

		return this;
	}

	public setMatrix(matrix: Matrix3): this
	public setMatrix(matrix: Matrix4): this
	public setMatrix(matrix: Matrix3 | Matrix4): this {
		const matrixArray = matrix.array;
		let m11 = 0, m12 = 0, m13 = 0,
			m21 = 0, m22 = 0, m23 = 0,
			m31 = 0, m32 = 0, m33 = 0;

		if (matrix instanceof Matrix3) {
			m11 = matrixArray[0], m12 = matrixArray[3], m13 = matrixArray[6],
			m21 = matrixArray[1], m22 = matrixArray[4], m23 = matrixArray[7],
			m31 = matrixArray[2], m32 = matrixArray[5], m33 = matrixArray[8];
		}
		else {
			m11 = matrixArray[0], m12 = matrixArray[4], m13 = matrixArray[ 8],
			m21 = matrixArray[1], m22 = matrixArray[5], m23 = matrixArray[ 9],
			m31 = matrixArray[2], m32 = matrixArray[6], m33 = matrixArray[10];
		}

		const trace = m11 + m22 + m33;
		const thisArray = this.array;

		if (trace > 0) {
			const s = Math.sqrt(trace + 1) * 2;
			thisArray[3] = 0.25 * s;
			thisArray[0] = (m32 - m23) / s;
			thisArray[1] = (m13 - m31) / s;
			thisArray[2] = (m21 - m12) / s;
		}
		else if (m11 > m22 && m11 > m33) {
			const s = 2 * Math.sqrt(1 + m11 - m22 - m33);
			thisArray[3] = (m32 - m23) / s;
			thisArray[0] = 0.25 * s;
			thisArray[1] = (m12 + m21) / s;
			thisArray[2] = (m13 + m31) / s;
		}
		else if (m22 > m33) {
			const s = 2 * Math.sqrt(1 + m22 - m11 - m33);
			thisArray[3] = (m13 - m31) / s;
			thisArray[0] = (m12 + m21) / s;
			thisArray[1] = 0.25 * s;
			thisArray[2] = (m23 + m32) / s;
		}
		else {
			const s = 2 * Math.sqrt(1 + m33 - m11 - m22);
			thisArray[3] = (m21 - m12) / s;
			thisArray[0] = (m13 + m31) / s;
			thisArray[1] = (m23 + m32) / s;
			thisArray[2] = 0.25 * s;
		}

		return this;
	}

	public lookAt(source: Vector3, dest: Vector3): Quaternion {
		const forward = dest.clone().sub(source).normalize();

		const axis = Space.forward.clone().cross(forward);
		const dot = Space.forward.dot(forward);

		return new Quaternion(axis.x, axis.y, axis.z, dot + 1).normalize();
	}

	public static fromMatrix(matrix: Matrix3): QuaternionBase {
		return new QuaternionBase().setMatrix(matrix);
	}

	public setVectors(from: Vector3, to: Vector3): this {
		const dot = from.dot(to);
		const cross = from.cross(to);
		const crossArray = cross.array;
		const thisArray = this.array;

		thisArray[0] = crossArray[0];
		thisArray[1] = crossArray[1];
		thisArray[2] = crossArray[2];

		const fromLength = from.length();
		const toLength = from.length();

		thisArray[3] = Math.sqrt(fromLength * fromLength * toLength * toLength) + dot;

		return this.normalize();
	}

	public dot(quat: Quaternion): number {
		const thisArray = this.array;
		const quatArray = quat.array;
		return thisArray[0] * quatArray[0] + thisArray[1] * quatArray[1] + thisArray[2] * quatArray[2] + thisArray[3] * quatArray[3];
	}

	public lengthSquared(): number {
		const thisArray = this.array;
		return thisArray[0] ** 2 + thisArray[1] ** 2 + thisArray[2] ** 2 + thisArray[3] ** 2;
	}

	public length(): number {
		const thisArray = this.array;
		return Math.hypot(thisArray[0], thisArray[1], thisArray[2], thisArray[3]);
	}

	public angleTo(rotation: Quaternion): number {
		return 2 * Math.acos(Math.abs(Math.max(-1, Math.min(1, this.dot(rotation)))));
	}

	public rotateTowards(rotation: Quaternion): this {
		const angle = this.angleTo(rotation);

		if (angle === 0) {
			return this;
		}

		const t = Math.min(1, angle);
		this.slerp(this, rotation, t);

		return this;
	}

	public invert(): this {
		return this.conjugate();
	}
	
	public conjugate(): this {
		const thisArray = this.array;

		thisArray[0] *= -1;
		thisArray[1] *= -1;
		thisArray[2] *= -1;

		return this;
	}

	public normalize(): this {
		const thisArray = this.array;
		let length = this.length();

		if (length === 0) {
			thisArray[0] = 0;
			thisArray[1] = 0;
			thisArray[2] = 0;
			thisArray[3] = 1;
		}
		else {
			length = 1 / length;
			thisArray[0] *= length;
			thisArray[1] *= length;
			thisArray[2] *= length;
			thisArray[3] *= length;
		}

		return this;
	}
	
	public add(quat: Quaternion): this {
		const thisArray = this.array;
		const quatArray = quat.array;
		thisArray[0] += quatArray[0];
		thisArray[1] += quatArray[1];
		thisArray[2] += quatArray[2];
		thisArray[3] += quatArray[3];

		return this;
	}

	public sub(quat: Quaternion): this {
		const thisArray = this.array;
		const quatArray = quat.array;
		thisArray[0] -= quatArray[0];
		thisArray[1] -= quatArray[1];
		thisArray[2] -= quatArray[2];
		thisArray[3] -= quatArray[3];

		return this;
	}

	public mult(quat: Quaternion): this {
		const thisArray = this.array;
		const quatArray = quat.array;

		const ax = thisArray[0], ay = thisArray[1], az = thisArray[2], aw = thisArray[3];
		const bx = quatArray[0], by = quatArray[1], bz = quatArray[2], bw = quatArray[3];

		thisArray[0] = ax * bw + aw * bx + ay * bz - az * by;
		thisArray[1] = ay * bw + aw * by + az * bx - ax * bz;
		thisArray[2] = az * bw + aw * bz + ax * by - ay * bx;
		thisArray[3] = aw * bw - ax * bx - ay * by - az * bz;
		
		return this;
	}

	public scale(scalar: number): this {
		const thisArray = this.array;
		thisArray[0] *= scalar;
		thisArray[1] *= scalar;
		thisArray[2] *= scalar;
		thisArray[3] *= scalar;

		return this;
	}

	public static slerp(from: Quaternion, to: Quaternion, t: number): Quaternion
	public static slerp(from: Quaternion, to: Quaternion, t: number, out: Quaternion): Quaternion
	public static slerp(from: Quaternion, to: Quaternion, t: number, out?: Quaternion): Quaternion {
		if (!(out instanceof Quaternion)) {
			out = new Quaternion();
		}
		if (t === 0) return out.copy(from);
		if (t === 1) return out.copy(to);

		const outArray = out.array;
		const fromArray = from.array;
		const toArray = to.array;

		const cosHalfTheta = fromArray[3] * toArray[3] + fromArray[0] * toArray[0] + fromArray[1] * toArray[1] + fromArray[2] * toArray[2];
		
		if (Math.abs(cosHalfTheta) >= 1) {
			outArray[3] = fromArray[3];
			outArray[0] = fromArray[0];
			outArray[1] = fromArray[1];
			outArray[2] = fromArray[2];
			return out;
		}

		const halfTheta = Math.acos(cosHalfTheta);
		const sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
		
		if (Math.abs(sinHalfTheta - Math.trunc(sinHalfTheta)) < Number.EPSILON) {
			outArray[3] = (fromArray[3] * 0.5 + toArray[3] * 0.5);
			outArray[0] = (fromArray[0] * 0.5 + toArray[0] * 0.5);
			outArray[1] = (fromArray[1] * 0.5 + toArray[1] * 0.5);
			outArray[2] = (fromArray[2] * 0.5 + toArray[2] * 0.5);
			return out;
		}

		const ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta;
		const ratioB = Math.sin(t * halfTheta) / sinHalfTheta; 
		outArray[3] = (fromArray[3] * ratioA + toArray[3] * ratioB);
		outArray[0] = (fromArray[0] * ratioA + toArray[0] * ratioB);
		outArray[1] = (fromArray[1] * ratioA + toArray[1] * ratioB);
		outArray[2] = (fromArray[2] * ratioA + toArray[2] * ratioB);

		return out;
	}

	/**
	 * https://www.euclideanspace.com/maths/algebra/realNormedAlgebra/quaternions/slerp/
	 */
	public slerp(from: Quaternion, to: Quaternion, t: number): this {
		return Quaternion.slerp(from, to, t, this) as this;
	}

	public copyIntoArray(array: WritableArrayLike<number>, offset: number = 0): void {
		const thisArray = this.array;

		array[offset    ] = thisArray[0];
		array[offset + 1] = thisArray[1];
		array[offset + 2] = thisArray[2];
		array[offset + 3] = thisArray[3];
    }
    
    public readFromArray(array: ArrayLike<number>, offset: number = 0): void {
		const thisArray = this.array;

		thisArray[0] = array[offset    ];
		thisArray[1] = array[offset + 1];
		thisArray[2] = array[offset + 2];
		thisArray[3] = array[offset + 3];
    }
}

var Quaternion: QuaternionConstructor = QuaternionBase;
const QuaternionPool: StackPool<Quaternion> = new StackPool(QuaternionBase);
const QuaternionInjector: Injector<QuaternionConstructor> = new Injector({
	defaultCtor: QuaternionBase,
	onDefaultOverride:
		(ctor: QuaternionConstructor) => {
			Quaternion = ctor;
		}
});