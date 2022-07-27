import { Frustrum } from "../../../../../libs/physics/collisions/Frustrum";
import { BoundingBox } from "../bounding/BoundingBox";
interface OctreeEntity {
    box: BoundingBox;
}
export declare class Octree {
    region: BoundingBox;
    parent: Octree | null;
    octants: Octree[];
    MIN_SIZE: number;
    MAX_ENTITES: number;
    nonStaticEntities: OctreeEntity[];
    staticEntities: OctreeEntity[];
    constructor(region: BoundingBox, parent?: Octree, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]);
    set(region: BoundingBox, parent?: Octree, nonStaticEntities?: OctreeEntity[], staticEntities?: OctreeEntity[]): void;
    entitiesWithinFrustrum(frustrum: Frustrum): boolean;
    update(): void;
    dispose(): void;
    expand(): void;
    collapse(): void;
}
export {};
