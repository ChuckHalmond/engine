import { PhongGeometry } from "../../geometries/PhongGeometry";
import { PhongMaterial } from "../../materials/lib/PhongMaterial";
import { MeshBase, Mesh } from "./Mesh";

export { PhongMesh };
export { PhongMeshBase };

interface PhongMesh extends Mesh {
    readonly geometry: PhongGeometry;
    readonly material: PhongMaterial;
}

class PhongMeshBase extends MeshBase implements PhongMesh {
    declare readonly geometry: PhongGeometry;
    declare readonly material: PhongMaterial;

    constructor(geometry: PhongGeometry, material: PhongMaterial) {
        super(geometry, material);
    }
}