import { Transform, TransformBase } from "../../../general/Transform";

export { Object3D };
export { Object3DBase };

interface Object3D {
    transform: Transform;
}

class Object3DBase implements Object3D {
    readonly transform: Transform;

    constructor() {
        this.transform = new TransformBase(this);
    }
}