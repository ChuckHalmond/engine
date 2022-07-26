import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { Object3D } from "../../objects/Object3D";
import { BoundingBox } from "../bounding/BoundingBox";

export class Octree {
    region: BoundingBox;
    objects: Object3D[];
    
    parent: Octree | null;
    octants: Octree[];

    MIN_SIZE = 1;

    constructor(region: BoundingBox, objects?: Object3D[], parent?: Octree) {
        this.region = region;
        this.objects = objects ?? [];
        this.parent = parent ?? null;
        const {min, max} = region;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        const center = new Vector3(
            (minX + maxX) / 2,
            (minY + maxY) / 2,
            (minZ + maxZ) / 2,
        );
        const {x: centerX, y: centerY, z: centerZ} = center;
        this.octants = [
            new Octree(new BoundingBox(min, center)),
            new Octree(new BoundingBox(new Vector3(centerX, minY, minZ), new Vector3(maxX, centerY, centerZ))),
            new Octree(new BoundingBox(new Vector3(centerX, minY, centerZ), new Vector3(maxX, centerY, maxZ))),
            new Octree(new BoundingBox(new Vector3(minX, minY, centerZ), new Vector3(centerX, centerY, maxZ))),
            new Octree(new BoundingBox(new Vector3(minX, centerY, minZ), new Vector3(centerX, maxY, centerZ))),
            new Octree(new BoundingBox(new Vector3(centerX, centerY, minZ), new Vector3(maxX, maxY, centerZ))),
            new Octree(new BoundingBox(center, max)),
            new Octree(new BoundingBox(new Vector3(minX, centerY, centerZ), new Vector3(centerX, maxY, maxZ)))
        ];
    }

    update() {
        
    }
}