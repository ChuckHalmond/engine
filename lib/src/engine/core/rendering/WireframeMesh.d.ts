import { LineMaterial } from "./LineMaterial";
import { GeometryBuffer } from "./scenes/geometries/GeometryBuffer";
export { WireframeMesh };
interface WireframeMeshProperties {
    geometry: GeometryBuffer;
    material?: LineMaterial;
}
interface WireframeMeshConstructor {
    prototype: WireframeMesh;
    new (properties: WireframeMeshProperties): WireframeMesh;
}
interface WireframeMesh {
    geometry: GeometryBuffer;
    material: LineMaterial;
}
declare var WireframeMesh: WireframeMeshConstructor;
