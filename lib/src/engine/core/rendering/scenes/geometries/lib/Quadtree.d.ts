import { Object3D } from "../../objects/Object3D";
import { BoundingRectangle } from "../bounding/BoundingRectangle";
export declare class Quadtree {
    region: BoundingRectangle;
    objects: Object3D[];
    parent: Quadtree | null;
    quadrants: Quadtree[];
    MIN_SIZE: number;
    MAX_ENTITES: number;
    constructor(region: BoundingRectangle, objects?: Object3D[], parent?: Quadtree);
    update(): void;
    expand(): void;
    collapse(): void;
}
