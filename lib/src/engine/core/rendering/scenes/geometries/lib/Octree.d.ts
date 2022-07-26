import { Object3D } from "../../objects/Object3D";
import { BoundingBox } from "../bounding/BoundingBox";
export declare class Octree {
    region: BoundingBox;
    objects: Object3D[];
    parent: Octree | null;
    octants: Octree[];
    MIN_SIZE: number;
    MAX_ENTITES: number;
    constructor(region: BoundingBox, objects?: Object3D[], parent?: Octree);
    update(): void;
}
