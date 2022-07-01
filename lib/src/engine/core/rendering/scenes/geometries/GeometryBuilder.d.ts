export { GeometryBuilder };
interface GeometryBuilder {
    halfEdges: Array<HalfEdge>;
    vertices: Array<Vertex>;
    faces: Array<Face>;
    addTriangleFace(v0: Vertex, v1: Vertex, v2: Vertex, properties?: {
        [key: string]: any;
    }): void;
    addQuadFace(v0: Vertex, v1: Vertex, v2: Vertex, v3: Vertex, properties?: {
        [key: string]: any;
    }): void;
    addVertex(vertex: number[] | Float32Array | Float64Array): Vertex;
    addFace(vertices: Vertex[], properties?: {
        [key: string]: any;
    }[]): void;
    verticesArray(): Float32Array;
    uvsArray(): Float32Array;
    indicesArray(): Uint8Array | Uint16Array | Uint32Array;
    linesArray(): Float32Array;
    verticesNormalsArray(): Float32Array;
    tangentsArray(): Float32Array;
}
interface GeometryBuilderConstructor {
    readonly prototype: GeometryBuilder;
    new (): GeometryBuilder;
}
declare var GeometryBuilder: GeometryBuilderConstructor;
export declare type HalfEdge = {
    target: Vertex | null;
    twin: HalfEdge | null;
    prev: HalfEdge | null;
    next: HalfEdge | null;
    face: Face | null;
};
export declare type Face = {
    halfEdge: HalfEdge | null;
    [key: string]: any;
};
export declare type Vertex = {
    position: number[] | Float32Array | Float64Array;
    halfEdge: HalfEdge | null;
    properties?: {
        [key: string]: any;
    };
};
export declare class FaceHalfEdgesIterator {
    #private;
    constructor(face: Face);
    reset(): void;
    current(): HalfEdge | null;
    next(): IteratorResult<HalfEdge>;
    [Symbol.iterator](): Iterator<HalfEdge>;
}
export declare class FaceVerticesIterator {
    #private;
    constructor(face: Face);
    reset(): void;
    current(): Vertex | null;
    next(): IteratorResult<Vertex>;
    [Symbol.iterator](): Iterator<Vertex>;
}
export declare class VertexFacesIterator {
    #private;
    constructor(vertex: Vertex);
    reset(): void;
    current(): Face | null;
    next(): IteratorResult<Face>;
    [Symbol.iterator](): Iterator<Face>;
}
