import { Vector3 } from "../../../../libs/maths/algebra/vectors/Vector3";
import { TriangleListPool } from "../../../../libs/maths/extensions/pools/lists/TriangleListPools";
import { Vector3ListPool } from "../../../../libs/maths/extensions/pools/lists/Vector3ListPools";
import { Vector3Pool } from "../../../../libs/maths/extensions/pools/Vector3Pools";
import { Triangle } from "../../../../libs/maths/geometry/primitives/Triangle";

export { GeometryUtils };

class GeometryUtils {

    static computeTangentsAndBitangents<C extends new(length: number) => WritableArrayLike<number>>(
        verticesArray: ArrayLike<number>, uvsArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): {
        tangentsArray: InstanceType<C>,
        bitangentsArray: InstanceType<C>
    } {

        const tangentsArray = new type(verticesArray.length);
        const bitangentsArray = new type(verticesArray.length);

        for (let i = 0; i < verticesArray.length; i += 3) {
            const vertStride = 3;
            const p1x = verticesArray[indicesArray[i  ] * vertStride    ],
                p1y = verticesArray[indicesArray[i    ] * vertStride + 1],
                p1z = verticesArray[indicesArray[i    ] * vertStride + 2],
                p2x = verticesArray[indicesArray[i + 1] * vertStride    ],
                p2y = verticesArray[indicesArray[i + 1] * vertStride + 1],
                p2z = verticesArray[indicesArray[i + 1] * vertStride + 2],
                p3x = verticesArray[indicesArray[i + 2] * vertStride    ],
                p3y = verticesArray[indicesArray[i + 2] * vertStride + 1],
                p3z = verticesArray[indicesArray[i + 2] * vertStride + 2];
            
            const edge1x = p2x - p1x,
                edge1y = p2y - p1y,
                edge1z = p2z - p1z;
            
            const edge2x = p3x - p1x,
                edge2y = p3y - p1y,
                edge2z = p3z - p1z;

            const uvStride = 2;

            const deltaUV1x = uvsArray[indicesArray[i + 1] * uvStride    ] - uvsArray[indicesArray[i] * uvStride    ],
                  deltaUV1y = uvsArray[indicesArray[i + 1] * uvStride + 1] - uvsArray[indicesArray[i] * uvStride + 1],
                  deltaUV2x = uvsArray[indicesArray[i + 2] * uvStride    ] - uvsArray[indicesArray[i] * uvStride    ],
                  deltaUV2y = uvsArray[indicesArray[i + 2] * uvStride + 1] - uvsArray[indicesArray[i] * uvStride + 1];

            const r = 1.0 / (deltaUV1x * deltaUV2y - deltaUV1y * deltaUV2x);

            const tx = (edge1x * deltaUV2y - edge2x * deltaUV1y) * r;
            const ty = (edge1y * deltaUV2y - edge2y * deltaUV1y) * r;
            const tz = (edge1z * deltaUV2y - edge2z * deltaUV1y) * r;

            const btx = (edge2x * deltaUV1x - edge1x * deltaUV2x) * r;
            const bty = (edge2y * deltaUV1x - edge1y * deltaUV2x) * r;
            const btz = (edge2z * deltaUV1x - edge1z * deltaUV2x) * r;

            tangentsArray[indicesArray[i] * vertStride   ] = tx;
            tangentsArray[indicesArray[i] * vertStride + 1] = ty;
            tangentsArray[indicesArray[i] * vertStride + 2] = tz;

            tangentsArray[indicesArray[i + 1] * vertStride   ] = tx;
            tangentsArray[indicesArray[i + 1] * vertStride + 1] = ty;
            tangentsArray[indicesArray[i + 1] * vertStride + 2] = tz;

            tangentsArray[indicesArray[i + 2] * vertStride   ] = tx;
            tangentsArray[indicesArray[i + 2] * vertStride + 1] = ty;
            tangentsArray[indicesArray[i + 2] * vertStride + 2] = tz;

            bitangentsArray[indicesArray[i] * vertStride    ] = btx;
            bitangentsArray[indicesArray[i] * vertStride + 1] = bty;
            bitangentsArray[indicesArray[i] * vertStride + 2] = btz;

            bitangentsArray[indicesArray[i + 1] * vertStride    ] = btx;
            bitangentsArray[indicesArray[i + 1] * vertStride + 1] = bty;
            bitangentsArray[indicesArray[i + 1] * vertStride + 2] = btz;

            bitangentsArray[indicesArray[i + 2] * vertStride    ] = btx;
            bitangentsArray[indicesArray[i + 2] * vertStride + 1] = bty;
            bitangentsArray[indicesArray[i + 2] * vertStride + 2] = btz;
        }

        return {
            tangentsArray: tangentsArray as InstanceType<C>,
            bitangentsArray: bitangentsArray as InstanceType<C>,
        };
    }

