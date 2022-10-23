import { GeometryBuffer } from "../scenes/geometries/GeometryBuffer";
export { Mesh };
interface MeshProperties {
    geometry: GeometryBuffer;
    material: Object;
}
interface MeshConstructor {
    prototype: Mesh;
    new (properties: MeshProperties): Mesh;
}
interface Mesh {
    geometry: GeometryBuffer;
    material: Object;
}
declare var Mesh: MeshConstructor;
