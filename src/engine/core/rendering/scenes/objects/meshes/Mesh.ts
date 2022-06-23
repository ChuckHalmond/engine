import { Geometry } from "../../geometries/Geometry";
import { Material } from "../../materials/Material";
import { Object3D, Object3DBase } from "../Object3D";

export { Mesh };
export { isMesh };
export { MeshBase };

interface Mesh extends Object3D {
    readonly isMesh: true;
    readonly geometry: Geometry;
    readonly material: Material;
}

function isMesh(obj: any): obj is Mesh {
    return (obj as Mesh).isMesh;
}

class MeshBase extends Object3DBase {
    readonly isMesh: true;
    readonly geometry: Geometry;
    readonly material: Material;

    constructor(geometry: Geometry, material: Material) {
        super();
        this.isMesh = true;
        this.geometry = geometry;
        this.material = material;
    }
}