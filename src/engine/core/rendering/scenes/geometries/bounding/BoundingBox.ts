import { Matrix4 } from "../../../../../libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../../../../libs/maths/algebra/vectors/Vector3";
import { Frustrum } from "../../../../../libs/physics/collisions/Frustrum";

export { BoundingBox };

const corners = new Array(8).fill(0).map(_ => new Vector3());

interface BoundingBoxConstructor {
    prototype: BoundingBox;
    new(
        min: Vector3,
        max: Vector3
    ): BoundingBox;
}

interface BoundingBox {
    readonly min: Vector3;
    readonly max: Vector3;
    hits(other: BoundingBox): boolean;
    transform(matrix: Matrix4): BoundingBox;
    transformed(matrix: Matrix4): BoundingBox;
}

class BoundingBoxBase {
    readonly min: Vector3;
    readonly max: Vector3;

    constructor(
        min: Vector3,
        max: Vector3
    ) {
        this.min = min;
        this.max = max;
    }

    static fromBoxes(...boxes: BoundingBox[]) {
        const positiveInfinity = Number.POSITIVE_INFINITY;
        const negativeInfinity = Number.NEGATIVE_INFINITY;
        let minX = positiveInfinity;
        let minY = positiveInfinity;
        let minZ = positiveInfinity;
        let maxX = negativeInfinity;
        let maxY = negativeInfinity;
        let maxZ = negativeInfinity;
        boxes.forEach((box_i) => {
            const {min: boxMin, max: boxMax} = box_i;
            const {x: boxMinX, y: boxMinY, z: boxMinZ} = boxMin;
            const {x: boxMaxX, y: boxMaxY, z: boxMaxZ} = boxMax;
            if (boxMinX < minX) minX = boxMinX;
            else if (boxMaxX > maxX) maxX = boxMaxX;
            if (boxMinY < minY) minY = boxMinY;
            else if (boxMaxY > maxY) maxY = boxMaxY;
            if (boxMinZ < minZ) minZ = boxMinZ;
            else if (boxMaxZ > maxZ) maxZ = boxMaxZ;
        });
        return new BoundingBox(
            new Vector3(minX, minY, minZ),
            new Vector3(maxX, maxY, maxZ)
        );
    }

    hits(other: BoundingBox): boolean {
        const {min, max} = this;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        const {min: otherMin, max: otherMax} = other;
        const {x: otherMinX, y: otherMinY, z: otherMinZ} = otherMin;
        const {x: otherMaxX, y: otherMaxY, z: otherMaxZ} = otherMax;
        return (minX <= otherMaxX && maxX >= otherMinX) &&
            (minY <= otherMaxY && maxY >= otherMinY) &&
            (minZ <= otherMaxZ && maxZ >= otherMinZ);
    }

    transform(matrix: Matrix4): BoundingBox {
        const {min, max} = this;
        let {x: minX, y: minY, z: minZ} = min;
        let {x: maxX, y: maxY, z: maxZ} = max;
        corners[0].setValues(minX, minY, minZ);
        corners[1].setValues(minX, minY, maxZ);
        corners[2].setValues(minX, maxY, minZ);
        corners[3].setValues(maxX, minY, minZ);
        corners[4].setValues(minX, maxY, maxZ);
        corners[5].setValues(maxX, minY, maxZ);
        corners[6].setValues(maxX, maxY, minZ);
        corners[7].setValues(maxX, maxY, maxZ);
        const {POSITIVE_INFINITY, NEGATIVE_INFINITY} = Number;
        minX = minY = minZ = POSITIVE_INFINITY;
        maxX = maxY = maxZ = NEGATIVE_INFINITY;
        corners.forEach((corner_i) => {
            matrix.transformPoint(corner_i);
            const [x, y, z] = corner_i;
            if (x < minX) minX = x;
            else if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            else if (y > maxY) maxY = y;
            if (z < minZ) minZ = z;
            else if (z > maxZ) maxZ = z;
        });
        min.setValues(minX, minY, minZ);
        max.setValues(maxX, maxY, maxZ);
        return this;
    }

    transformed(matrix: Matrix4): BoundingBox {
        const {min, max} = this;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        return new BoundingBox(
            new Vector3(minX, minY, minZ),
            new Vector3(maxX, maxY, maxZ)
        ).transform(matrix);
    }
}

var BoundingBox: BoundingBoxConstructor = BoundingBoxBase;