import { Vector3 } from "../../../../libs/maths/algebra/vectors/Vector3"
import { BoundingBox } from "./bounding/BoundingBox";

export { GeometryBuilder };

interface GeometryBuilder {
    halfEdges: Array<HalfEdge>;
    vertices: Array<Vertex>;
    faces: Array<Face>;
    //clone(): GeometryBuilder;
    addTriangleFace(v0: Vertex, v1: Vertex, v2: Vertex, properties?: {[key: string]: any;}): void;
    addQuadFace(v0: Vertex, v1: Vertex, v2: Vertex, v3: Vertex, properties?: {[key: string]: any;}): void;
    addVertex(vertex: number[] | Float32Array | Float64Array): Vertex;
    addFace(vertices: Vertex[], properties?: {[key: string]: any;}[]): void;
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
    new(): GeometryBuilder;
}

class GeometryBuilderBase implements GeometryBuilder {
    halfEdges: Array<HalfEdge>;
    vertices: Array<Vertex>;
    faces: Array<Face>;

    constructor() {
        this.halfEdges = [];
        this.vertices = [];
        this.faces = [];
    }

    /*clone(): GeometryBuilder {
        const {halfEdges, faces, vertices} = this;
        const clone = new GeometryBuilder();
        const cloneHalfEdges = new Map<HalfEdge, HalfEdge>();
        const cloneFaces = new Map<Face, Face>();
        const cloneVertices = new Map<Vertex, Vertex>();
        halfEdges.forEach((halfEdge) => {
            cloneHalfEdges.set(halfEdge, {
                target: null,
                twin: null,
                prev: null,
                next: null,
                face: null
            });
        });
        faces.forEach((face) => {
            cloneFaces.set(face, {
                halfEdge: null
            });
        });
        vertices.forEach((vertex) => {
            const {position} = vertex;
            cloneVertices.set(vertex, {
                position: position,
                halfEdge: null
            });
        });
        halfEdges.forEach((halfEdge) => {
            const {face, next, prev, target, twin} = halfEdge;
            const cloneHalfEdge = cloneHalfEdges.get(halfEdge)!;
            if (face !== null) {
                cloneHalfEdge.face = cloneFaces.get(face)!;
            }
            if (next !== null) {
                cloneHalfEdge.next = cloneHalfEdges.get(next)!;
            }
            if (prev !== null) {
                cloneHalfEdge.prev = cloneHalfEdges.get(prev)!;
            }
            if (target !== null) {
                cloneHalfEdge.target = cloneVertices.get(target)!;
            }
            if (twin !== null) {
                cloneHalfEdge.twin = cloneHalfEdges.get(twin)!;
            }
        });
        faces.forEach((face) => {
            const {halfEdge} = face;
            const cloneFace = cloneFaces.get(face)!;
            if (halfEdge) {
                cloneFace.halfEdge = cloneHalfEdges.get(halfEdge)!;
            }
        });
        vertices.forEach((vertex) => {
            const {halfEdge} = vertex;
            const cloneVertex = cloneVertices.get(vertex)!;
            if (halfEdge) {
                cloneVertex.halfEdge = cloneHalfEdges.get(halfEdge)!;
            }
        });
        clone.halfEdges = Array.from(cloneHalfEdges.values());
        clone.faces = Array.from(cloneFaces.values());
        clone.vertices = Array.from(cloneVertices.values());
        return clone;
    }*/

    addTriangleFace(v0: Vertex, v1: Vertex, v2: Vertex, properties?: {[key: string]: any;}): void {
        this.addFace([v0, v1, v2], properties);
    }

    addQuadFace(v0: Vertex, v1: Vertex, v2: Vertex, v3: Vertex, properties?: {[key: string]: any;}): void {
        this.addFace([v0, v1, v2, v3], properties);
    }
    
    addVertex(position: number[] | Float32Array | Float64Array): Vertex {
        const {vertices} = this;
        const vertex: Vertex = {
            position: position,
            halfEdge: null
        };
        vertices.push(vertex);
        return vertex;
    }

    addFace(vertices: Vertex[], properties?: {[key: string]: any;}): void {
        const {halfEdges, faces} = this;
        if (vertices.length < 2) {
            console.warn("At least 2 vertices are required to create a face.");
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
            const twinHalfEdge = halfEdges.find(
                halfEdge => halfEdge.target === source && halfEdge.prev?.target === target
            ) ?? null;
            if (twinHalfEdge !== null) {
                halfEdge.twin = twinHalfEdge;
                twinHalfEdge.twin = halfEdge;
            }
            previousHalfEdge = halfEdge;
            halfEdges.push(halfEdge);
        }
        if (halfEdge !== null && firstHalfEdge !== null) {
            firstHalfEdge.prev = halfEdge;
            halfEdge.next = firstHalfEdge;
        }
        faces.push(face);
    }

    linesArray(): Float32Array {
        const {faces} = this;
        return new Float32Array(faces.flatMap((face) => {
            const faceVertices = Array.from(new FaceVerticesIterator(face));
            if (faceVertices.length === 4) {
                const v0 = faceVertices[0];
                const v1 = faceVertices[1];
                const v2 = faceVertices[2];
                const v3 = faceVertices[3];
                return [
                    ...v0.position, ...v1.position,
                    ...v1.position, ...v2.position,
                    ...v2.position, ...v3.position,
                    ...v3.position, ...v0.position
                ];
            }
            else {
                const v0 = faceVertices[0];
                const v1 = faceVertices[1];
                const v2 = faceVertices[2];
                return [
                    ...v0.position, ...v1.position,
                    ...v1.position, ...v2.position,
                    ...v2.position, ...v0.position
                ];
            }
        }));
    }

