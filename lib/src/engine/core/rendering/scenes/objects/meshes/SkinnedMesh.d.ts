import { MeshBase, Mesh } from "./Mesh";
import { Joint } from "../../rigs/Joint";
import { Geometry } from "../../geometries/Geometry";
import { Material } from "../../materials/Material";
export { SkinnedMesh };
export { SkinnedMeshBase };
interface SkinnedMesh extends Mesh {
    bonesWeights: Uint8Array;
    bonesIndices: Uint16Array;
    hipsJoint: Joint;
}
declare class SkinnedMeshBase extends MeshBase implements SkinnedMesh {
    bonesWeights: Uint8Array;
    bonesIndices: Uint16Array;
    hipsJoint: Joint;
    constructor(geometry: Geometry, material: Material);
}
