import { Geometry } from "./scenes/geometries/Geometry";
export { Mesh };
interface MeshProperties {
    geometry: Geometry;
    material: Object;
}
interface MeshConstructor {
    prototype: Mesh;
    new (properties: MeshProperties): Mesh;
}
interface Mesh {
    geometry: Geometry;
    material: Object;
}
declare var Mesh: MeshConstructor;
