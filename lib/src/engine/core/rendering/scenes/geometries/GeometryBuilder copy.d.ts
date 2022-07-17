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
    indicesArray(): Uint8Array | Uint16Array | Uint32Array;
    linesArray(): Float32Array;
    verticesNormalsArray(): Float32Array;
    tangentsArray(): Float32Array;
    boundingBox(): BoundingBox;
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
    target: VertexID | null;
    twin: HalfEdgeID | null;
    prev: HalfEdgeID | null;
    next: HalfEdgeID | null;
    face: FaceID | null;
};
export declare type Face = {
    halfEdge: HalfEdgeID | null;
    [key: string]: any;
};
export declare type Vertex = {
    position: number[] | Float32Array | Float64Array;
    halfEdge: HalfEdgeID | null;
    properties?: {
        [key: string]: any;
    };
};
export declare class FaceHalfEdgesIterator {
    geometry: GeometryBuilder;
    face: FaceID;
    halfEdge: HalfEdgeID | null;
    constructor(geometry: GeometryBuilder, face: FaceID);
    reset(): void;
    current(): HalfEdgeID | null;
    next(): IteratorResult<HalfEdgeID>;
    [Symbol.iterator](): Iterator<HalfEdgeID>;
}
export declare class FaceVerticesIterator {
    geometry: GeometryBuilder;
    face: FaceID;
    halfEdge: HalfEdgeID | null;
    constructor(geometry: GeometryBuilder, face: FaceID);
    reset(): void;
    current(): VertexID | null;
    next(): IteratorResult<VertexID>;
    [Symbol.iterator](): Iterator<VertexID>;
}
export declare class VertexFacesIterator {
    geometry: GeometryBuilder;
    halfEdge: HalfEdgeID | null;
    vertex: VertexID;
    constructor(geometry: GeometryBuilder, vertex: VertexID);
    reset(): void;
    current(): FaceID | null;
    next(): IteratorResult<FaceID>;
    [Symbol.iterator](): Iterator<FaceID>;
}
