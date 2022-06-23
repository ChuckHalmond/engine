import { Matrix4 } from "../matrices/Matrix4";
import { Quaternion } from "./Quaternion";

export { DualQuaternion };

interface DualQuaternion {
	real: Quaternion;
	dual: Quaternion;
}

interface DualQuaternionConstructor {
	readonly prototype: DualQuaternion;
	new(): DualQuaternion;
    new(real: Quaternion, dual: Quaternion): DualQuaternion;
	fromRotation(rotation: Quaternion): DualQuaternionBase;
}

class DualQuaternionBase implements DualQuaternion {
	real: Quaternion;
	dual: Quaternion;

	static zero(): DualQuaternion {
        return new DualQuaternionBase(
            new Quaternion([0, 0, 0, 0]),
            new Quaternion([0, 0, 0, 0])
        );
	}

    constructor()
    constructor(real: Quaternion, dual: Quaternion) 
    constructor(real?: Quaternion, dual?: Quaternion) {
        this.real = real || new Quaternion();
        this.dual = dual || new Quaternion();
    }

    static fromRotation(rotation: Quaternion): DualQuaternionBase {
		const q1 = new DualQuaternionBase(new Quaternion([0, 0, 0, 1]), new Quaternion([0, 0, 0, 0]));
		const q2 = new DualQuaternionBase(rotation, new Quaternion([0, 0, 0, 0]));
		return q1.mult(q2);
    }

    clone(): this {
        return new DualQuaternionBase(
            this.real.clone(),
            this.dual.clone()
        ) as this;
    }

	add(b: DualQuaternion): this {
		this.real.add(b.real);
		this.dual.add(b.dual);
		return this;
	}

	mult(b: DualQuaternion): this {
		this.real.mult(b.real);
		this.dual.mult(b.real).add(
			b.dual.clone().mult(this.real)
		);
		return this;
	}

	multScalar(scalar: number): this {
		this.real = this.real.scale(scalar);
		this.dual = this.dual.scale(scalar);

		return this;
	}

	normalize(): DualQuaternion {
		const norm = 1 / Math.sqrt(this.real.clone().dot(this.real));
		this.multScalar(norm);
		return this;
	}

	toMatrix(): Matrix4 {
		const quat = this.clone().normalize();
		const mat = new Matrix4();

		const t = quat.dual.mult(quat.real.conjugate().scale(2.0));

		const w = quat.real.w;
		const x = quat.real.x;
		const y = quat.real.y;
		const z = quat.real.z;

		mat.setValues(
			w * w + x * x - y * y - z * z, 2 * x * y + 2 * w * z,         2 * x * z - 2 * w * y,         0,
			2 * x * y - 2 * w * z,         w * w + y * y - x * x - z * z, 2 * y * z + 2 * w * x,         0,
			2 * x * z + 2 * w * y,         2 * y * z - 2 * w * x,         w * w + z * z - x * x - y * y, 0,
			t.x,                           t.y,                           t.z,                           1
		);

		return mat; 
	}
}

var DualQuaternion: DualQuaternionConstructor = DualQuaternionBase;