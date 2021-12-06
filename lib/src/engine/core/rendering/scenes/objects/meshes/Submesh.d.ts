import { CompositeMesh } from "./CompositeMesh";
import { Material } from "../../materials/Material";
import { BoundingBox } from "../../../../../libs/physics/collisions/BoundingBox";
export { Submesh };
export { BaseSubmesh };
interface Submesh {
    composite: CompositeMesh;
    indexStart: number;
    indexCount: number;
    material: Material;
    boundingBox?: BoundingBox;
}
declare class BaseSubmesh {
    composite: CompositeMesh;
    indexStart: number;
    indexCount: number;
    material: Material;
    boundingBox?: BoundingBox;
    constructor(composite: CompositeMesh, indexStart: number, indexCount: number, material: Material);
}
