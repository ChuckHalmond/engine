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
	//fromMatrix(mat: Matrix3): EulerAngles;
}

/**
 * https://en.wikipedia.org/wiki/Conversion_between_quaternions_and_Euler_angles
 */
class EulerAnglesBase implements EulerAngles {
	yaw: number;
    pitch: number;
    roll: number;

	constructor()
	constructor(values: Vector3Values)
	constructor(values?: Vector3Values) {
        if (values) {
			this.yaw = values[0];
            this.pitch = values[1];
            this.roll = values[2];
        }
        else {
			this.yaw = 0;
            this.pitch = 0;
            this.roll = 0;
        }
	}

	toString(): string {
		return `EulerAngles([${this.yaw}, ${this.pitch}, ${this.roll}])`;
	}

	get values(): Vector3Values {
		return [
			this.yaw,
			this.pitch,
			this.roll
		];
	}

	set values(values: Vector3Values) {
		this.yaw = values[0];
		this.pitch = values[1];
		this.roll = values[2];
	}

	toQuaternion(): Quaternion {
		const cosYaw = Math.cos(this.yaw * 0.5);
		const sinYaw = Math.sin(this.yaw * 0.5);
		const cosPitch = Math.cos(this.pitch * 0.5);
		const sinPitch = Math.sin(this.pitch * 0.5);
		const cosRoll = Math.cos(this.roll * 0.5);
		const sinRoll = Math.sin(this.roll * 0.5);

		return new Quaternion([
            sinRoll * cosPitch * cosYaw - cosRoll * sinPitch * sinYaw,
            cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw,
            cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw,
			cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw
        ]);
	}

	setQuaternion(quaternion: Quaternion): this {
		const x = quaternion.x;
		const y = quaternion.y;
		const z = quaternion.z;
		const w = quaternion.w;
		
		const sinRollCosPitch = 2 * (w * x + y * z);
		const cosRollCosPitch = 1 - 2 * (x * x + y * y);
		this.roll = Math.atan2(sinRollCosPitch, cosRollCosPitch);
		
		const sinPitch = 2 * (w * y - z * x);
		if (Math.abs(sinPitch) >= 1) {
            this.pitch = Math.sign(sinPitch) * (Math.PI / 2);
        }
		else {
            this.pitch = Math.asin(sinPitch);
        }
		
		const sinYawCosPitch = 2 * (w * z + x * y);
		const cosYawCosPitch = 1 - 2 * (y * y + z * z);
		this.yaw = Math.atan2(sinYawCosPitch, cosYawCosPitch);
	
		return this;
	}

    static fromQuaternion(quaternion: Quaternion): EulerAngles {
		return new EulerAnglesBase().setQuaternion(quaternion);
    }

	/*static fromMatrix(matrix: Matrix3): EulerAngles {
		const yaw = Math.atan2(matrix.m21, matrix.m11);
		const pitch = Math.atan2(-matrix.m31, Math.hypot(matrix.m32, matrix.m33));
		const roll = Math.atan2(matrix.m32, matrix.m33);

		return new EulerAnglesBase([yaw, pitch, roll]);
	}*/
}

var EulerAngles: EulerAnglesConstructor = EulerAnglesBase;