import { Vector3 } from "../../../../libs/maths/algebra/vectors/Vector3"
import { BoundingSphere } from "./bounding/BoundingSphere";
import { BoundingBox } from "./bounding/BoundingBox";

export { GeometryBuilder };

interface GeometryBuilder {
    readonly halfEdges: Array<HalfEdge>;
    readonly vertices: Array<Vertex>;
    readonly faces: Array<Face>;
    clone(): GeometryBuilder;
    addTriangleFace(v0: VertexID, v1: VertexID, v2: VertexID, properties?: {[key: string]: any;}): void;
    addQuadFace(v0: VertexID, v1: VertexID, v2: VertexID, v3: VertexID, properties?: {[key: string]: any;}): void;
    addVertex(vertex: number[] | Float32Array | Float64Array): VertexID;
    addFace(vertices: VertexID[], properties?: {[key: string]: any;}[]): void;
    verticesArray(): Float32Array;
    uvsArray(): Float32Array;
    indicesArray(): Uint8Array | Uint16Array | Uint32Array;
    linesArray(): Float32Array;
    normalsArray(): Float32Array;
    tangentsArray(): Float32Array;
    boundingBox(): BoundingBox;
    faceHalfEdgesIterator(face: FaceID): FaceHalfEdgesIterator;
    faceVerticesIterator(face: FaceID): FaceHalfEdgesIterator;
    vertexFacesIterator(vertex: VertexID): VertexFacesIterator;
}

interface GeometryBuilderConstructor {
    readonly prototype: GeometryBuilder;
    new(): GeometryBuilder;
}

class GeometryBuilderBase implements GeometryBuilder {
    readonly halfEdges: Array<HalfEdge>;
    readonly vertices: Array<Vertex>;
    readonly faces: Array<Face>;

    constructor() {
        this.halfEdges = [];
        this.vertices = [];
        this.faces = [];
    }

    clone(): GeometryBuilder {
        return Object.assign(Object.create(this.constructor.prototype), structuredClone(this));
    }

    addTriangleFace(v0: VertexID, v1: VertexID, v2: VertexID, properties?: {[key: string]: any;}): void {
        this.addFace([v0, v1, v2], properties);
    }

    addQuadFace(v0: VertexID, v1: VertexID, v2: VertexID, v3: VertexID, properties?: {[key: string]: any;}): void {
        this.addFace([v0, v1, v2, v3], properties);
    }
    
    addVertex(position: number[] | Float32Array | Float64Array): VertexID {
        const {vertices} = this;
        const vertex: Vertex = {
            position: position,
            halfEdgeID: null
        };
        return vertices.push(vertex) - 1;
    }

    addFace(vertices: VertexID[], properties?: {[key: string]: any;}): void {
        const {halfEdges: _halfEdges, vertices: _vertices, faces: _faces} = this;
        const {length: faceVerticesCount} = vertices;
        if (faceVerticesCount < 2) {
            console.error(`At least 2 vertices are required to create a face.`);
            return;
        }
        const face: Face = {
            halfEdgeID: null,
            ...properties
        };
        const faceID = _faces.length;
        let sourceID: VertexID | null = null;
        let targetID: VertexID | null = null;
        let firstHalfEdgeID: HalfEdgeID | null = null;
        let halfEdge: HalfEdge | null = null;
        let halfEdgeID: HalfEdgeID | null = null;
        let previousHalfEdgeID: HalfEdgeID | null = null;
        for (let i = 0; i < faceVerticesCount; i++) {
            sourceID = vertices[i];
            targetID = (i < faceVerticesCount - 1) ? vertices[i + 1] : vertices[0];
            const existingHalfEdge = Array.from(this.vertexFacesIterator(sourceID)).find(
                (face_i) => {
                    if (face_i === null) return false;
                    return Array.from(this.faceHalfEdgesIterator(face_i)).find(
                        (halfEdge_i) => {
                            const {targetID: targetID_i, prevID: prevID_i} = _halfEdges[halfEdge_i];
                            return targetID_i === targetID && _halfEdges[prevID_i ?? -1]?.targetID === sourceID;
                        }
                    );
                }
            );
            if (existingHalfEdge) {
                continue;
            }
            halfEdge = {
                targetID: targetID,
                twinID: null,
                nextID: null,
                prevID: null,
                faceID: faceID
            };
            halfEdgeID = _halfEdges.length;
            if (previousHalfEdgeID === null) {
                face.halfEdge = halfEdgeID;
                firstHalfEdgeID = halfEdgeID;
            }
            else {
                halfEdge.prevID = previousHalfEdgeID;
                _halfEdges[previousHalfEdgeID].nextID = halfEdgeID;
            }
            const source = _vertices[sourceID]!;
            if (source.halfEdgeID === null) {
                source.halfEdgeID = halfEdgeID;
            }
            const twinHalfEdge = _halfEdges.find(
                (halfEdge_i) => {
                    const {targetID: targetID_i, prevID: prevID_i} = halfEdge_i;
                    return targetID_i === sourceID && _halfEdges[prevID_i ?? -1]?.targetID === targetID;
                }
            ) ?? null;
            if (twinHalfEdge !== null) {
                halfEdge.twinID = _halfEdges.indexOf(twinHalfEdge);
                twinHalfEdge.twinID = halfEdgeID;
            }
            previousHalfEdgeID = halfEdgeID;
            _halfEdges.push(halfEdge);
        }
        if (halfEdge !== null && firstHalfEdgeID !== null) {
            _halfEdges[firstHalfEdgeID].prevID = halfEdgeID;
            halfEdge.nextID = firstHalfEdgeID;
        }
        _faces.push(face);
    }

