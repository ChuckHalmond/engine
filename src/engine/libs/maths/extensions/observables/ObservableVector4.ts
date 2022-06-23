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
	readonly changes: Vector4Changes;
	internal: Vector4;

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
	
	get array(): WritableArrayLike<number> {
		return this.internal.array;
	}

	get values(): Vector4Values {
		return this.internal.values;
	}

	set values(values: Vector4Values) {
		this.internal.values = values;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	get x() {
		return this.internal.x;
	}

	set x(x: number) {
		this.internal.x = x;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	get y(): number {
		return this.internal.y;
	}

	set y(y: number) {
		this.internal.y = y;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	get z(): number {
		return this.internal.z;
	}

	set z(z: number) {
		this.internal.z = z;
		if (this.changes.enabled) {
			this.changes.publish();
		}
    }
    
	get w(): number {
		return this.internal.w;
	}

	set w(w: number) {
		this.internal.w = w;
		if (this.changes.enabled) {
			this.changes.publish();
		}
	}

	setArray(array: WritableArrayLike<number>): this {
		this.internal.setArray(array);
		return this;
	}

	setValues(v: Vector4Values): this {
		this.internal.setValues(v);
		return this;
	}

	copy(vec: Vector4): this {
		this.internal.copy(vec);
		return this;
	}

	clone(): this {
		return new ObservableVector4(this.internal.clone()) as this;
	}

	equals(vec: Vector4): boolean {
		return this.internal.equals(vec);
	}

	setZeros(): this {
		return this.internal.setZeros() as this;
	}

	setUnit(): this {
		return this.internal.setUnit() as this;
	}

	add(vec: Vector4): this {
		return this.internal.add(vec) as this;
	}

	addScalar(k: number): this {
		return this.internal.addScalar(k) as this;
	}

	sub(vec: Vector4): this {
		return this.internal.sub(vec) as this;
	}

	lerp(vec: Vector4, t: number): this {
		return this.internal.lerp(vec, t) as this;
	}

	clamp(min: Vector4, max: Vector4): this {
		return this.internal.clamp(min, max) as this;
	}

	multScalar(k: number): this {
		return this.internal.multScalar(k) as this;
	}

	dot(vec: Vector4): number {
		return this.internal.dot(vec);
	}

	length(): number {
		return this.internal.length();
	}

	lengthSquared(): number {
		return this.internal.lengthSquared();
	}

	dist(vec: Vector4): number {
		return this.internal.dist(vec);
	}

	distSquared(vec: Vector4): number {
		return this.internal.distSquared(vec);
	}

	normalize(): this {
		return this.internal.normalize() as this;
	}

	negate(): this {
		return this.internal.negate() as this;
	}

	mult(vec: Vector4): this {
		return this.internal.mult(vec) as this;
	}

	addScaled(vec: Vector4, k: number): this {
		return this.internal.addScaled(vec, k) as this;
	}

	writeIntoArray(out: TypedArray | number[], offset: number = 0): void {
		return this.internal.writeIntoArray(out, offset);
    }
    
    readFromArray(arr: ArrayLike<number>, offset: number = 0): this {
		return this.internal.readFromArray(arr, offset) as this;
    }
}

const ObservableVector4: ObservableVector4Constructor = ObservableVector4Base;*/