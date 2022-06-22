import { DataType, BufferTarget, BufferDataUsage, BufferIndexType } from "./WebGLConstants";
export { Attribute };
export { AttributesList };
export { AttributeSetter };
export { AttributesListProperties };
export { AttributesSettersList };
export { WebGLAttributeUtilities };
declare type Attribute = {
    array: Float64Array | Float32Array | Int32Array | Uint32Array | Int16Array | Uint16Array | Int8Array | Uint8Array | Uint8ClampedArray;
    props: {
        numComponents: 1 | 2 | 3 | 4;
        normalized?: boolean;
        srcOffset?: number;
        srcLength?: number;
    };
};
declare type AttributesList = {
    list: {
        [name: string]: Attribute;
    };
    indices?: Uint8Array | Uint16Array | Uint32Array;
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
    setters: {
        [name: string]: AttributeSetter;
    };
    props: AttributesListProperties;
    bufferByteLength: number;
    numElements: number;
    hasIndices: boolean;
    indexType: BufferIndexType;
    glVertexArray: WebGLVertexArrayObject;
    glBuffer: WebGLBuffer;
    glIndicesBuffer: WebGLBuffer;
    glProgram: WebGLProgram;
};
declare class WebGLAttributeUtilities {
    static getAttributesListSetter(gl: WebGL2RenderingContext, glProgram: WebGLProgram, attributes: AttributesList): AttributesSettersList | null;
    static deleteAttributesList(gl: WebGL2RenderingContext, settersList: AttributesSettersList): void;
    static setAttributesListValues(gl: WebGL2RenderingContext, settersList: AttributesSettersList, attributes: AttributesList): void;
    static bindAttributesList(gl: WebGL2RenderingContext, settersList: AttributesSettersList): void;
    static unbindAttributesList(gl: WebGL2RenderingContext): void;
    static getAttributeArrayDataType(array: Float64Array | Float32Array | Int32Array | Uint32Array | Int16Array | Uint16Array | Int8Array | Uint8Array | Uint8ClampedArray): DataType;
    static getDataTypeByteLength(dataType: DataType): number;
    static getAttributeIndicesBufferType(indices: Uint8Array | Uint16Array | Uint32Array): BufferIndexType;
    private static getAttributesListNumElements;
}
