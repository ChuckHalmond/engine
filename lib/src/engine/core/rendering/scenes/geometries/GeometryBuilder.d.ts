import { BoundingBox } from "./bounding/BoundingBox";
export { GeometryBuilder };
interface GeometryBuilder {
    readonly halfEdges: Array<HalfEdge>;
    readonly vertices: Array<Vertex>;
    readonly faces: Array<Face>;
    clone(): GeometryBuilder;
    addTriangleFace(v0: VertexID, v1: VertexID, v2: VertexID, properties?: {
        [key: string]: any;
    }): void;
    addQuadFace(v0: VertexID, v1: VertexID, v2: VertexID, v3: VertexID, properties?: {
        [key: string]: any;
    }): void;
    addVertex(vertex: number[] | Float32Array | Float64Array): VertexID;
    addFace(vertices: VertexID[], properties?: {
        [key: string]: any;
    }[]): void;
    verticesArray(): Float32Array;
    uvsArray(): Float32Array;
    trianglesIndicesArray(): Uint8Array | Uint16Array | Uint32Array;
    linesIndicesArray(): Uint8Array | Uint16Array | Uint32Array;
    normalsArray(): Float32Array;
    tangentsArray(): Float32Array;
    boundingBox(): BoundingBox;
    faceHalfEdgesIterator(face: FaceID): FaceHalfEdgesIterator;
    faceVerticesIterator(face: FaceID): FaceHalfEdgesIterator;
    vertexFacesIterator(vertex: VertexID): VertexFacesIterator;
}
interface GeometryBuilderConstructor {
    readonly prototype: GeometryBuilder;
    new (): GeometryBuilder;
}
declare var GeometryBuilder: GeometryBuilderConstructor;
export declare type HalfEdgeID = number;
export declare type FaceID = number;
export declare type VertexID = number;
export declare type HalfEdge = {
    targetID: VertexID | null;
    twinID: HalfEdgeID | null;
    prevID: HalfEdgeID | null;
    nextID: HalfEdgeID | null;
    faceID: FaceID | null;
};
export declare type Face = {
    halfEdgeID: HalfEdgeID | null;
    [key: string]: any;
};
export declare type Vertex = {
    position: number[] | Float32Array | Float64Array;
    halfEdgeID: HalfEdgeID | null;
    properties?: {
        [key: string]: any;
    };
};
export declare class FaceHalfEdgesIterator {
    geometry: GeometryBuilder;
    faceID: FaceID;
    halfEdgeID: HalfEdgeID | null;
    constructor(geometry: GeometryBuilder, face: FaceID);
    reset(): void;
    current(): HalfEdgeID | null;
    next(): IteratorResult<HalfEdgeID>;
    [Symbol.iterator](): Iterator<HalfEdgeID>;
}
export declare class FaceVerticesIterator {
    geometry: GeometryBuilder;
    faceID: FaceID;
    halfEdgeID: HalfEdgeID | null;
    constructor(geometry: GeometryBuilder, face: FaceID);
    reset(): void;
    current(): VertexID | null;
    next(): IteratorResult<VertexID>;
    [Symbol.iterator](): Iterator<VertexID>;
}
export declare class VertexFacesIterator {
    geometry: GeometryBuilder;
    halfEdgeID: HalfEdgeID | null;
    vertexID: VertexID;
    constructor(geometry: GeometryBuilder, vertex: VertexID);
    reset(): void;
    current(): FaceID | null;
    next(): IteratorResult<FaceID>;
    [Symbol.iterator](): Iterator<FaceID>;
}
