import { DataType, BufferTarget, BufferDataUsage, BufferIndexType } from "./WebGLConstants";
export { AttributeArray };
export { AttributeIndicesArray };
export { AttributeNumComponents };
export { AttributeProperties };
export { Attribute };
export { AttributesList };
export { AttributeSetter };
export { AttributesListProperties };
export { AttributesSettersList };
export { WebGLAttributeUtilities };
declare type AttributeArray = TypedArray;
declare type AttributeIndicesArray = Uint8Array | Uint16Array | Uint32Array;
declare type AttributeNumComponents = 1 | 2 | 3 | 4;
declare type AttributeProperties<N extends AttributeNumComponents = AttributeNumComponents> = {
    numComponents: N;
    normalized?: boolean;
    srcOffset?: number;
    srcLength?: number;
};
declare type Attribute<A extends AttributeArray = AttributeArray, N extends AttributeNumComponents = AttributeNumComponents> = {
    array: A;
    props: AttributeProperties<N>;
};
declare type AttributesList = {
    list: List<Attribute>;
    indices?: AttributeIndicesArray;
    props?: Partial<AttributesListProperties>;
};
declare type AttributeSetter = {
    location: number;
    bufferBytesOffset: number;
};
declare type AttributesListProperties = {
    instanced: boolean;
    divisor: number;
    target: BufferTarget;
    usage: BufferDataUsage;
};
declare type AttributesSettersList = {
    setters: List<AttributeSetter>;
    props: AttributesListProperties;
    bufferByteLength: number;
    numElements: number;
    hasIndices: boolean;
    indexType: BufferIndexType;
    glVao: WebGLVertexArrayObject;
    glBuffer: WebGLBuffer;
    glIndicesBuffer: WebGLBuffer;
    glProg: WebGLProgram;
};
declare class WebGLAttributeUtilities {
    static getAttributesListSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, list: AttributesList): AttributesSettersList | null;
    static setAttributesListValues(gl: WebGL2RenderingContext, settersList: AttributesSettersList, list: AttributesList): void;
    static bindAttributesList(gl: WebGL2RenderingContext, settersList: AttributesSettersList): void;
    static unbindAttributesList(gl: WebGL2RenderingContext): void;
    static getAttributeArrayDataType(array: AttributeArray): DataType;
    static getDataTypeByteLength(dataType: DataType): number;
    static getAttributeIndicesBufferType(indices: AttributeIndicesArray): BufferIndexType;
    private static getAttributesListNumElements;
}