    static computeFacesNormals<C extends new(length: number) => WritableArrayLike<number>>(verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): InstanceType<C> {
        
        const facesNormalsArray = new type(indicesArray.length);

        const [faces] = TriangleListPool.acquire(1);
        const [facesNormals] = Vector3ListPool.acquire(1);
        const [normal] = Vector3Pool.acquire(1);
        
        faces.setArray(verticesArray);
        facesNormals.setArray(facesNormalsArray);
        
        faces.forIndexedPoints((face: Triangle, idx: number) => {
            face.getNormal(normal);
            facesNormals.set(idx, normal);
        }, indicesArray);

        Vector3Pool.release(1);
        Vector3ListPool.release(1);
        TriangleListPool.release(1);

        return facesNormalsArray as InstanceType<C>;
    }

    static computeBarycentrics<C extends new(length: number) => WritableArrayLike<number>>(verticesArray: ArrayLike<number>, type: C): InstanceType<C> {
        const barycentricsArray = new type(verticesArray.length * (2 / 3));

        for (let i = 0; i < barycentricsArray.length; i += 6) {
            barycentricsArray[i + 2] = 1;
            barycentricsArray[i + 5] = 1;
        }
        
        return barycentricsArray as InstanceType<C>;
    }

    static computeDistances<C extends new(length: number) => WritableArrayLike<number>>(facesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): InstanceType<C> {
        const [faces] = TriangleListPool.acquire(1);
        faces.setArray(facesArray);

        const distancesArray = new type(faces.count * 3);

        faces.forIndexedPoints((face: Triangle, faceIdx: number) => {
            const dist1 = face.point2.distance(face.point1);
            const dist2 = face.point3.distance(face.point2);
            const dist3 = face.point1.distance(face.point3);
            const index = faceIdx * 3;
            distancesArray[index    ] = dist1;
            distancesArray[index + 1] = dist2;
            distancesArray[index + 2] = dist3;
        }, indicesArray);

        TriangleListPool.release(1);
        
        return distancesArray as InstanceType<C>;
    }
    
    static computeVerticesNormals<C extends new(length: number) => WritableArrayLike<number>>(
        verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, weighted: boolean, type: C, facesNormalsArray?: ArrayLike<number>): InstanceType<C> {
        
        const verticesNormalsArray = new type(verticesArray.length);
        
        const [verticesNormals, facesNormals, vertices] = Vector3ListPool.acquire(3);
        const [faces] = TriangleListPool.acquire(1);

        verticesNormals.setArray(verticesNormalsArray);
        vertices.setArray(verticesArray);
        faces.setArray(verticesArray);
        
        facesNormals.setArray(
            facesNormalsArray ? facesNormalsArray : this.computeFacesNormals(verticesArray, indicesArray, type)
        );
        
        const [vertexNormal, faceNormal] = Vector3Pool.acquire(3);
        
        if (weighted) {
            vertices.forEach((vert: Vector3, vertIdx: number) => {
                verticesNormals.get(vertIdx, vertexNormal);
                faces.forIndexedPoints((face: Triangle, faceIdx: number) => {
                    if (face.indexOfPoint(vert) > -1) {
                        facesNormals.get(faceIdx, faceNormal);
                        vertexNormal.add(faceNormal.scale(face.getArea()));
                    }
                }, indicesArray);
                vertexNormal.normalize();
                verticesNormals.set(vertIdx, vertexNormal);
            });
        }
        else {
            faces.forIndexedPoints((face: Triangle, faceIdx: number, pointsIndices: Tuple<number, 3>) => {
                face.getNormal(faceNormal);
                pointsIndices.forEach(point => {
                    verticesNormals.set(point, faceNormal);
                });
            }, indicesArray);
        }
        
        Vector3ListPool.release(3);
        TriangleListPool.release(1);
        Vector3Pool.release(3);

        return verticesNormalsArray as InstanceType<C>;
    }
}