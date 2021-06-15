import { Transform, TransformBase } from "engine/core/general/Transform";

export { Object3D };
export { isObject3D };
export { Object3DBase };

interface Object3D {
    isObject3D: true;
    transform: Transform;
}

function isObject3D(obj: any): obj is Object3D {
    return (obj as Object3D).isObject3D;
}

class Object3DBase implements Object3D {
    public readonly isObject3D: true;
    public readonly transform: Transform;

    constructor() {
        this.isObject3D = true;
        this.transform = new TransformBase(this);
    }
}