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
export declare enum ArrayDataType {
    BYTE = 5120,
    UNSIGNED_BYTE = 5121,
    SHORT = 5122,
    UNSIGNED_SHORT = 5123,
    INT = 5124,
    UNSIGNED_INT = 5125,
    FLOAT = 5126,
    HALF_FLOAT = 5131
}
export declare enum ElementArrayDataType {
    UNSIGNED_BYTE = 5121,
    UNSIGNED_SHORT = 5123,
    UNSIGNED_INT = 5125
}
declare type VertexArrayAttributeArray = Float32Array | Int32Array | Uint32Array | Int16Array | Uint16Array | Int8Array | Uint8Array | Uint8ClampedArray;
declare type VertexArrayAttributeProperties = {
    array: VertexArrayAttributeArray;
    numComponents: 1 | 2 | 3 | 4;
    stride?: number;
    offset?: number;
    divisor?: number;
    normalize?: boolean;
    usage?: BufferDataUsage;
    byteLength?: number;
    constant?: boolean;
    srcOffset?: number;
    srcLength?: number;
};
declare type VertexArrayAttributeValue = {
    array: VertexArrayAttributeArray;
    srcOffset?: number;
    srcLength?: number;
};
declare type VertexArrayAttributeSetter = {
    bufferIndex: number;
    location: number;
    divisor: number;
    stride: number;
    constant: boolean;
    offset: number;
    numComponents: number;
    normalize: boolean;
    bufferBytesOffset: number;
};
declare type VertexArrayProperties = {
    attributes: {
        [name: string]: VertexArrayAttributeProperties;
    };
    indices?: Uint8Array | Uint16Array | Uint32Array;
    numElements: number;
};
declare type VertexArrayValues = {
    attributes: {
        [name: string]: VertexArrayAttributeValue;
    };
    indices?: Uint8Array | Uint16Array | Uint32Array;
    numElements: number;
};
declare type VertexArray = {
    internal: WebGLVertexArrayObject;
    program: Program;
    attributeSetters: {
        [name: string]: VertexArrayAttributeSetter;
    };
    verticesBuffers: Buffer[];
    numElements: number;
    indexType?: ElementArrayDataType;
    indicesBuffer?: WebGLBuffer;
};
declare class WebGLVertexArrayUtilities {
    static getAttributeDataType(attribute: VertexArrayAttributeProperties): ArrayDataType;
    static createVertexArray(gl: WebGL2RenderingContext, program: Program, vertexArray: VertexArrayProperties): VertexArray | null;
    static deleteVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void;
    static drawVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray, mode: DrawMode, instanceCount?: number): void;
    static setVertexArrayAttributeValue(gl: WebGL2RenderingContext, vertexArray: VertexArray, attributeName: string, value: VertexArrayAttributeValue): void;
    static setVertexArrayValues(gl: WebGL2RenderingContext, vertexArray: VertexArray, values: VertexArrayValues): void;
    static unbindVertexArray(gl: WebGL2RenderingContext): void;
    static getElementArrayBufferType(indices: Uint8Array | Uint16Array | Uint32Array): ElementArrayDataType;
}
