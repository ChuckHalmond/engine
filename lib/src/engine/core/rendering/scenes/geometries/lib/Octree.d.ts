import { Object3D } from "../../objects/Object3D";
import { BoundingBox } from "../bounding/BoundingBox";
export declare class Octree {
    region: BoundingBox;
    objects: Object3D[];
    parent: Octree | null;
    octants: Array<Octree>;
    MIN_SIZE: number;
    constructor(region: BoundingBox, objects?: Object3D[], parent?: Octree);
    update(): void;
}
