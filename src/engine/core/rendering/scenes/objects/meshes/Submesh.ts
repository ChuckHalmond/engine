import { CompositeMesh } from "./CompositeMesh";
import { Material } from "../../materials/Material";
import { BoundingBox } from "../../../../../libs/physics/collisions/AxisAlignedBoundingBox";

export { Submesh };
export { BaseSubmesh };

interface Submesh {
    composite: CompositeMesh;
    indexStart: number;
    indexCount: number;
    material: Material;
    
    boundingBox?: BoundingBox;
}

class BaseSubmesh {
    composite: CompositeMesh;
    indexStart: number;
    indexCount: number;
    material: Material;
    
    boundingBox?: BoundingBox;

    constructor(
        composite: CompositeMesh,
        indexStart: number,
        indexCount: number,
        material: Material) {
            this.composite = composite;
            this.indexStart = indexStart;
            this.indexCount = indexCount;
            this.material = material;
    }
}