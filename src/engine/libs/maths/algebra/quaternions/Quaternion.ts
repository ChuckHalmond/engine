import { Injector } from "../../../patterns/injectors/Injector";
import { StackPool } from "../../../patterns/pools/StackPool";
import { MathError } from "../../MathError";
import { qSqrt } from "../../Snippets";
import { EulerAngles } from "../angles/EulerAngles";
import { Matrix3Values, Matrix3 } from "../matrices/Matrix3";
import { Matrix4 } from "../matrices/Matrix4";
import { Vector3 } from "../vectors/Vector3";

export { QuaternionValues };
export { Quaternion };
export { QuaternionInjector };
export { QuaternionBase };
export { QuaternionPool };

type QuaternionValues = [number, ...number[]] & { length: 4 };

interface QuaternionConstructor {
	readonly prototype: Quaternion;
	new(): Quaternion;
	new(values: QuaternionValues): Quaternion;
	fromEuler(euler: EulerAngles): Quaternion;
	fromVector(vector: Vector3): Quaternion;
	fromMatrix(matrix: Matrix3): Quaternion;
}

interface Quaternion {
	readonly array: ArrayLike<number>;
	values: QuaternionValues;
	x: number;
	y: number;
	z: number;
	w: number;
	setArray(array: WritableArrayLike<number>): this;
    setValues(v: QuaternionValues): this;
	copy(quat: Quaternion): this;
	clone(): this;
	getAxis(out: Vector3): Vector3;
	setFromMatrix(matrix: Matrix3): Quaternion;
	toMatrix(): Matrix3;
	rotate(vec: Vector3): Vector3;
	setEuler(euler: EulerAngles): this;
	toEuler(): EulerAngles;
	toVector(): Vector3;
	setFromAxisAngle(axis: Vector3, angle: number): this;
	setFromVectors(from: Vector3, to: Vector3): this;
	angleTo(quat: Quaternion): number;
	rotateTowards(quat: Quaternion): this;
	invert(): this;
	conjugate(): this;
	dot(quat: Quaternion): number;
	lenSq(): number;
	len(): number;
	normalize(): this;
	add(quat: Quaternion): this;
	sub(quat: Quaternion): this;
	mult(quat: Quaternion): this;
	multScalar(scalar: number): this;
	slerp(quat: Quaternion, t: number): this;
	equals(quat: Quaternion): boolean;
	copyIntoArray(out: WritableArrayLike<number>, offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): void;
}

class QuaternionBase {
	protected _array: WritableArrayLike<number>;

	constructor()
	constructor(values: QuaternionValues)
	constructor(values?: QuaternionValues) {
		this._array = (values) ? [
			values[0], values[1], values[2], values[3]
		] : [0, 0, 0, 0];
	}

	public static fromVector(vector: Vector3): QuaternionBase {
		return new QuaternionBase([vector.x, vector.y, vector.z, 0]);
	}
	
	public static fromEuler(eulerAngles: EulerAngles): QuaternionBase {
		const halfYaw = eulerAngles.pitch * 0.5;
		const halfPitch = eulerAngles.yaw * 0.5;
		const halfRoll = eulerAngles.roll * 0.5;
		const cosYaw = Math.cos(halfYaw);
		const sinYaw = Math.sin(halfYaw);
		const cosPitch = Math.cos(halfPitch);
		const sinPitch = Math.sin(halfPitch);
		const cosRoll = Math.cos(halfRoll);
		const sinRoll = Math.sin(halfRoll);
		
		return new QuaternionBase([
			cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw,
			cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw,
			sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw,
			cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw
		]);
	}

	public get array(): ArrayLike<number> {
		return this._array;
	}

	public get values(): QuaternionValues {
		return [
			this._array[0],
			this._array[1],
			this._array[2],
			this._array[3]
		];
	}

	public set values(values: QuaternionValues) {
		this._array[0] = values[0];
		this._array[1] = values[1];
		this._array[2] = values[2];
		this._array[3] = values[3];
	}

    private get _x(): number {
        return this._array[0];
    }

    private set _x(x: number) {
		this._array[0] = x;
    }

    private get _y(): number {
        return this._array[1];
    }

    private set _y(y: number) {
		this._array[1] = y;
    }

    private set _z(z: number) {
		this._array[2] = z;
	}
	
    private get _z(): number {
		return this._array[2];
    }

    private set _w(w: number) {
		this._array[3] = w;
	}

