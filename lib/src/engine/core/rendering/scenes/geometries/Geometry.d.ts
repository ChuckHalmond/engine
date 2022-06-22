import { GeometryBuilder } from "./GeometryBuilder";
export { GeometryPropertyKeys };
export { Geometry };
export { GeometryBase };
declare enum GeometryPropertyKeys {
    vertices = 0,
    indices = 1,
    uvs = 2,
    facesNormals = 3,
    verticesNormals = 4,
    tangents = 5,
    bitangents = 6
}
interface Geometry {
}
declare abstract class GeometryBase implements Geometry {
    constructor();
    abstract toBuilder(): GeometryBuilder;
}
