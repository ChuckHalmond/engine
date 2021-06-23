import { MeshBase, Mesh } from "./Mesh";
import { JointBase, Joint } from "../../rigs/Joint";
import { Geometry } from "../../geometries/Geometry";
import { Material } from "../../materials/Material";

export { SkinnedMesh };
export { SkinnedMeshBase };

interface SkinnedMesh extends Mesh {
    bonesWeights: Uint8Array;
    bonesIndices: Uint16Array;
    hipsJoint: Joint;
}

class SkinnedMeshBase extends MeshBase implements SkinnedMesh {
    bonesWeights: Uint8Array;
    bonesIndices: Uint16Array;
    hipsJoint: Joint;

    constructor(geometry: Geometry, material: Material) {
        super(geometry, material);
        this.bonesIndices = new Uint16Array(0);
        this.bonesWeights = new Uint8Array(0);
        this.hipsJoint = new JointBase();
        this.hipsJoint.transform.parent = this.transform;
    }
}