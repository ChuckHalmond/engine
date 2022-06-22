import { Geometry } from "./Geometry";
export { GeometryBuilder };
export { GeometryBuilderBase };
interface GeometryBuilder<G extends PartialGeometry = PartialGeometry> {
    halfEdges: Array<HalfEdge>;
    vertices: Array<Vertex>;
    faces: Array<Face>;
    verticesArray(): Float32Array;
    uvsArray(): Float32Array;
    indicesArray(): Uint8Array | Uint16Array | Uint32Array;
    linesArray(): Float32Array;
    verticesNormalsArray(): Float32Array;
    tangentsArray(): Float32Array;
    addQuadFaceVertices(v0: number[] | Float32Array | Float64Array, v1: number[] | Float32Array | Float64Array, v2: number[] | Float32Array | Float64Array, v3: number[] | Float32Array | Float64Array, properties?: {
        [key: string]: any;
    }): void;
    addTriangleFaceVertices(v0: number[] | Float32Array | Float64Array, v1: number[] | Float32Array | Float64Array, v2: number[] | Float32Array | Float64Array, properties?: {
        [key: string]: any;
    }): void;
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
}
interface GeometryBuilderConstructor {
    readonly prototype: GeometryBuilder;
    new (): GeometryBuilder;
}
interface PartialGeometry extends Partial<Geometry> {
}
declare class GeometryBuilderBase<G extends PartialGeometry> implements GeometryBuilder<G> {
    halfEdges: Array<HalfEdge>;
    vertices: Array<Vertex>;
    faces: Array<Face>;
    constructor();
    linesArray(): Float32Array;
    verticesArray(): Float32Array;
    tangentsArray(): Float32Array;
    verticesNormalsArray(): Float32Array;
    uvsArray(): Float32Array;
    indicesArray(): Uint8Array | Uint16Array | Uint32Array;
    addFaceVertices(vertices: number[][], properties?: {
        [key: string]: any;
    }): void;
    addTriangleFaceVertices(v0: number[] | Float32Array | Float64Array, v1: number[] | Float32Array | Float64Array, v2: number[] | Float32Array | Float64Array, properties?: {
        [key: string]: any;
    }): void;
    addTriangleFace(v0: Vertex, v1: Vertex, v2: Vertex, properties?: {
        [key: string]: any;
    }): void;
    addQuadFaceVertices(v0: number[] | Float32Array | Float64Array, v1: number[] | Float32Array | Float64Array, v2: number[] | Float32Array | Float64Array, v3: number[] | Float32Array | Float64Array, properties?: {
        [key: string]: any;
    }): void;
    addQuadFace(v0: Vertex, v1: Vertex, v2: Vertex, v3: Vertex, properties?: {
        [key: string]: any;
    }): void;
    addVertex(vertex: number[] | Float32Array | Float64Array): Vertex;
    addFace(vertices: Vertex[], properties?: {
        [key: string]: any;
    }): void;
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
    point: number[] | Float32Array | Float64Array;
    halfEdge: HalfEdge | null;
    properties?: {
        [key: string]: any;
    };
};
export declare class FaceHalfEdgesIterator {
    private _face;
    private _halfEdge;
    constructor(face: Face);
    reset(): void;
    current(): HalfEdge | null;
    next(): IteratorResult<HalfEdge>;
    [Symbol.iterator](): Iterator<HalfEdge>;
}
export declare class FaceVerticesIterator {
    private _face;
    private _halfEdge;
    constructor(face: Face);
    reset(): void;
    current(): Vertex | null;
    next(): IteratorResult<Vertex>;
    [Symbol.iterator](): Iterator<Vertex>;
}
export declare class VertexFacesIterator {
    private _halfEdge;
    private _vertex;
    constructor(vertex: Vertex);
    reset(): void;
    current(): Face | null;
    next(): IteratorResult<Face>;
    [Symbol.iterator](): Iterator<Face>;
}
