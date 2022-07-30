import { BoundingBox } from "../scenes/geometries/bounding/BoundingBox";

export { AABBHelper };

interface AABBHelperConstructor {

}

interface AABBHelper {
    readonly aabb: BoundingBox;
}

class AABBHelperBase implements AABBHelper {
    readonly aabb: BoundingBox;

    constructor(aabb: BoundingBox) {
        this.aabb = aabb;
    }
    /*
    linesArray(): Float32Array {
        const aabb = this.#aabb;
        return new Float32Array();
    }

    linesIndicesArray(): Uint8Array {
        return new Uint8Array();
    }*/
}

var AABBHelper: AABBHelperConstructor = AABBHelperBase;