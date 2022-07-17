

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

export { Geometry };
export { GeometryBase };

enum GeometryAttributes {
    VERTICES,
    UVS,
    NORMALS,
    TANGENTS
}

interface GeometryConstructor {
    
}

interface Geometry {

}

class GeometryBase implements Geometry {

    toBuilder(): GeometryBuilder {
        throw new Error("No builder defined.");
    }
}

var Geometry: GeometryConstructor = GeometryBase;