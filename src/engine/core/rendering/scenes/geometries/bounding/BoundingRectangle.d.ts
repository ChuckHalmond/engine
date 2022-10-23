import { Vector2 } from "../../../../../libs/maths/algebra/vectors/Vector2";
export { BoundingRectangle };
interface BoundingRectangleConstructor {
    prototype: BoundingRectangle;
    new (min: Vector2, max: Vector2): BoundingRectangle;
}
interface BoundingRectangle {
    readonly min: Vector2;
    readonly max: Vector2;
    hits(other: BoundingRectangle): boolean;
}
declare var BoundingRectangle: BoundingRectangleConstructor;
