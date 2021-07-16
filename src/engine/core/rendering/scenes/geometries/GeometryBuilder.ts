import { Geometry, GeometryBase } from "engine/core/rendering/scenes/geometries/Geometry";
import { GeometryUtils } from "engine/core/rendering/scenes/geometries/GeometryUtils";
import { TriangleList } from "engine/libs/maths/extensions/lists/TriangleList";
import { Vector2List } from "engine/libs/maths/extensions/lists/Vector2List";
import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";

export { GeometryBuilder };
export { GeometryBuilderBase };

interface GeometryVertices {
    vertices: Vector3List;
    faces: TriangleList;
}

interface GeometryIndices {
    indices: TypedArray;
}

interface GeometryUvs {
    uvs: Vector2List;
}

interface GeometryFacesNormals {
    facesNormals: Vector3List;
}

interface GeometryVerticesNormals {
    verticesNormals: Vector3List;
}

interface GeometryTangentsAndBitangents {
    tangents: Vector3List;
    bitangents: Vector3List;
}

interface GeometryBuilder<G extends PartialGeometry = PartialGeometry> {
    
    //vertices(vertices: TypedArray): GeometryBuilder<G & GeometryVertices>;
    //indices(indices: TypedArray): GeometryBuilder<G & GeometryIndices>;

    //uvs(uvs: TypedArray): GeometryBuilder<G & GeometryUvs>;
    /*facesNormals(): GeometryBuilder<G & GeometryFacesNormals>;
    verticesNormals(weighted?: boolean): GeometryBuilder<G & GeometryVerticesNormals>;
    tangentsAndBitangents(): GeometryBuilder<G & GeometryTangentsAndBitangents>;*/


    attribute<S extends string, C extends new(array: WritableArrayLike<number>) => any>(name: S, array: WritableArrayLike<number>, container: C): GeometryBuilder<G & {[K in S]: InstanceType<C>}>;

    build(): G;

}

interface GeometryBuilderConstructor<G extends Geometry = Geometry> {
    fromFaces(): GeometryBuilder;
    fromVertices(): GeometryBuilder;
    fromIndexedVertices(): GeometryBuilder;
    fromPreset(): GeometryBuilder;
}

interface PartialGeometry extends Partial<Geometry> {};

class GeometryBuilderBase<G extends PartialGeometry> implements GeometryBuilder<G> {
    private geometry: G;

    constructor(geometry: G) {
        this.geometry = geometry;
    }

    public attribute<S extends string, C extends new(array: WritableArrayLike<number>) => any>(name: S, array: WritableArrayLike<number>, container: C): GeometryBuilder<G & {[K in S]: InstanceType<C>}> {
        this.geometry = Object.assign(this.geometry, {
            [name]: new container(array)
        });

        return this;
    }

    /*public vertices(vertices: TypedArray): GeometryBuilder<G & GeometryVertices> {
        this.geometry.vertices = new Vector3List(vertices);
        this.geometry.faces = new TriangleList(vertices);

        return this as GeometryBuilder<G & GeometryVertices>;
    }*/

    /*public indices(indices: TypedArray): GeometryBuilder<G & GeometryIndices> {
        this.geometry = Object.assign(this.geometry, {
            indices: indices
        });

        return this;
    }

    public uvs(uvs: TypedArray): GeometryBuilder<G & GeometryUvs> {
        this.geometry.uvs = new Vector2List(uvs);

        return this as GeometryBuilder<G & GeometryUvs>;
    }*/
    
    /*public facesNormals(): GeometryBuilder<G & GeometryFacesNormals> {
        if (!this.geometry.indices || !this.geometry.faces) {
            throw new Error();
        }

        const facesNormals = new Vector3List(new Float32Array(this.geometry.indices));
        this.geometry.facesNormals = GeometryUtils.computeFacesNormals(this.geometry.faces, this.geometry.indices, facesNormals);

        return this as GeometryBuilder<G & GeometryFacesNormals>;
    }

    public verticesNormals(weighted: boolean = false): GeometryBuilder<G & GeometryVerticesNormals> {
        if (!this.geometry.indices || !this.geometry.faces || !this.geometry.vertices) {
            throw new Error();
        }
        const verticesNormals = new Vector3List(new Float32Array(this.geometry.indices.length));
        this.geometry.verticesNormals = GeometryUtils.computeVerticesNormals(
            this.geometry.vertices, this.geometry.faces, this.geometry.indices, this.geometry.facesNormals!, verticesNormals, weighted
        );

        return this as GeometryBuilder<G & GeometryVerticesNormals>;
    }

    public tangentsAndBitangents(): GeometryBuilder<G & GeometryTangentsAndBitangents> {
        if (!this.geometry.indices || !this.geometry.uvs || !this.geometry.vertices) {
            throw new Error();
        }

        const tangents = new Vector3List(new Float32Array(this.geometry.indices.length));
        const bitangents = new Vector3List(new Float32Array(this.geometry.indices.length));
        
        GeometryUtils.computeTangentsAndBitangents(
            this.geometry.vertices, this.geometry.uvs, this.geometry.indices, tangents, bitangents
        );

        this.geometry.tangents = tangents;
        this.geometry.bitangents = bitangents;
        
        return this as GeometryBuilder<G & GeometryTangentsAndBitangents>;
    }*/

    public build(): G  {
        return this.geometry;
    }
}

//new GeometryBuilderBase(new GeometryBase()).attribute('indices', new Float32Array(), Vector2List).build().indices