    private get _w(): number {
		return this._array[3];
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

	public setArray(array: WritableArrayLike<number>): this {
		if (array.length < 4) {
			throw new MathError(`Array must be of length 4 at least.`);
		}
		this._array = array;
		return this;
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

    public setValues(v: QuaternionValues): this {
		const o = this._array;

		o[0] = v[0];
		o[1] = v[1];
		o[2] = v[2];
		o[3] = v[3];

		return this;
	}

	public clone(): this {
		return new QuaternionBase(this.values) as this;
	}

	public equals(quat: Quaternion): boolean {
		const o = this._array;
		const q = quat.array;

		return (o[0] === q[0])
			&& (o[1] === q[1])
			&& (o[2] === q[2])
			&& (o[3] === q[3]);
	}

	public getAxis(out: Vector3): Vector3 {
		const den = 1.0 - (this._w * this._w);

		if (den < Number.EPSILON) {
		  return out.setZeros();
		}
	  
		const scale = qSqrt(den);
		
		out.setValues([this._x * scale, this._y * scale, this._z * scale])

		return out;
	}

	public toMatrix(): Matrix3 {
		const d = this.len();
		const s = 2.0 / d;

		const x = this._x;
		const y = this._y;
		const z = this._z;
		const w = this._w;

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

	public rotate(vec: Vector3): Vector3 {
		const vx = vec.x;
		const vy = vec.y;
		const vz = vec.z;		
		
		const qx = this._x;
		const qy = this._y;
		const qz = this._z;
		const qw = this._w;

		const tx = qw * vx + -qx * 0.0 + -qy * vz + qz * vy;
		const ty = qw * vy + -qy * 0.0 + -qz * vx + qx * vz;
		const tz = qw * vz + -qz * 0.0 + -qx * vy + qy * vx;
		const tw = qx * vx + qw * 0.0 + qy * vy + qz * vz;

		vec.setValues([
			tw * qz + tz * qw + tx * qy - ty * qx,
			tw * qy + ty * qw + tz * qx - tx * qz,
			tw * qx + tx * qw + ty * qz - tz * qy
		]);

		return vec;
	}

	public toEuler(): EulerAngles {
		const euler = new EulerAngles();
		
		const x = this.x;
		const y = this.y;
		const z = this.z;
		const w = this.w;
		
		const sinr_cosp = 2 * (w * x + y * z);
		const cosr_cosp = 1 - 2 * (x * x + y * y);
		euler.roll = Math.atan2(sinr_cosp, cosr_cosp);
		
		const sinp = 2 * (w * y - z * x);
		if (Math.abs(sinp) >= 1)
			euler.pitch = Math.sign(sinp) * (Math.PI / 2); // use 90 degrees if out of range
		else
			euler.pitch = Math.asin(sinp);
		
		const siny_cosp = 2 * (w * z + x * y);
		const cosy_cosp = 1 - 2 * (y * y + z * z);
		euler.yaw = Math.atan2(siny_cosp, cosy_cosp);
	
		return euler;
	}

	public toVector(): Vector3 {
		return new Vector3([
			this.x, this.y, this.z
		]);
	}

	public setEuler(eulerAngles: EulerAngles): this {
		const halfYaw = eulerAngles.yaw * 0.5;
		const halfPitch = eulerAngles.pitch * 0.5;
		const halfRoll = eulerAngles.roll * 0.5;
		const cosYaw = Math.cos(halfYaw);
		const sinYaw = Math.sin(halfYaw);
		const cosPitch = Math.cos(halfPitch);
		const sinPitch = Math.sin(halfPitch);
		const cosRoll = Math.cos(halfRoll);
		const sinRoll = Math.sin(halfRoll);
		
		this.x = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
		this.y = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
		this.z = sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw;
		this.w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;

		return this;
	}

	public setFromAxisAngle(axis: Vector3, angle: number): this {

		const halfAngle = angle / 2, s = Math.sin(halfAngle);

		this._x = axis.x * s;
		this._y = axis.y * s;
		this._z = axis.z * s;
		this._w = Math.cos(halfAngle);

		return this;
	}

	public setFromMatrix(matrix: Matrix3): this {
		const m = matrix.values;

		const m11 = m[0], m12 = m[1], m13 = m[2],
			  m21 = m[3], m22 = m[4], m23 = m[5],
			  m31 = m[6], m32 = m[7], m33 = m[8];
		const trace = m11 + m22 + m33;

		if (trace > 0) {
			const s = 0.5 / Math.sqrt(trace + 1.0);
			this._w = 0.25 / s;
			this._x = (m32 - m23) * s;
			this._y = (m13 - m31) * s;
			this._z = (m21 - m12) * s;
		}
		else if (m11 > m22 && m11 > m33) {
			const s = 2.0 * Math.sqrt(1.0 + m11 - m22 - m33);
			this._w = (m32 - m23) / s;
			this._x = 0.25 * s;
			this._y = (m12 + m21) / s;
			this._z = (m13 + m31) / s;
		}
		else if (m22 > m33) {
			const s = 2.0 * Math.sqrt(1.0 + m22 - m11 - m33);
			this._w = ( m13 - m31 ) / s;
			this._x = ( m12 + m21 ) / s;
			this._y = 0.25 * s;
			this._z = ( m23 + m32 ) / s;
		}
		else {
			const s = 2.0 * Math.sqrt(1.0 + m33 - m11 - m22);
			this._w = (m21 - m12) / s;
			this._x = (m13 + m31) / s;
			this._y = (m23 + m32) / s;
			this._z = 0.25 * s;
		}

		return this;
	}

	public static fromMatrix(matrix: Matrix3): QuaternionBase {
		return new QuaternionBase().setFromMatrix(matrix);
	}

	public setFromVectors(from: Vector3, to: Vector3): this {
		let r = from.dot(to) + 1;

		if (r < Number.EPSILON) {
			r = 0;

			if (Math.abs(from.x) > Math.abs(from.z)) {
				this._x = - from.y;
				this._y = from.x;
				this._z = 0;
				this._w = r;
			} else {
				this._x = 0;
				this._y = - from.z;
				this._z = from.y;
				this._w = r;
			}
		}
		else {
			this._x = from.y * to.z - from.z * to.y;
			this._y = from.z * to.x - from.x * to.z;
			this._z = from.x * to.y - from.y * to.x;
			this._w = r;
		}

		return this.normalize();
	}

	public dot(quat: Quaternion): number {
		return this._x * quat.x + this._y * quat.y + this._z * quat.z + this._w * quat.w;
	}

	public lenSq(): number {
		return this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w;
	}

	public len(): number {
		return Math.sqrt(this._x * this._x + this._y * this._y + this._z * this._z + this._w * this._w);
	}

	public angleTo(quat: Quaternion): number {
		return 2 * Math.acos(Math.abs(Math.max(-1, Math.min(1, this.dot(quat)))));
	}

	public rotateTowards(quat: Quaternion): this {
		const angle = this.angleTo(quat);

		if (angle === 0) {
			return this;
		}

		const t = Math.min(1, angle);
		this.slerp(quat, t);

		return this;
	}

	public invert(): this {
		return this.conjugate();
	}

	public conjugate(): this {
		this._x *= -1;
		this._y *= -1;
		this._z *= -1;

		return this;
	}

	public normalize(): this {
		let l = this.len();

		if (l === 0) {
			this._x = 0;
			this._y = 0;
			this._z = 0;
			this._w = 1;
		}
		else {
			l = 1 / l;
			this._x = this._x * l;
			this._y = this._y * l;
			this._z = this._z * l;
			this._w = this._w * l;
		}

		return this;
	}
	
	public add(quat: Quaternion): this {
		const q = quat.array;
		this._x = this._x + q[0];
		this._y = this._y + q[1];
		this._z = this._z + q[2];
		this._w = this._w + q[3];

		return this;
	}

	public sub(quat: Quaternion): this {
		const q = quat.array;
		this._x = this._x - q[0];
		this._y = this._y - q[1];
		this._z = this._z - q[2];
		this._w = this._w - q[3];

		return this;
	}

	public mult(quat: Quaternion): this {
		const ax = this._x, ay = this._y, az = this._z, aw = this._w;
		const bx = quat.x, by = quat.y, bz = quat.z, bw = quat.w;

		this._x = ax * bw + aw * bx + ay * bz - az * by;
		this._y = ay * bw + aw * by + az * bx - ax * bz;
		this._z = az * bw + aw * bz + ax * by - ay * bx;
		this._w = aw * bw - ax * bx - ay * by - az * bz;

		return this;
	}

	public multScalar(scalar: number): this {
		this._x = this._x * scalar;
		this._y = this._y * scalar;
		this._z = this._z * scalar;
		this._w = this._w * scalar;

		return this;
	}

	public slerp(quat: Quaternion, t: number): this {

		if (t === 0) return this;
		if (t === 1) return this.copy(quat);

		const x = this._x, y = this._y, z = this._z, w = this._w;

		let cosHalfTheta = w * quat.w + x * quat.x + y * quat.y + z * quat.z;

		if (cosHalfTheta < 0) {
			this._w = - quat.w;
			this._x = - quat.x;
			this._y = - quat.y;
			this._z = - quat.z;

			cosHalfTheta = - cosHalfTheta;
		}
		else {
			this.copy(quat);
		}

		if (cosHalfTheta >= 1.0) {
			this._w = w;
			this._x = x;
			this._y = y;
			this._z = z;

			return this;
		}

		const sqSinHalfTheta = 1.0 - cosHalfTheta * cosHalfTheta;

		if (sqSinHalfTheta <= Number.EPSILON) {
			const s = 1 - t;
			this._w = s * w + t * this._w;
			this._x = s * x + t * this._x;
			this._y = s * y + t * this._y;
			this._z = s * z + t * this._z;

			this.normalize();

			return this;

		}

		const sinHalfTheta = Math.sqrt(sqSinHalfTheta);
		const halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta);
		const ratioA = Math.sin(( 1 - t) * halfTheta) / sinHalfTheta,
			ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
		
		this._w = (w * ratioA + this._w * ratioB);
		this._x = (x * ratioA + this._x * ratioB);
		this._y = (y * ratioA + this._y * ratioB);
		this._z = (z * ratioA + this._z * ratioB);

		return this;
	}

	public copyIntoArray(out: WritableArrayLike<number>, offset: number = 0): void {
		const v = this._array;

		out[offset    ] = v[0];
		out[offset + 1] = v[1];
		out[offset + 2] = v[2];
		out[offset + 3] = v[3];
    }
    
    public readFromArray(arr: ArrayLike<number>, offset: number = 0): void {
		const o = this._array;

		o[0] = arr[offset    ];
		o[1] = arr[offset + 1];
		o[2] = arr[offset + 2];
		o[3] = arr[offset + 3];
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