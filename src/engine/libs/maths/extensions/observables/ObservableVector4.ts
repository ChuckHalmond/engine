import { SingleTopicMessageBroker } from "../../../patterns/messaging/brokers/SingleTopicMessageBroker";
import { Vector4, Vector4Values } from "../../algebra/vectors/Vector4";
/*
export { ObservableVector4 };
export { ObservableVector4Base };

interface Vector4Changes extends SingleTopicMessageBroker<void> {
	enabled: boolean;
}

interface ObservableVector4 extends Vector4 {
	readonly changes: Vector4Changes;
	internal: Vector4;
}

interface ObservableVector4Constructor {
	readonly prototype: ObservableVector4;
	new(internal: Vector4): ObservableVector4;
	new(internal: Vector4, broker: SingleTopicMessageBroker<void>): ObservableVector4;
}

class ObservableVector4Base implements Vector4 {
	public readonly changes: Vector4Changes;
	public internal: Vector4;

	constructor(internal: Vector4)
	constructor(internal: Vector4, broker: SingleTopicMessageBroker<void>)
	constructor(internal: Vector4, broker?: SingleTopicMessageBroker<void>) {
		this.internal = internal;
		this.changes = Object.assign(
			broker || new SingleTopicMessageBroker(),
			{
				enabled: false
			}
		);
	}
	
	public get array(): WritableArrayLike<number> {
		return this.internal.array;
	}

	public get values(): Vector4Values {
		return this.internal.values;
	}

	public set values(values: Vector4Values) {
		this.internal.values = values;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	public get x() {
		return this.internal.x;
	}

	public set x(x: number) {
		this.internal.x = x;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	public get y(): number {
		return this.internal.y;
	}

	public set y(y: number) {
		this.internal.y = y;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	public get z(): number {
		return this.internal.z;
	}

	public set z(z: number) {
		this.internal.z = z;
		if (this.changes.enabled) {
			this.changes.publish();
		}
    }
    
	public get w(): number {
		return this.internal.w;
	}

	public set w(w: number) {
		this.internal.w = w;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	public setArray(array: WritableArrayLike<number>): this {
		this.internal.setArray(array);
		return this;
	}

	public setValues(v: Vector4Values): this {
		this.internal.setValues(v);
		return this;
	}

	public copy(vec: Vector4): this {
		this.internal.copy(vec);
		return this;
	}

	public clone(): this {
		return new ObservableVector4(this.internal.clone()) as this;
	}

	public equals(vec: Vector4): boolean {
		return this.internal.equals(vec);
	}

	public setZeros(): this {
		return this.internal.setZeros() as this;
	}

	public setUnit(): this {
		return this.internal.setUnit() as this;
	}

	public add(vec: Vector4): this {
		return this.internal.add(vec) as this;
	}

	public addScalar(k: number): this {
		return this.internal.addScalar(k) as this;
	}

	public sub(vec: Vector4): this {
		return this.internal.sub(vec) as this;
	}

	public lerp(vec: Vector4, t: number): this {
		return this.internal.lerp(vec, t) as this;
	}

	public clamp(min: Vector4, max: Vector4): this {
		return this.internal.clamp(min, max) as this;
	}

	public multScalar(k: number): this {
		return this.internal.multScalar(k) as this;
	}

	public dot(vec: Vector4): number {
		return this.internal.dot(vec);
	}

	public length(): number {
		return this.internal.length();
	}

	public lengthSquared(): number {
		return this.internal.lengthSquared();
	}

	public dist(vec: Vector4): number {
		return this.internal.dist(vec);
	}

	public distSquared(vec: Vector4): number {
		return this.internal.distSquared(vec);
	}

	public normalize(): this {
		return this.internal.normalize() as this;
	}

	public negate(): this {
		return this.internal.negate() as this;
	}

	public mult(vec: Vector4): this {
		return this.internal.mult(vec) as this;
	}

	public addScaled(vec: Vector4, k: number): this {
		return this.internal.addScaled(vec, k) as this;
	}

	public writeIntoArray(out: TypedArray | number[], offset: number = 0): void {
		return this.internal.writeIntoArray(out, offset);
    }
    
    public readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		return this.internal.readFromArray(arr, offset) as this;
    }
}

const ObservableVector4: ObservableVector4Constructor = ObservableVector4Base;*/