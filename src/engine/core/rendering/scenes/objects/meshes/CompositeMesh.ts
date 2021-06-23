import { Submesh } from "./Submesh";
import { Object3DBase, Object3D } from "../Object3D";
import { Geometry } from "../../geometries/geometry";

export { CompositeMesh };
export { CompositeMeshBase };

interface CompositeMesh extends Object3D {
    geometry: Geometry;
    submeshes: Submesh[];
}

class CompositeMeshBase extends Object3DBase implements CompositeMesh {
    geometry: Geometry;
    submeshes: Submesh[];

    constructor(geometry: Geometry, ...submeshes: Submesh[]) {
        super();
        this.geometry = geometry;
        this.submeshes = submeshes;
    }
}