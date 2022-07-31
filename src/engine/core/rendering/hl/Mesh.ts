import { Geometry } from "../scenes/geometries/Geometry";

export { Mesh };

interface MeshProperties {
    geometry: Geometry;
    material: Object;
}

interface MeshConstructor {
    prototype: Mesh;
    new(properties: MeshProperties): Mesh;
}

interface Mesh {
    geometry: Geometry;
    material: Object;
}

class MeshBase implements Mesh {
    geometry: Geometry;
    material: Object;

    constructor(properties: MeshProperties) {
        this.geometry = properties.geometry;
        this.material = properties.material;
    }
}

var Mesh: MeshConstructor = MeshBase;