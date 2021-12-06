import { Transform } from "../../../general/Transform";
export { Object3D };
export { isObject3D };
export { Object3DBase };
interface Object3D {
    isObject3D: true;
    transform: Transform;
}
declare function isObject3D(obj: any): obj is Object3D;
declare class Object3DBase implements Object3D {
    readonly isObject3D: true;
    readonly transform: Transform;
    constructor();
}
