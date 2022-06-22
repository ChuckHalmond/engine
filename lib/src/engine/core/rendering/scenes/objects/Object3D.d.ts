import { Transform } from "../../../general/Transform";
export { Object3D };
export { Object3DBase };
interface Object3D {
    transform: Transform;
}
declare class Object3DBase implements Object3D {
    readonly transform: Transform;
    constructor();
}