    verticesArray(): Float32Array {
        const {faces} = this;
        return new Float32Array(faces.flatMap((face) => {
            return Array.from(new FaceVerticesIterator(face)).flatMap((vertex) => {
                return Array.from(vertex.position);
            });
        }));
    }

    tangentsArray(): Float32Array {
        const {faces} = this;
        return new Float32Array(faces.flatMap((face) => {
            const faceVertices = Array.from(new FaceVerticesIterator(face));
            const faceUvs = face.uv as Array<Array<number>>;
            const p0 = faceVertices[0].position;
            const p1 = faceVertices[1].position;
            const p2 = faceVertices[2].position;
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
        const {faces} = this;
        return new Float32Array(faces.flatMap((face) => {
            const faceVertices = Array.from(new FaceVerticesIterator(face));
            const p0 = faceVertices[0].position;
            const p1 = faceVertices[1].position;
            const p2 = faceVertices[2].position;
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
        const {faces} = this;
        return new Float32Array(faces.flatMap((face) => {
            return face.uv.flat(1);
        }));
    }

    indicesArray(): Uint8Array | Uint16Array | Uint32Array {
        const {faces} = this;
        const count = faces.reduce((verticesCount, face) => {
            return verticesCount + Array.from(new FaceVerticesIterator(face)).length;
        }, 0);
        const arrayConstructor = (count < Math.pow(2, 8)) ? Uint8Array : (count < Math.pow(2, 16)) ? Uint16Array : Uint32Array;
        return new arrayConstructor(faces.reduce(([indices, index], face) => {
            const vertices = Array.from(new FaceVerticesIterator(face));
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
    position: number[] | Float32Array | Float64Array;
    halfEdge: HalfEdge | null;
    properties?: {
        [key: string]: any;
    }
}

export class FaceHalfEdgesIterator {
    #face: Face;
    #halfEdge: HalfEdge | null;

    constructor(face: Face) {
        this.#face = face;
        this.#halfEdge = null;
    }

    reset(): void {
        this.#halfEdge = null;
    }

    current(): HalfEdge | null {
        return this.#halfEdge;
    }

    next(): IteratorResult<HalfEdge> {
        if (this.#halfEdge == null) {
            const firstHalfEdge = this.#face.halfEdge ?? null;
            const nextHalfEdge = this.#face.halfEdge?.next ?? null;
            this.#halfEdge = nextHalfEdge;
            if (firstHalfEdge !== null) {
                return {
                    value: firstHalfEdge, done: nextHalfEdge == null
                };
            }
        }
        else if (this.#halfEdge !== this.#face.halfEdge) {
            const halfEdge = this.#halfEdge;
            const nextHalfEdge = halfEdge.next ?? null;
            this.#halfEdge = nextHalfEdge;
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
        this.#halfEdge = null;
        return this;
    }
}

export class FaceVerticesIterator {
    #face: Face;
    #halfEdge: HalfEdge | null;

    constructor(face: Face) {
        this.#face = face;
        this.#halfEdge = null;
    }

    reset(): void {
        this.#halfEdge = null;
    }

    current(): Vertex | null {
        return this.#halfEdge?.prev?.target ?? null;
    }

    next(): IteratorResult<Vertex> {
        if (this.#halfEdge == null) {
            const firstVertex = this.#face.halfEdge?.prev?.target ?? null;
            const nextHalfEdge = this.#face.halfEdge?.next ?? null;
            this.#halfEdge = nextHalfEdge;
            if (firstVertex !== null) {
                return {
                    value: firstVertex, done: nextHalfEdge == null
                };
            }
        }
        else if (this.#halfEdge !== this.#face.halfEdge) {
            const vertex = this.#halfEdge.prev?.target ?? null;
            const nextHalfEdge = this.#halfEdge.next ?? null;
            this.#halfEdge = nextHalfEdge;
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
        this.#halfEdge = null;
        return this;
    }
}

export class VertexFacesIterator {
    #halfEdge: HalfEdge | null;
    #vertex: Vertex;

    constructor(vertex: Vertex) {
        this.#vertex = vertex;
        this.#halfEdge = null;
    }

    reset(): void {
        this.#halfEdge = null;
    }

    current(): Face | null {
        return this.#halfEdge?.face ?? null;
    }

    next(): IteratorResult<Face>  {
        if (this.#halfEdge == null) {
            const face = this.#vertex.halfEdge?.face ?? null;
            const nextHalfEdge = this.#vertex.halfEdge?.prev?.twin ?? null;
            this.#halfEdge = nextHalfEdge;
            if (face !== null) {
                return {
                    value: face, done: nextHalfEdge == null
                };
            }
        }
        else if (this.#halfEdge !== this.#vertex.halfEdge) {
            const face = this.#halfEdge.face ?? null;
            const nextHalfEdge = this.#halfEdge?.prev?.twin ?? null;
            this.#halfEdge = nextHalfEdge;
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
        this.#halfEdge = null;
        return this;
    }
}