import { GeometryBuffer } from "../scenes/geometries/GeometryBuffer";

export { Mesh };

interface MeshProperties {
    geometry: GeometryBuffer;
    material: Object;
}

interface MeshConstructor {
    prototype: Mesh;
    new(properties: MeshProperties): Mesh;
}

interface Mesh {
    geometry: GeometryBuffer;
    material: Object;
}

class MeshBase implements Mesh {
    geometry: GeometryBuffer;
    material: Object;

    constructor(properties: MeshProperties) {
        this.geometry = properties.geometry;
        this.material = properties.material;
    }
}

var Mesh: MeshConstructor = MeshBase;