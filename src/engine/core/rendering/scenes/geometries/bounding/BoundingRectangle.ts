import { Vector2 } from "../../../../../libs/maths/algebra/vectors/Vector2";

export { BoundingRectangle };

interface BoundingRectangleConstructor {
    prototype: BoundingRectangle;
    new(
        min: Vector2,
        max: Vector2
    ): BoundingRectangle;
}

interface BoundingRectangle {
    readonly min: Vector2;
    readonly max: Vector2;
    hits(other: BoundingRectangle): boolean;
}

class BoundingRectangleBase implements BoundingRectangle {
    readonly min: Vector2;
    readonly max: Vector2;

    constructor(
        min: Vector2,
        max: Vector2
    ) {
        this.min = min;
        this.max = max;
    }

    hits(other: BoundingRectangle): boolean {
        const {min, max} = this;
        const {x: minX, y: minY} = min;
        const {x: maxX, y: maxY} = max;
        const {min: otherMin, max: otherMax} = other;
        const {x: otherMinX, y: otherMinY} = otherMin;
        const {x: otherMaxX, y: otherMaxY} = otherMax;
        return (minX <= otherMaxX && maxX >= otherMinX) &&
            (minY <= otherMaxY && maxY >= otherMinY);
    }
}

var BoundingRectangle: BoundingRectangleConstructor = BoundingRectangleBase;