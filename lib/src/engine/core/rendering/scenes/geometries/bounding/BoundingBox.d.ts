import { Matrix4 } from "../../../../../libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../../../../libs/maths/algebra/vectors/Vector3";
export { BoundingBox };
interface BoundingBoxConstructor {
    prototype: BoundingBox;
    new (min: Vector3, max: Vector3): BoundingBox;
}
interface BoundingBox {
    readonly min: Vector3;
    readonly max: Vector3;
    hits(other: BoundingBox): boolean;
    transform(matrix: Matrix4): void;
}
declare var BoundingBox: BoundingBoxConstructor;
