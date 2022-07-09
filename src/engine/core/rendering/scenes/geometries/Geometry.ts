

// Vertices : counter clock-wise ordered

import { TriangleList } from "../../../../libs/maths/extensions/lists/TriangleList";
import { Vector2List } from "../../../../libs/maths/extensions/lists/Vector2List";
import { Vector3List } from "../../../../libs/maths/extensions/lists/Vector3List";
import { UUID, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { BoundingBox } from "../../../../libs/physics/collisions/AxisAlignedBoundingBox";
import { BoundingSphere } from "../../../../libs/physics/collisions/BoundingSphere";
import { GeometryBuffer } from "./GeometryBuffer";
import { GeometryBuilder } from "./GeometryBuilder";
import { GeometryUtils } from "./GeometryUtils";

// FaceIndices : 3 vertices indices
// FaceArea : triangle.getArea()
// FaceNormal : triangle.getNormal()
// FaceUV / FaceColor ?

// VertexNormal => Weighted (by area) average of the normals of the faces containing the vertex (=> Varying)
// - Clone the vertex array, read the face indices array

// VertexIndices

// PerVertex Animation / MorphTargets

// SkeletalAnimation

// Bones are a hierarchical tree

// bonesWeights
// bonesIndices

// MorphTarget Animation

// MorphTargets are a copy of each face, being transformed over time

// morphIndices
// morphTargets = []; MorphTargets are a transformed copy of faces
// morphNormals = [];

export { GeometryPropertyKeys };
export { Geometry };
//export { isGeometry };
export { GeometryBase };

enum GeometryPropertyKeys {
    vertices,
    indices,
    uvs,
    facesNormals,
    verticesNormals,
    tangents,
    bitangents
}


interface GeometryConstructor {

}

interface Geometry {
    /*readonly isGeometry: true;
    readonly uuid: UUID;
    
    indices: TypedArray;
    distances: TypedArray;
    vertices: Vector3List;
    barycentrics: Vector2List
    faces: TriangleList;
    uvs: Vector2List;

    facesNormals: Vector3List;
    verticesNormals: Vector3List;
    tangents: Vector3List;
    bitangents: Vector3List;

    readonly boundingBox?: BoundingBox;
    readonly boundingSphere?: BoundingSphere;*/

    //builder(): GeometryBuilder;

    //readonly changes: SingleTopicMessageSubscriber<{prop: GeometryPropertyKeys, section: BufferSectionValues}>;
    
    //copy(geometry: Geometry): Geometry;
    //clone(): Geometry;

    //computeFacesNormals(options?: ListLoopOptions): Geometry;
    //computeVerticesNormals(weighted?: boolean, options?: ListLoopOptions): Geometry;
    //computeTangentsAndBitangents(options?: ListLoopOptions): Geometry;

	// computeBoundingBox(): BoundingBox;
    // computeBoundingSphere(): BoundingSphere;
    
    //updateVertices(vertices: TypedArray, offset?: number): Geometry;
    //updateUvs(uvs: TypedArray, offset?: number): Geometry;
}
/*
function isGeometry(obj: any): obj is Geometry {
    return (obj as Geometry).isGeometry;
}*/

abstract class GeometryBase implements Geometry {

    /*readonly uuid: UUID;
    readonly isGeometry: true;
    
    private _boundingBox?: BoundingBox;
    private _boundingSphere?: BoundingSphere;

    private _indicesArray: TypedArray;

    private _distancesArray: TypedArray;

    private _verticesArray: TypedArray;
    private _vertices: Vector3List;
    private _faces: TriangleList;

    private _uvsArray: TypedArray;
    private _uvs: Vector2List;

    private _facesNormalsArray: TypedArray;
    private _facesNormals: Vector3List;

    private _verticesNormalsArray: TypedArray;
    private _verticesNormals: Vector3List;

    private _tangentsArray: TypedArray;
    private _tangents: Vector3List;

    private _bitangentsArray: TypedArray;
    private _bitangents: Vector3List;

    private _barycentricsArray: TypedArray;
    private _barycentrics: Vector2List;

    private _weightedVerticesNormals: boolean;*/

    constructor(/*desc: {
        vertices: TypedArray;
        indices: TypedArray;
        uvs: TypedArray;
        weightedVerticesNormals?: boolean
    }*/) {
        /*this.uuid = UUIDGenerator.newUUID();
        this.isGeometry = true;
        
        this._verticesArray = desc.vertices;
        this._vertices = new Vector3List(this._verticesArray);
        this._faces = new TriangleList(this._verticesArray);

        this._indicesArray = desc.indices;

        this._uvsArray = desc.uvs;
        this._uvs = new Vector2List(this._uvsArray);

        this._weightedVerticesNormals = desc.weightedVerticesNormals ?? false;

        this._facesNormalsArray = GeometryUtils.computeFacesNormals(this._verticesArray, this._indicesArray, Float32Array);
        this._facesNormals = new Vector3List(this._facesNormalsArray);
        
        this._verticesNormalsArray = GeometryUtils.computeVerticesNormals(this._verticesArray, this._indicesArray, this._weightedVerticesNormals, Float32Array, this._facesNormalsArray);
        this._verticesNormals = new Vector3List(this._verticesNormalsArray);

        this._barycentricsArray = GeometryUtils.computeBarycentrics(this._verticesArray, Float32Array);
        this._barycentrics = new Vector2List(this._barycentricsArray);

        this._distancesArray = GeometryUtils.computeDistances(this._verticesArray, this._indicesArray, Float32Array);
        
        const { tangentsArray, bitangentsArray } = GeometryUtils.computeTangentsAndBitangents(this._verticesArray, this._uvsArray, this._indicesArray, Float32Array);
        this._tangentsArray = tangentsArray;
        this._bitangentsArray = bitangentsArray;
        this._tangents = new Vector3List(this._tangentsArray);
        this._bitangents = new Vector3List(this._bitangentsArray);*/
    }

    /*builder(): GeometryBuilder {
        return new GeometryBuilderBase(this);
    }*/

    /*get indices(): TypedArray {
        return this._indicesArray;
    }

    get vertices(): Vector3List {
        return this._vertices;
    }

    get barycentrics(): Vector2List {
        return this._barycentrics;
    }

    get distances(): TypedArray {
        return this._distancesArray;
    }

    get uvs(): Vector2List {
        return this._uvs;
    }

    get faces(): TriangleList {
        return this._faces;
    }

    get facesNormals(): Vector3List {
        return this._facesNormals;
    }

    get verticesNormals(): Vector3List {
        return this._verticesNormals;
    }

    get tangents(): Vector3List {
        return this._tangents;
    }

    get bitangents(): Vector3List {
        return this._bitangents;
    }

    get boundingBox(): BoundingBox | undefined {
        return this._boundingBox;
    }
    
	get boundingSphere(): BoundingSphere | undefined {
        return this._boundingSphere;
    }*/

    abstract toBuilder(): GeometryBuilder;
    
    /*copy(geometry: GeometryBase): GeometryBase {
        this._verticesArray = geometry._verticesArray.slice();
        this._indicesArray = geometry._indicesArray.slice();
        this._uvsArray = geometry._uvsArray.slice();
        this._facesNormalsArray = geometry._facesNormalsArray.slice();
        this._verticesNormalsArray = geometry._verticesNormalsArray.slice();
        this._tangentsArray = geometry._tangentsArray.slice();
        this._bitangentsArray = geometry._bitangentsArray.slice();

        if (typeof geometry._boundingBox !== 'undefined') {
            this.computeBoundingBox();
        }

        if (typeof geometry._boundingSphere !== 'undefined') {
            this.computeBoundingSphere();
        }

        return this;
    }

    updateVertices(vertices: TypedArray, offset: number = 0): GeometryBase {
        const idxFrom = offset;
        const idxTo = offset + vertices.length;
        this._verticesArray.set(vertices, offset);
        this._updateFacesNormals({idxFrom, idxTo});
        this._updateVerticesNormals(this._weightedVerticesNormals, {idxFrom, idxTo});
        //this._changes.publish({prop: GeometryPropertyKeys.vertices, section: [idxFrom, idxTo]});
        return this;
    }

    updateUvs(uvs: TypedArray, offset: number = 0): GeometryBase {
        const idxFrom = offset;
        const idxTo = offset + uvs.length;
        this._uvsArray.set(uvs, offset);
        if (typeof this._tangents !== 'undefined') {
            this._updateTangentsAndBitangents({idxFrom, idxTo});
        }
        //this._changes.publish({prop: GeometryPropertyKeys.uvs, section: [idxFrom, idxTo]});
        return this;
    }

    clone(): GeometryBase {
        return new GeometryBase({
            vertices: this._verticesArray.slice(),
            indices: this._indicesArray.slice(),
            uvs: this._uvsArray.slice()
        }).copy(this);
    }

    private _updateFacesNormals(options?: {
        idxFrom: number;
        idxTo: number;
    }): GeometryBase {
        GeometryUtils.computeFacesNormals(this._faces,  this._indicesArray, this._facesNormals, options);
        //this._changes.publish({prop: GeometryPropertyKeys.facesNormals, section: [options?.idxFrom || 0, options?.idxTo || this._facesNormals.buffer.length]});
        return this;
    }

    private _updateVerticesNormals(weighted: boolean = false, options?: {
        idxFrom: number;
        idxTo: number;
    }): GeometryBase {
        this._weightedVerticesNormals = weighted;
        if (typeof this.facesNormals === 'undefined') {
            this._updateFacesNormals();
        }
        GeometryUtils.computeVerticesNormals(this._vertices, this._faces, this._indicesArray, this._facesNormals!, this._verticesNormals, weighted, options);
        //this._changes.publish({prop: GeometryPropertyKeys.verticesNormals, section: [options?.idxFrom || 0, options?.idxTo || this._verticesNormals.buffer.length]});
        return this;
    }

    private _updateTangentsAndBitangents(options?: {
        idxFrom: number;
        idxTo: number;
    }): GeometryBase {
        //this._changes.publish({prop: GeometryPropertyKeys.tangents, section: [options?.idxFrom || 0, options?.idxTo || this._tangents.buffer.length]});
        //this._changes.publish({prop: GeometryPropertyKeys.bitangents, section: [options?.idxFrom || 0, options?.idxTo || this._bitangents.buffer.length]});
        GeometryUtils.computeTangentsAndBitangents(this._verticesArray, this._uvsArray, this._indicesArray, this._tangentsArray, this._bitangentsArray, options);
        return this;
    }*/
    
	/*computeBoundingBox(): BoundingBox {
        if (this._boundingBox === undefined) {
            this._boundingBox = new BoundingBox().setFromPoints(this._vertices);
        }
        else {
            this._boundingBox.setFromPoints(this._vertices);
        }
        return this._boundingBox;
    }
    
	computeBoundingSphere(): BoundingSphere {
        if (this._boundingSphere === undefined) {
            this._boundingSphere = new BoundingSphere().setFromPoints(this._vertices);
        }
        else {
            this._boundingSphere.setFromPoints(this._vertices);
        }
        return this._boundingSphere;
    }*/
}