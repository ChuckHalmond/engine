import { LineMaterial } from "./LineMaterial";
import { GeometryBuffer } from "./scenes/geometries/GeometryBuffer";

export { WireframeMesh };

interface WireframeMeshProperties {
    geometry: GeometryBuffer;
    material?: LineMaterial;
}

interface WireframeMeshConstructor {
    prototype: WireframeMesh;
    new(properties: WireframeMeshProperties): WireframeMesh;
}

interface WireframeMesh {
    geometry: GeometryBuffer;
    material: LineMaterial;
}

class WireframeMeshBase implements WireframeMesh {
    geometry: GeometryBuffer;
    material: LineMaterial;

    constructor(properties: WireframeMeshProperties) {
        const DEFAULT_MATERIAL = new LineMaterial();
        this.geometry = properties.geometry;
        this.material = properties.material ?? DEFAULT_MATERIAL;
    }
}

var WireframeMesh: WireframeMeshConstructor = WireframeMeshBase;