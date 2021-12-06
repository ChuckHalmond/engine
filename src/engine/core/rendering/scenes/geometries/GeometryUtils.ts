import { Vector3 } from "../../../../libs/maths/algebra/vectors/Vector3";
import { TriangleListPool } from "../../../../libs/maths/extensions/pools/lists/TriangleListPools";
import { Vector3ListPool } from "../../../../libs/maths/extensions/pools/lists/Vector3ListPools";
import { Vector3Pool } from "../../../../libs/maths/extensions/pools/Vector3Pools";
import { Triangle } from "../../../../libs/maths/geometry/primitives/Triangle";

export { GeometryUtils };

class GeometryUtils {

    public static computeTangentsAndBitangents<C extends (new(length: number) => WritableArrayLike<number>)>(
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

    public static computeFacesNormals<C extends (new(length: number) => WritableArrayLike<number>)>(verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): InstanceType<C> {
        
        const facesNormalsArray = new type(indicesArray.length);

        let faces = TriangleListPool.acquire().setArray(verticesArray);
        let facesNormals = Vector3ListPool.acquire().setArray(facesNormalsArray);
        let normal = Vector3Pool.acquire();
        
        faces.forIndexedPoints((face: Triangle, idx: number) => {
            face.getNormal(normal);
            facesNormals.set(idx, normal);
        }, indicesArray);

        Vector3Pool.release(1);
        Vector3ListPool.release(1);
        TriangleListPool.release(1);

        return facesNormalsArray as InstanceType<C>;
    }
    
    public static computeVerticesNormals<C extends (new(length: number) => WritableArrayLike<number>)>(
        verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, weighted: boolean, type: C, facesNormalsArray?: ArrayLike<number>): InstanceType<C> {
        
        const verticesNormalsArray = new type(verticesArray.length);
        
        let verticesNormals = Vector3ListPool.acquire().setArray(verticesNormalsArray);
        let vertices = Vector3ListPool.acquire().setArray(verticesArray);
        let faces = TriangleListPool.acquire().setArray(verticesArray);

        let facesNormals = Vector3ListPool.acquire().setArray(
            facesNormalsArray ?  facesNormalsArray : this.computeFacesNormals(verticesArray, indicesArray, type)
        );
        
        Vector3Pool.acquireTemp(2, (vertexNormalsSum, faceNormal) => {
            if (weighted) {
                vertices.forEach((vert: Vector3, vertIdx: number) => {
                    verticesNormals.get(vertIdx, vertexNormalsSum);
                    
                    faces.forIndexedPoints((face: Triangle, faceIdx: number) => {
                        if (face.indexOfPoint(vert) > -1) {
                            facesNormals.get(faceIdx, faceNormal);
                            vertexNormalsSum.add(faceNormal.multScalar(face.getArea()));
                        }
                    }, indicesArray);

                    vertexNormalsSum.normalize();
                    verticesNormals.set(vertIdx, vertexNormalsSum);
                });
            }
            else {
                faces.forIndexedPoints((face: Triangle, faceIdx: number, pointsIndices: Tuple<number, 3>) => {
                    face.getNormal(faceNormal);
                    verticesNormals.set(pointsIndices[0], faceNormal);
                    verticesNormals.set(pointsIndices[1], faceNormal);
                    verticesNormals.set(pointsIndices[2], faceNormal);
                }, indicesArray);
            }
        });

        return verticesNormalsArray as InstanceType<C>;
    }
}