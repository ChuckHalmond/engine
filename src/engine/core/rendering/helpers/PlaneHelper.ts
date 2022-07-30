import { Plane } from "../../../libs/maths/geometry/primitives/Plane";

export { PlaneHelper };

interface PlaneHelperConstructor {

}

interface PlaneHelper {
    readonly plane: Plane;
}

class PlaneHelperBase implements PlaneHelper {
    readonly plane: Plane;

    constructor(plane: Plane) {
        this.plane = plane;
    }
    /*
    linesArray(): Float32Array {
        const plane = this.#plane;
        return new Float32Array();
    }

    linesIndicesArray(): Uint8Array {
        return new Uint8Array();
    }*/
}

var PlaneHelper: PlaneHelperConstructor = PlaneHelperBase;