import { Matrix4 } from "../../../../../libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../../../../libs/maths/algebra/vectors/Vector3";
import { BoundingBox } from "./BoundingBox";

export class BoundingSphere {
    center: Vector3;
    radius: number;

    constructor(
        center: Vector3,
        radius: number
    ) {
        this.center = center;
        this.radius = radius;
    }

    transform(matrix: Matrix4): void {
        const {center} = this;
        matrix.transformPoint(center);
    }
    
    containsPoint(point: Vector3): boolean {
        const {center, radius} = this;
        return center.distance(point) < radius;
    }

    hitsSphere(other: BoundingSphere) {
        const {center, radius} = this;
        const {center: otherCenter, radius: otherRadius} = other;
        return center.distance(otherCenter) < radius + otherRadius;
    }

    hitsBox(other: BoundingBox) {
        const {center, radius} = this;
        const {x: sphereX, y: sphereY, z: sphereZ} = center;
        const {min, max} = other;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        // get box closest point to sphere center by clamping
        const x = Math.max(minX, Math.min(sphereX, maxX));
        const y = Math.max(minY, Math.min(sphereY, maxY));
        const z = Math.max(minZ, Math.min(sphereZ, maxZ));

        // this is the same as isPointInsideSphere
        const distance = Math.sqrt((x - sphereX) * (x - sphereX) + (y - sphereY) * (y - sphereY) + (z - sphereZ) * (z - sphereZ));
        return distance < radius;
    }
}