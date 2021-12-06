import { Matrix4 } from "../matrices/Matrix4";
import { Quaternion } from "./Quaternion";
export { DualQuaternion };
interface DualQuaternion {
    real: Quaternion;
    dual: Quaternion;
}
interface DualQuaternionConstructor {
    readonly prototype: DualQuaternion;
    new (): DualQuaternion;
    new (real: Quaternion, dual: Quaternion): DualQuaternion;
    fromRotation(rotation: Quaternion): DualQuaternionBase;
}
declare class DualQuaternionBase implements DualQuaternion {
    real: Quaternion;
    dual: Quaternion;
    static zero(): DualQuaternion;
    constructor();
    constructor(real: Quaternion, dual: Quaternion);
    static fromRotation(rotation: Quaternion): DualQuaternionBase;
    clone(): this;
    add(b: DualQuaternion): this;
    mult(b: DualQuaternion): this;
    multScalar(scalar: number): this;
    normalize(): DualQuaternion;
    toMatrix(): Matrix4;
}
declare var DualQuaternion: DualQuaternionConstructor;
