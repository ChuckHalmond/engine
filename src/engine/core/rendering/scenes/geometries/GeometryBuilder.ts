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

    addQuadFaceVertices(
        v0: number[] | Float32Array | Float64Array,
        v1: number[] | Float32Array | Float64Array,
        v2: number[] | Float32Array | Float64Array,
        v3: number[] | Float32Array | Float64Array,
        properties?: {[key: string]: any;}
    ): void;
    addTriangleFaceVertices(
        v0: number[] | Float32Array | Float64Array,
        v1: number[] | Float32Array | Float64Array,
        v2: number[] | Float32Array | Float64Array,
        properties?: {[key: string]: any;}
    ): void;
    addTriangleFace(v0: Vertex, v1: Vertex, v2: Vertex, properties?: {[key: string]: any;}): void;
    addQuadFace(v0: Vertex, v1: Vertex, v2: Vertex, v3: Vertex, properties?: {[key: string]: any;}): void;
    addVertex(vertex: number[] | Float32Array | Float64Array): Vertex;
    addFace(vertices: Vertex[], properties?: {[key: string]: any;}[]): void;
}

interface GeometryBuilderConstructor {
    readonly prototype: GeometryBuilder;
    new(): GeometryBuilder;
}

interface PartialGeometry extends Partial<Geometry> {};

class GeometryBuilderBase<G extends PartialGeometry> implements GeometryBuilder<G> {
    halfEdges: Array<HalfEdge>;
    vertices: Array<Vertex>;
    faces: Array<Face>;

    constructor() {
        this.halfEdges = [];
        this.vertices = [];
        this.faces = [];
    }

    linesArray(): Float32Array {
        return new Float32Array(this.faces.flatMap((face) => {
            const faceVertices = Array.from(new FaceVerticesIterator(face));
            if (faceVertices.length === 4) {
                const v0 = faceVertices[0];
                const v1 = faceVertices[1];
                const v2 = faceVertices[2];
                const v3 = faceVertices[3];
                return [
                    ...v0.point, ...v1.point,
                    ...v1.point, ...v2.point,
                    ...v2.point, ...v3.point,
                    ...v3.point, ...v0.point
                ];
            }
            else {
                const v0 = faceVertices[0];
                const v1 = faceVertices[1];
                const v2 = faceVertices[2];
                return [
                    ...v0.point, ...v1.point,
                    ...v1.point, ...v2.point,
                    ...v2.point, ...v0.point
                ];
            }
        }));
    }

    verticesArray(): Float32Array {
        return new Float32Array(this.faces.flatMap((face) => {
            return Array.from(new FaceVerticesIterator(face)).flatMap((vertex) => {
                return Array.from(vertex.point);
            });
        }));
    }

    tangentsArray(): Float32Array {
        return new Float32Array(this.faces.flatMap((face) => {
            const faceVertices = Array.from(new FaceVerticesIterator(face));
            const faceUvs = face.uv as Array<Array<number>>;
            const p0 = faceVertices[0].point;
            const p1 = faceVertices[1].point;
            const p2 = faceVertices[2].point;
            const uv0 = faceUvs[0];
            const uv1 = faceUvs[1];
            const uv2 = faceUvs[2];
            const edge1 = p1.map((p1_i, i) => p0[i] - p1_i);
            const edge2 = p1.map((p1_i, i) => p2[i] - p1_i);
            const deltaUV1 = uv1.map((uv1_i, i) => uv0[i] - uv1_i);
            const deltaUV2 = uv1.map((uv1_i, i) => uv2[i] - uv1_i);
            const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
            const tangent = edge1.map((edge1_i, i) => -(edge1_i * deltaUV2[1] - edge2[i] * deltaUV1[1]) * f);
            const length = Math.hypot(...tangent);
            face.tangent = tangent.map(tangent_i => tangent_i / length);

            return faceVertices.flatMap(() => {
                return Array.from(face.tangent);
            });
        }));
    }

    verticesNormalsArray(): Float32Array {
        return new Float32Array(this.faces.flatMap((face) => {
            const faceVertices = Array.from(new FaceVerticesIterator(face));
            const p0 = faceVertices[0].point;
            const p1 = faceVertices[1].point;
            const p2 = faceVertices[2].point;
            const edge1 = p1.map((p1_i, i) => p0[i] - p1_i);
            const edge2 = p1.map((p1_i, i) => p2[i] - p1_i);
            const components = edge1.length;
            const normal = edge1.map((_, i) => {
                const ni = (i + 1) % components;
                const pi = ((i - 1) + components) % components;
                return -(edge1[ni] * edge2[pi] - edge1[pi] * edge2[ni]);
            });
            const length = Math.hypot(...normal);
            face.normal = normal.map(normal_i => normal_i / length);

            return faceVertices.flatMap(() => {
                return Array.from(face.normal);
            });
        }));
    }

