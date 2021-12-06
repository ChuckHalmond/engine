export { GeometryUtils };
declare class GeometryUtils {
    static computeTangentsAndBitangents<C extends (new (length: number) => WritableArrayLike<number>)>(verticesArray: ArrayLike<number>, uvsArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): {
        tangentsArray: InstanceType<C>;
        bitangentsArray: InstanceType<C>;
    };
    static computeFacesNormals<C extends (new (length: number) => WritableArrayLike<number>)>(verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, type: C): InstanceType<C>;
    static computeVerticesNormals<C extends (new (length: number) => WritableArrayLike<number>)>(verticesArray: ArrayLike<number>, indicesArray: ArrayLike<number>, weighted: boolean, type: C, facesNormalsArray?: ArrayLike<number>): InstanceType<C>;
}
