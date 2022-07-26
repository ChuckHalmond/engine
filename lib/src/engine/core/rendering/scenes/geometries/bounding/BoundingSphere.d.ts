import { Matrix4 } from "../../../../../libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../../../../libs/maths/algebra/vectors/Vector3";
import { BoundingBox } from "./BoundingBox";
export declare class BoundingSphere {
    center: Vector3;
    radius: number;
    constructor(center: Vector3, radius: number);
    transform(matrix: Matrix4): void;
    containsPoint(point: Vector3): boolean;
    hitsSphere(other: BoundingSphere): boolean;
    hitsBox(other: BoundingBox): boolean;
}
