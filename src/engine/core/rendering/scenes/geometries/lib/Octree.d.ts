import { Frustum } from "../../../../../libs/physics/collisions/Frustum";
import { BoundingBox } from "../bounding/BoundingBox";
interface OctreeEntity {
    box: BoundingBox;
}
export declare class Octree {
    region: BoundingBox;
    parent: Octree | null;
    octants: Octree[];
    MAX_DEPTH: number;
    MAX_ENTITES: number;
    nonStaticEntities: OctreeEntity[];
    staticEntities: OctreeEntity[];
    expanded: boolean;
    id: number;
    static count: number;
    constructor(region: BoundingBox, parent?: Octree | null, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]);
    get depth(): number;
    innerOctants(): Octree[];
    entitiesWithinFrustum(frustum: Frustum): IterableIterator<OctreeEntity>;
    init(): void;
    update(): void;
    expand(): void;
    collapse(): void;
}
export {};
