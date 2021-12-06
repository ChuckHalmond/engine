import { Matrix3 } from "../matrices/Matrix3";
import { Quaternion } from "../quaternions/Quaternion";
import { Vector3Values } from "../vectors/Vector3";

export { EulerAngles };

interface EulerAngles {
    pitch: number;
    yaw: number;
    roll: number;
    values: Vector3Values;
    toQuaternion(): Quaternion;
    setQuaternion(quaternion: Quaternion): this;
}

interface EulerAnglesConstructor {
    readonly prototype: EulerAngles;
    new(): EulerAngles;
    new(values: Vector3Values): EulerAngles;
    fromQuaternion(quaternion: Quaternion): EulerAngles;
	fromMatrix(mat: Matrix3): EulerAngles;
}

/**
 * https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
 */
class EulerAnglesBase implements EulerAngles {
    public pitch: number;
    public yaw: number;
    public roll: number;

	constructor()
	constructor(values: Vector3Values)
	constructor(values?: Vector3Values) {
        if (values) {
            this.pitch = values[0];
            this.yaw = values[1];
            this.roll = values[2];
        }
        else {
            this.pitch = 0;
            this.yaw = 0;
            this.roll = 0;
        }
	}

	public get values(): Vector3Values {
		return [
			this.pitch,
			this.yaw,
			this.roll
		];
	}

	public set values(values: Vector3Values) {
		this.pitch = values[0];
		this.yaw = values[1];
		this.roll = values[2];
	}

	public toQuaternion(): Quaternion {
		const cosYaw = Math.cos(this.yaw * 0.5);
		const sinYaw = Math.sin(this.yaw * 0.5);
		const cosPitch = Math.cos(this.pitch * 0.5);
		const sinPitch = Math.sin(this.pitch * 0.5);
		const cosRoll = Math.cos(this.roll * 0.5);
		const sinRoll = Math.sin(this.roll * 0.5);

		return new Quaternion([
            cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw,
            cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw,
            sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw,
            cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw
        ]);
	}

	public setQuaternion(quaternion: Quaternion): this {
		const x = quaternion.x;
		const y = quaternion.y;
		const z = quaternion.z;
		const w = quaternion.w;
		
		const sinr_cosp = 2 * (w * x + y * z);
		const cosr_cosp = 1 - 2 * (x * x + y * y);
		this.roll = Math.atan2(sinr_cosp, cosr_cosp);
		
		const sinp = 2 * (w * y - z * x);
		if (Math.abs(sinp) >= 1) {
            this.pitch = Math.sign(sinp) * (Math.PI / 2);
        }
		else {
            this.pitch = Math.asin(sinp);
        }
		
		const siny_cosp = 2 * (w * z + x * y);
		const cosy_cosp = 1 - 2 * (y * y + z * z);
		this.yaw = Math.atan2(siny_cosp, cosy_cosp);
	
		return this;
	}

    public static fromQuaternion(quaternion: Quaternion): EulerAngles {
		return new EulerAnglesBase().setQuaternion(quaternion);
    }

	public static fromMatrix(mat: Matrix3): EulerAngles {
		const m = mat.array;

		const yaw = Math.atan2(m[3], m[0]);
		const pitch = Math.atan2(-m[6], Math.sqrt(m[7] * m[7] + m[8] * m[8]));
		const roll = Math.atan2(m[7], m[8]);

		return new EulerAnglesBase([yaw, pitch, roll]);
	}
}

var EulerAngles: EulerAnglesConstructor = EulerAnglesBase;