    uvsArray(): Float32Array {
        return new Float32Array(this.faces.flatMap((face) => {
            return face.uv.flat(1);
        }));
    }

    indicesArray(): Uint8Array | Uint16Array | Uint32Array {
        const count = this.faces.reduce((verticesCount, face) => {
            return verticesCount + Array.from(new FaceVerticesIterator(face)).length;
        }, 0);
        const arrayConstructor = (count < Math.pow(2, 8)) ? Uint8Array : (count < Math.pow(2, 16)) ? Uint16Array : Uint32Array;
        return new arrayConstructor(this.faces.reduce(([indices, index], face) => {
            const faces = Array.from(new FaceVerticesIterator(face));
            if (faces.length === 4) {
                return [indices.concat([index, index + 1, index + 2, index + 2, index + 3, index]), index + 4] as [number[], number];
            }
            return [indices.concat([index, index + 1, index + 2]), index + 3] as [number[], number];
        }, [[], 0] as [number[], number])[0]);
    }

    addFaceVertices(vertices: number[][], properties?: {[key: string]: any;}): void {
        const addedVertices = vertices.map((vertex) => {
            return this.vertices
                .find(vert => vert.point.length === vertex.length && vert.point.every((value, index) => vertex[index] === value)) ?? this.addVertex(vertex);
        });
        this.addFace(addedVertices, properties);
    }

    addTriangleFaceVertices(
        v0: number[] | Float32Array | Float64Array,
        v1: number[] | Float32Array | Float64Array,
        v2: number[] | Float32Array | Float64Array,
        properties?: {[key: string]: any;}
        ): void {
        const [_v0, _v1, _v2] = [v0, v1, v2].map((vertex) => {
            return this.vertices
                .find(vert => vert.point.length === vertex.length && vert.point.every((value, index) => vertex[index] === value)) ?? this.addVertex(vertex);
        });
        this.addTriangleFace(_v0, _v1, _v2, properties);
    }

    addTriangleFace(v0: Vertex, v1: Vertex, v2: Vertex, properties?: {[key: string]: any;}): void {
        this.addFace([v0, v1, v2], properties);
    }

    addQuadFaceVertices(
        v0: number[] | Float32Array | Float64Array,
        v1: number[] | Float32Array | Float64Array,
        v2: number[] | Float32Array | Float64Array,
        v3: number[] | Float32Array | Float64Array,
        properties?: {[key: string]: any;}
        ): void {
        const [_v0, _v1, _v2, _v3] = [v0, v1, v2, v3].map((vertex) => {
            return this.vertices
                .find(vert => vert.point.length === vertex.length && vert.point.every((value, index) => vertex[index] === value)) ?? this.addVertex(vertex);
        });
        this.addQuadFace(_v0, _v1, _v2, _v3, properties);
    }

    addQuadFace(v0: Vertex, v1: Vertex, v2: Vertex, v3: Vertex, properties?: {[key: string]: any;}): void {
        this.addFace([v0, v1, v2, v3], properties);
    }
    
    addVertex(vertex: number[] | Float32Array | Float64Array): Vertex {
        const vert: Vertex = {
            point: vertex,
            halfEdge: null
        };
        this.vertices.push(vert);
        return vert;
    }

    addFace(vertices: Vertex[], properties?: {[key: string]: any;}): void {
        if (vertices.length < 2) {
            console.warn(`At least 2 vertices are required to create a face.`);
            return;
        }
        const face: Face = {
            halfEdge: null,
            ...properties
        };
        let source: Vertex | null = null;
        let target: Vertex | null = null;
        let firstHalfEdge: HalfEdge | null = null;
        let halfEdge: HalfEdge | null = null;
        let previousHalfEdge: HalfEdge | null = null;
        for (let i = 0; i < vertices.length; i++) {
            source = vertices[i];
            target = (i < vertices.length - 1) ? vertices[i + 1] : vertices[0];
            const existingHalfEdge = Array.from(new VertexFacesIterator(source)).find(
                (face) => {
                    if (face == null) return false;
                    return Array.from(new FaceHalfEdgesIterator(face)).find(
                        (halfEdge) => halfEdge.target === target && halfEdge.prev?.target === source
                    );
                }
            );
            if (existingHalfEdge) {
                continue;
            }
            halfEdge = {
                target: target,
                twin: null,
                next: null,
                prev: null,
                face: face
            };
            if (previousHalfEdge == null) {
                face.halfEdge = halfEdge;
                firstHalfEdge = halfEdge;
            }
            else {
                halfEdge.prev = previousHalfEdge;
                previousHalfEdge.next = halfEdge;
            }
            if (source.halfEdge == null) {
                source.halfEdge = halfEdge;
            }
            const twinHalfEdge = this.halfEdges.find(
                halfEdge => halfEdge.target === source && halfEdge.prev?.target === target
            ) ?? null;
            if (twinHalfEdge !== null) {
                halfEdge.twin = twinHalfEdge;
                twinHalfEdge.twin = halfEdge;
            }
            previousHalfEdge = halfEdge;
            this.halfEdges.push(halfEdge);
        }
        if (halfEdge !== null && firstHalfEdge !== null) {
            firstHalfEdge.prev = halfEdge;
            halfEdge.next = firstHalfEdge;
        }
        this.faces.push(face);
    }
}

