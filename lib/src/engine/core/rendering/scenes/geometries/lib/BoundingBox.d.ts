import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
export declare class BoundingBox {
    readonly min: Vector3;
    readonly max: Vector3;
    constructor(min: Vector3, max: Vector3);
    collide(other: BoundingBox): boolean;
}
