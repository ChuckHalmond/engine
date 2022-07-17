import { BufferDataUsage, Buffer } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";
export { VertexArrayAttributeValue };
export { VertexArrayAttributeProperties };
export { VertexArrayProperties };
export { VertexArrayValues };
export { VertexArray };
export { WebGLVertexArrayUtilities };
export declare enum DrawMode {
    POINTS = 0,
    LINES = 1,
    LINE_LOOP = 2,
    LINE_STRIP = 3,
    TRIANGLES = 4,
    TRIANGLE_STRIP = 5,
    TRIANGLE_FAN = 6
}
export declare enum DataComponentType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    INT = 5124,
    UNSIGNED_INT = 5125,
    FLOAT = 5126
}
export declare enum AttributeDataType {
    VEC2 = "VEC2",
    VEC3 = "VEC3",
    VEC4 = "VEC4"
}
export declare enum ElementArrayDataType {
    UNSIGNED_BYTE = 5121,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125
}
export declare type AttributeArray = Float32Array | Int32Array | Uint32Array | Int16Array | Uint16Array | Int8Array | Uint8Array;
declare type VertexArrayAttributeProperties = {
    array: AttributeArray;
    type: AttributeDataType;
    divisor?: number;
    normalize?: boolean;
    constant?: boolean;
    srcOffset?: number;
    srcLength?: number;
};
declare type VertexArrayAttributeValue = {
    array: AttributeArray;
    srcOffset?: number;
    srcLength?: number;
    constant?: boolean;
};
declare type VertexArrayAttributeSetter = {
    divisor: number;
    componentType: DataComponentType;
    numComponents: number;
    constant: boolean;
    constantValue?: AttributeArray;
    byteOffset: number;
    bytesPerElement: number;
    type: AttributeDataType;
    normalize: boolean;
};
declare type VertexArrayProperties = {
    attributes?: Record<string, VertexArrayAttributeProperties>;
    bufferedAttributes?: {
        buffer?: VertexArrayBuffer | VertexArrayBufferProperties;
        attributes?: Record<string, VertexArrayAttributeProperties>;
    }[];
    indices?: Uint8Array | Uint16Array | Uint32Array;
    bufferedIndices?: {
        buffer?: VertexElementArrayBuffer | VertexElementArrayBufferProperties;
        indices?: Uint8Array | Uint16Array | Uint32Array;
    };
    elementsCount: number;
};
declare type VertexArrayValues = {
    attributes: Record<string, VertexArrayAttributeValue>;
    elementsCount?: number;
};
declare type VertexArray = {
    internalVertexArray: WebGLVertexArrayObject;
    program: Program;
    verticesBuffers: VertexArrayBuffer[];
    elementsCount: number;
    indicesBuffer?: VertexElementArrayBuffer;
};
export declare type VertexArrayBuffer = Buffer & {
    setters: Record<string, VertexArrayAttributeSetter>;
    byteLength: number;
    byteStride: number;
    interleaved: boolean;
};
export declare type VertexArrayBufferProperties = {
    usage?: BufferDataUsage;
    interleaved?: boolean;
};
export declare type VertexElementArrayBuffer = Buffer & {
    indexType: ElementArrayDataType;
};
export declare type VertexElementArrayBufferProperties = {
    usage?: BufferDataUsage;
};
export declare type VertexArrayBufferLayout = Record<string, {
    byteOffset: number;
    bytesPerElement: number;
}>;
declare class WebGLVertexArrayUtilities {
    static getAttributeDataTypeNumComponents(type: AttributeDataType): number;
    static getDataComponentTypeArrayConstructor(type: DataComponentType): typeof Float32Array | typeof Int32Array | typeof Uint32Array | typeof Int16Array | typeof Uint16Array | typeof Int8Array | typeof Uint8Array;
    static getAttributeArrayDataComponentType(array: AttributeArray): DataComponentType;
    static getDataComponentTypeBytesPerElement(type: DataComponentType): number;
    static createVertexElementArrayBuffer(gl: WebGL2RenderingContext, indices: Uint8Array | Uint16Array | Uint32Array): VertexElementArrayBuffer | null;
    static createVertexArrayBuffer(gl: WebGL2RenderingContext, program: Program, attributes: Record<string, VertexArrayAttributeProperties>, usage?: BufferDataUsage, interleaved?: boolean): VertexArrayBuffer | null;
    static setVertexArrayValues(gl: WebGL2RenderingContext, vertexArray: VertexArray, values: VertexArrayValues): void;
    static createVertexArray(gl: WebGL2RenderingContext, program: Program, vertexArray: VertexArrayProperties): VertexArray | null;
    static deleteVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void;
    static drawVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray, mode: DrawMode, instanceCount?: number): void;
    static unbindVertexArray(gl: WebGL2RenderingContext): void;
    static getElementArrayBufferType(indices: Uint8Array | Uint16Array | Uint32Array): ElementArrayDataType;
}
