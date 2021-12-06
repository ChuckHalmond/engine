import { Object3DBase, Object3D } from "../objects/Object3D";
export { Joint };
export { JointBase };
interface Joint extends Object3D {
}
declare class JointBase extends Object3DBase implements Joint {
    constructor();
}