    linesArray(): Float32Array {
        const {faces, vertices} = this;
        return new Float32Array(faces.flatMap((_, i) => {
            const faceVertices = Array.from(this.faceVerticesIterator(i));
            if (faceVertices.length === 4) {
                const [v0, v1, v2, v3] = faceVertices.map(vertex_i => vertices[vertex_i].position);
                return [
                    ...v0, ...v1,
                    ...v1, ...v2,
                    ...v2, ...v3,
                    ...v3, ...v0
                ];
            }
            else {
                const [v0, v1, v2] = faceVertices.map(vertex_i => vertices[vertex_i].position);
                return [
                    ...v0, ...v1,
                    ...v1, ...v2,
                    ...v2, ...v0
                ];
            }
        }));
    }

    verticesArray(): Float32Array {
        const {faces, vertices} = this;
        return new Float32Array(faces.flatMap((_, i) => {
            return Array.from(this.faceVerticesIterator(i)).flatMap((vertex) => {
                return Array.from(vertices[vertex].position);
            });
        }));
    }

    tangentsArray(): Float32Array {
        const {faces, vertices} = this;
        return new Float32Array(faces.flatMap((face_i, i) => {
            const faceVertices = Array.from(this.faceVerticesIterator(i));
            const faceUvs = face_i.uv as Array<Array<number>>;
            const [v0, v1, v2] = faceVertices.map(vertex_i => vertices[vertex_i].position);
            const [uv0, uv1, uv2] = faceUvs;
            const edge1 = v1.map((v1_i, i) => v0[i] - v1_i);
            const edge2 = v1.map((v1_i, i) => v2[i] - v1_i);
            const deltaUV1 = uv1.map((uv1_i, i) => uv0[i] - uv1_i);
            const deltaUV2 = uv1.map((uv1_i, i) => uv2[i] - uv1_i);
            const f = 1.0 / (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
            const tangent = edge1.map((edge1_i, i) => -(edge1_i * deltaUV2[1] - edge2[i] * deltaUV1[1]) * f);
            const length = Math.hypot(...tangent);
            face_i.tangent = tangent.map(tangent_i => tangent_i / length);

            return faceVertices.flatMap(() => {
                return Array.from(face_i.tangent);
            });
        }));
    }

    normalsArray(): Float32Array {
        const {faces, vertices} = this;
        return new Float32Array(faces.flatMap((face_i, i) => {
            const faceVertices = Array.from(this.faceVerticesIterator(i));
            const [v0, v1, v2] = faceVertices.map(vertex_i => vertices[vertex_i].position);
            const edge1 = v1.map((v1_i, i) => v0[i] - v1_i);
            const edge2 = v1.map((v1_i, i) => v2[i] - v1_i);
            const normal = edge1.map((_, i) => {
                const ni = (i + 1) % 3;
                const pi = ((i - 1) + 3) % 3;
                return -(edge1[ni] * edge2[pi] - edge1[pi] * edge2[ni]);
            });
            const length = Math.hypot(...normal);
            face_i.normal = normal.map(normal_i => normal_i / length);
            
            return faceVertices.flatMap(() => {
                return Array.from(face_i.normal);
            });
        }));
    }

    uvsArray(): Float32Array {
        const {faces} = this;
        return new Float32Array(faces.flatMap((face) => {
            return face.uv.flat(1);
        }));
    }

    indicesArray(): Uint8Array | Uint16Array | Uint32Array {
        const {faces} = this;
        const count = faces.reduce((verticesCount, _, i) => {
            return verticesCount + Array.from(this.faceVerticesIterator(i)).length;
        }, 0);
        const arrayConstructor = (count < Math.pow(2, 8)) ? Uint8Array : (count < Math.pow(2, 16)) ? Uint16Array : Uint32Array;
        return new arrayConstructor(faces.reduce(([indices, index], face_i, i) => {
            const vertices = Array.from(this.faceVerticesIterator(i));
            if (vertices.length === 4) {
                return [indices.concat([index, index + 1, index + 2, index + 2, index + 3, index]), index + 4] as [number[], number];
            }
            return [indices.concat([index, index + 1, index + 2]), index + 3] as [number[], number];
        }, [[], 0] as [number[], number])[0]);
    }

    boundingBox(): BoundingBox {
        const positiveInfinity = Number.POSITIVE_INFINITY;
        const negativeInfinity = Number.NEGATIVE_INFINITY;
        let minX = positiveInfinity;
        let minY = positiveInfinity;
        let minZ = positiveInfinity;
        let maxX = negativeInfinity;
        let maxY = negativeInfinity;
        let maxZ = negativeInfinity;
        const {vertices} = this;
        if (vertices.length > 0) {
            vertices.forEach((vertex_i) => {
                const [x, y, z] = vertex_i.position;
                if (x < minX) minX = x;
                else if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                else if (y > maxY) maxY = y;
                if (z < minZ) minZ = z;
                else if (z > maxZ) maxZ = z;
            });
        }
        const min = new Vector3([minX, minY, minZ]);
        const max = new Vector3([maxX, maxY, maxZ]);
        return new BoundingBox(min, max);
    }

    boundingSphere(): BoundingSphere {
        const positiveInfinity = Number.POSITIVE_INFINITY;
        const negativeInfinity = Number.NEGATIVE_INFINITY;
        let minX = positiveInfinity;
        let minY = positiveInfinity;
        let minZ = positiveInfinity;
        let maxX = negativeInfinity;
        let maxY = negativeInfinity;
        let maxZ = negativeInfinity;
        const {vertices} = this;
        if (vertices.length > 0) {
            vertices.forEach((vertex_i) => {
                const [x, y, z] = vertex_i.position;
                if (x < minX) minX = x;
                else if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                else if (y > maxY) maxY = y;
                if (z < minZ) minZ = z;
                else if (z > maxZ) maxZ = z;
            });
        }
        const min = new Vector3([minX, minY, minZ]);
        const max = new Vector3([maxX, maxY, maxZ]);
        return new BoundingSphere(
            new Vector3(), Math.max(min.length(), max.length())
        );
    }
    
    faceHalfEdgesIterator(face: FaceID): FaceHalfEdgesIterator {
        return new FaceHalfEdgesIterator(this, face);
    }

    faceVerticesIterator(face: FaceID): FaceHalfEdgesIterator {
        return new FaceVerticesIterator(this, face);
    }

    vertexFacesIterator(vertex: VertexID): VertexFacesIterator {
        return new VertexFacesIterator(this, vertex);
    }
}

var GeometryBuilder: GeometryBuilderConstructor = GeometryBuilderBase;

export type HalfEdgeID = number;
export type FaceID = number;
export type VertexID = number;

export type HalfEdge = {
    targetID: VertexID | null;
    twinID: HalfEdgeID | null;
    prevID: HalfEdgeID | null;
    nextID: HalfEdgeID | null;
    faceID: FaceID | null;
}

export type Face = {
    halfEdgeID: HalfEdgeID | null;
    [key: string]: any;
}

export type Vertex = {
    position: number[] | Float32Array | Float64Array;
    halfEdgeID: HalfEdgeID | null;
    properties?: {
        [key: string]: any;
    }
}

export class FaceHalfEdgesIterator {
    geometry: GeometryBuilder;
    faceID: FaceID;
    halfEdgeID: HalfEdgeID | null;

