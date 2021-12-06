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
declare function isMesh(obj: any): obj is Mesh;
declare class MeshBase extends Object3DBase {
    readonly isMesh: true;
    readonly geometry: Geometry;
    readonly material: Material;
    constructor(geometry: Geometry, material: Material);
}
