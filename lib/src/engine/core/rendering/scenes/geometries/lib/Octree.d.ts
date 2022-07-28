import { Frustrum } from "../../../../../libs/physics/collisions/Frustrum";
import { BoundingBox } from "../bounding/BoundingBox";
interface OctreeEntity {
    box: BoundingBox;
    containedIn: number[];
}
export declare class Octree {
    region: BoundingBox;
    parent: Octree | null;
    octants: Octree[];
    MIN_SIZE: number;
    MAX_ENTITES: number;
    nonStaticEntities: OctreeEntity[];
    staticEntities: OctreeEntity[];
    expanded: boolean;
    id: number;
    static count: number;
    constructor(region: BoundingBox, parent?: Octree | null, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]);
    entitiesWithinFrustrum(frustrum: Frustrum): IterableIterator<OctreeEntity>;
    init(): void;
    update(): void;
    expand(): void;
    collapse(): void;
}
export {};