    constructor(geometry: GeometryBuilder, face: FaceID) {
        this.geometry = geometry;
        this.faceID = face;
        this.halfEdgeID = null;
    }

    reset(): void {
        this.halfEdgeID = null;
    }

    current(): HalfEdgeID | null {
        return this.halfEdgeID;
    }

    next(): IteratorResult<HalfEdgeID> {
        const {halfEdgeID, faceID, geometry} = this;
        const {faces, halfEdges} = geometry;
        const face = faces[faceID];
        if (face !== null) {
            if (halfEdgeID === null) {
                const firstHalfEdgeID = face.halfEdgeID ?? null;
                const nextHalfEdgeID = faces[firstHalfEdgeID ?? -1]?.nextID ?? null;
                this.halfEdgeID = nextHalfEdgeID;
                if (firstHalfEdgeID !== null) {
                    return {
                        value: firstHalfEdgeID, done: nextHalfEdgeID === null
                    };
                }
            }
            else if (halfEdgeID !== face.halfEdge) {
                const nextHalfEdgeID = halfEdges[halfEdgeID].nextID ?? null;
                this.halfEdgeID = nextHalfEdgeID;
                if (halfEdgeID !== null) {
                    return {
                        value: halfEdgeID, done: nextHalfEdgeID === null
                    };
                }
            }
        }
        return {
            value: undefined, done: true
        };
    }

