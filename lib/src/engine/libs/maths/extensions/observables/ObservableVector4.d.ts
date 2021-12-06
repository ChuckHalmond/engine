import { SingleTopicMessageBroker } from "../../../patterns/messaging/brokers/SingleTopicMessageBroker";
import { Vector4, Vector4Values } from "../../algebra/vectors/Vector4";
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
    new (internal: Vector4): ObservableVector4;
    new (internal: Vector4, broker: SingleTopicMessageBroker<void>): ObservableVector4;
}
declare class ObservableVector4Base implements Vector4 {
    readonly changes: Vector4Changes;
    internal: Vector4;
    constructor(internal: Vector4);
    constructor(internal: Vector4, broker: SingleTopicMessageBroker<void>);
    get array(): ArrayLike<number>;
    get values(): Vector4Values;
    set values(values: Vector4Values);
    get x(): number;
    set x(x: number);
    get y(): number;
    set y(y: number);
    get z(): number;
    set z(z: number);
    get w(): number;
    set w(w: number);
    setArray(array: WritableArrayLike<number>): this;
    setValues(v: Vector4Values): this;
    copy(vec: Vector4): this;
    clone(): this;
    equals(vec: Vector4): boolean;
    setZeros(): this;
    add(vec: Vector4): this;
    addScalar(k: number): this;
    sub(vec: Vector4): this;
    lerp(vec: Vector4, t: number): this;
    clamp(min: Vector4, max: Vector4): this;
    multScalar(k: number): this;
    dot(vec: Vector4): number;
    len(): number;
    lenSq(): number;
    dist(vec: Vector4): number;
    distSq(vec: Vector4): number;
    normalize(): this;
    negate(): this;
    mult(vec: Vector4): this;
    addScaled(vec: Vector4, k: number): this;
    writeIntoArray(out: TypedArray | number[], offset?: number): void;
    readFromArray(arr: ArrayLike<number>, offset?: number): this;
}
declare const ObservableVector4: ObservableVector4Constructor;
