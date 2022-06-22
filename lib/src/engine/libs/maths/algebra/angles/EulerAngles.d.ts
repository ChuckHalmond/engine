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
    new (): EulerAngles;
    new (values: Vector3Values): EulerAngles;
    fromQuaternion(quaternion: Quaternion): EulerAngles;
}
declare var EulerAngles: EulerAnglesConstructor;