    [Symbol.iterator](): Iterator<HalfEdgeID> {
        this.halfEdgeID = null;
        return this;
    }
}

export class FaceVerticesIterator {
    geometry: GeometryBuilder;
    faceID: FaceID;
    halfEdgeID: HalfEdgeID | null;

    constructor(geometry: GeometryBuilder, face: FaceID) {
        this.geometry = geometry;
        this.faceID = face;
        this.halfEdgeID = null;
    }

    reset(): void {
        this.halfEdgeID = null;
    }

    current(): VertexID | null {
        const {halfEdgeID, geometry} = this;
        const {halfEdges} = geometry;
        return halfEdges[halfEdges[halfEdgeID ?? -1]?.prevID ?? -1]?.targetID ?? null;
    }

    next(): IteratorResult<VertexID> {
        const {halfEdgeID, geometry, faceID} = this;
        const {faces, halfEdges} = geometry;
        const face = faces[faceID ?? -1];
        if (face !== null) {
            const {halfEdge: faceHalfEdgeID} = face;
            if (halfEdgeID === null) {
                const firstVertexID = halfEdges[halfEdges[faceHalfEdgeID ?? -1].prevID ?? -1].targetID ?? null;
                const nextHalfEdgeID = halfEdges[faceHalfEdgeID ?? -1].nextID ?? null;
                this.halfEdgeID = nextHalfEdgeID;
                if (firstVertexID !== null) {
                    return {
                        value: firstVertexID, done: nextHalfEdgeID === null
                    };
                }
            }
            else if (halfEdgeID !== face.halfEdge) {
                const vertex = halfEdges[halfEdges[halfEdgeID].prevID ?? -1].targetID ?? null;
                const nextHalfEdgeID = halfEdges[halfEdgeID].nextID ?? null;
                this.halfEdgeID = nextHalfEdgeID;
                if (vertex !== null) {
                    return {
                        value: vertex, done: nextHalfEdgeID === null
                    };
                }
            }
        }
        return {
            value: undefined, done: true
        };
    }

    [Symbol.iterator](): Iterator<VertexID> {
        this.halfEdgeID = null;
        return this;
    }
}

export class VertexFacesIterator {
    geometry: GeometryBuilder;
    halfEdgeID: HalfEdgeID | null;
    vertexID: VertexID;
    
    constructor(geometry: GeometryBuilder, vertex: VertexID) {
        this.geometry = geometry;
        this.vertexID = vertex;
        this.halfEdgeID = null;
    }
    
    reset(): void {
        this.halfEdgeID = null;
    }

    current(): FaceID | null {
        const {geometry, halfEdgeID} = this;
        const {halfEdges} = geometry;
        return halfEdges[halfEdgeID ?? -1].faceID ?? null;
    }

    next(): IteratorResult<FaceID>  {
        const {halfEdgeID, vertexID, geometry} = this;
        const {halfEdges, vertices} = geometry;
        const vertex = vertices[vertexID ?? -1];
        if (vertex) {
            const {halfEdgeID: vertexHalfEdgeID} = vertex;
            if (halfEdgeID === null) {
                const faceID = halfEdges[vertexHalfEdgeID ?? -1]?.faceID ?? null;
                const nextHalfEdgeID = halfEdges[halfEdges[vertexHalfEdgeID ?? -1]?.prevID ?? -1]?.twinID ?? null;
                this.halfEdgeID = nextHalfEdgeID;
                if (faceID !== null) {
                    return {
                        value: faceID, done: nextHalfEdgeID === null
                    };
                }
            }
            else if (halfEdgeID !== vertex.halfEdgeID) {
                const faceID = halfEdges[halfEdgeID]?.faceID ?? null;
                const nextHalfEdgeID = halfEdges[halfEdges[halfEdgeID].prevID ?? -1].twinID ?? null;
                this.halfEdgeID = nextHalfEdgeID;
                if (faceID !== null) {
                    return {
                        value: faceID, done: nextHalfEdgeID === null
                    };
                }
            }
        }
        return {
            value: undefined, done: true
        };
    }

    [Symbol.iterator](): Iterator<FaceID> {
        this.halfEdgeID = null;
        return this;
    }
}