var GeometryBuilder: GeometryBuilderConstructor = GeometryBuilderBase;

export type HalfEdge = {
    target: Vertex | null;
    twin: HalfEdge | null;
    prev: HalfEdge | null;
    next: HalfEdge | null;
    face: Face | null;
}

export type Face = {
    halfEdge: HalfEdge | null;
    [key: string]: any;
}

export type Vertex = {
    point: number[] | Float32Array | Float64Array;
    halfEdge: HalfEdge | null;
    properties?: {
        [key: string]: any;
    }
}

export class FaceHalfEdgesIterator {
    private _face: Face;
    private _halfEdge: HalfEdge | null;

    constructor(face: Face) {
        this._face = face;
        this._halfEdge = null;
    }

    reset(): void {
        this._halfEdge = null;
    }

    current(): HalfEdge | null {
        return this._halfEdge;
    }

    next(): IteratorResult<HalfEdge> {
        if (this._halfEdge == null) {
            const firstHalfEdge = this._face.halfEdge ?? null;
            const nextHalfEdge = this._face.halfEdge?.next ?? null;
            this._halfEdge = nextHalfEdge;
            if (firstHalfEdge !== null) {
                return {
                    value: firstHalfEdge, done: nextHalfEdge == null
                };
            }
        }
        else if (this._halfEdge !== this._face.halfEdge) {
            const halfEdge = this._halfEdge;
            const nextHalfEdge = halfEdge.next ?? null;
            this._halfEdge = nextHalfEdge;
            if (halfEdge !== null) {
                return {
                    value: halfEdge, done: nextHalfEdge == null
                };
            }
        }
        return {
            value: void 0, done: true
        };
    }

    [Symbol.iterator](): Iterator<HalfEdge> {
        this._halfEdge = null;
        return this;
    }
}

export class FaceVerticesIterator {
    private _face: Face;
    private _halfEdge: HalfEdge | null;

    constructor(face: Face) {
        this._face = face;
        this._halfEdge = null;
    }

    reset(): void {
        this._halfEdge = null;
    }

    current(): Vertex | null {
        return this._halfEdge?.prev?.target ?? null;
    }

    next(): IteratorResult<Vertex> {
        if (this._halfEdge == null) {
            const firstVertex = this._face.halfEdge?.prev?.target ?? null;
            const nextHalfEdge = this._face.halfEdge?.next ?? null;
            this._halfEdge = nextHalfEdge;
            if (firstVertex !== null) {
                return {
                    value: firstVertex, done: nextHalfEdge == null
                };
            }
        }
        else if (this._halfEdge !== this._face.halfEdge) {
            const vertex = this._halfEdge.prev?.target ?? null;
            const nextHalfEdge = this._halfEdge.next ?? null;
            this._halfEdge = nextHalfEdge;
            if (vertex !== null) {
                return {
                    value: vertex, done: nextHalfEdge == null
                };
            }
        }
        return {
            value: void 0, done: true
        };
    }

    [Symbol.iterator](): Iterator<Vertex> {
        this._halfEdge = null;
        return this;
    }
}

export class VertexFacesIterator {
    private _halfEdge: HalfEdge | null;
    private _vertex: Vertex;

    constructor(vertex: Vertex) {
        this._vertex = vertex;
        this._halfEdge = null;
    }

    reset(): void {
        this._halfEdge = null;
    }

    current(): Face | null {
        return this._halfEdge?.face ?? null;
    }

    next(): IteratorResult<Face>  {
        if (this._halfEdge == null) {
            const face = this._vertex.halfEdge?.face ?? null;
            const nextHalfEdge = this._vertex.halfEdge?.prev?.twin ?? null;
            this._halfEdge = nextHalfEdge;
            if (face !== null) {
                return {
                    value: face, done: nextHalfEdge == null
                };
            }
        }
        else if (this._halfEdge !== this._vertex.halfEdge) {
            const face = this._halfEdge.face ?? null;
            const nextHalfEdge = this._halfEdge?.prev?.twin ?? null;
            this._halfEdge = nextHalfEdge;
            if (face !== null) {
                return {
                    value: face, done: nextHalfEdge == null
                };
            }
        }
        return {
            value: void 0, done: true
        };
    }

    [Symbol.iterator](): Iterator<Face> {
        this._halfEdge = null;
        return this;
    }
}