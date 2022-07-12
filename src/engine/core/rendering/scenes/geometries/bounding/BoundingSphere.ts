import { Vector3 } from "../../../../../libs/maths/algebra/vectors/Vector3";

export class BoudningSphere {
    center: Vector3;
    radius: number;

    constructor(
        center: Vector3,
        radius: number
    ) {
        this.center = center;
        this.radius = radius;
    }
}