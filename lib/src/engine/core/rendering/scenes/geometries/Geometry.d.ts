import { TriangleList } from "../../../../libs/maths/extensions/lists/TriangleList";
import { Vector2List } from "../../../../libs/maths/extensions/lists/Vector2List";
import { Vector3List } from "../../../../libs/maths/extensions/lists/Vector3List";
import { UUID } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { BoundingBox } from "../../../../libs/physics/collisions/BoundingBox";
import { BoundingSphere } from "../../../../libs/physics/collisions/BoundingSphere";
export { GeometryPropertyKeys };
export { Geometry };
export { isGeometry };
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
    readonly isGeometry: true;
    readonly uuid: UUID;
    indices: TypedArray;
    vertices: Vector3List;
    faces: TriangleList;
    uvs: Vector2List;
    facesNormals: Vector3List;
    verticesNormals: Vector3List;
    tangents: Vector3List;
    bitangents: Vector3List;
    [attrib: string]: any;
    readonly boundingBox?: BoundingBox;
    readonly boundingSphere?: BoundingSphere;
    computeBoundingBox(): BoundingBox;
    computeBoundingSphere(): BoundingSphere;
}
declare function isGeometry(obj: any): obj is Geometry;
declare class GeometryBase implements Geometry {
    readonly uuid: UUID;
    readonly isGeometry: true;
    private _boundingBox?;
    private _boundingSphere?;
    private _indicesArray;
    private _verticesArray;
    private _vertices;
    private _faces;
    private _uvsArray;
    private _uvs;
    private _facesNormalsArray;
    private _facesNormals;
    private _verticesNormalsArray;
    private _verticesNormals;
    private _tangentsArray;
    private _tangents;
    private _bitangentsArray;
    private _bitangents;
    private _weightedVerticesNormals;
    constructor(desc: {
        vertices: TypedArray;
        indices: TypedArray;
        uvs: TypedArray;
        weightedVerticesNormals?: boolean;
    });
    get indices(): TypedArray;
    get vertices(): Vector3List;
    get uvs(): Vector2List;
    get faces(): TriangleList;
    get facesNormals(): Vector3List;
    get verticesNormals(): Vector3List;
    get tangents(): Vector3List;
    get bitangents(): Vector3List;
    get boundingBox(): BoundingBox | undefined;
    get boundingSphere(): BoundingSphere | undefined;
    computeBoundingBox(): BoundingBox;
    computeBoundingSphere(): BoundingSphere;
}
