import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";
import { Geometry } from "./geometry";

export { PhongGeometry };

interface PhongGeometry extends Geometry {
    readonly facesNormals: Vector3List;
    readonly verticesNormals: Vector3List;
    readonly tangents: Vector3List;
    readonly bitangents: Vector3List;
}