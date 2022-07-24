import { BufferDataUsage, Buffer } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";
export { VertexAttributeValue };
export { VertexAttributeProperties };
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
declare type VertexAttributeProperties = {
    type: AttributeDataType;
    array?: AttributeArray;
    componentType?: DataComponentType;
    byteLength?: number;
    buffer?: number;
    divisor?: number;
    normalize?: boolean;
    constant?: boolean;
    srcOffset?: number;
    srcLength?: number;
};
declare type VertexAttributeValue = {
    array: AttributeArray;
    srcOffset?: number;
    srcLength?: number;
    constant?: boolean;
};
declare type VertexAttribute = {
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
    vertexBuffers?: (VertexArrayBuffer | VertexArrayBufferProperties)[];
    vertexAttributes?: Record<string, VertexAttributeProperties>;
    elementBuffer?: VertexElementArrayBuffer | VertexElementArrayBufferProperties;
    elementIndices?: Uint8Array | Uint16Array | Uint32Array;
    drawMode?: DrawMode;
    elementsCount?: number;
    instanceCount?: number;
    multiDraw?: {
        firstsList?: Iterable<number> | Int32Array;
        firstsOffset?: number;
        countsList?: Iterable<number> | Int32Array;
        countsOffset?: number;
        offsetsList?: Iterable<number> | Int32Array;
        offsetsOffset?: number;
        instanceCountsList?: Iterable<number> | Int32Array;
        instanceCountsOffset?: number;
        drawCount?: number;
    };
};
declare type VertexArrayValues = {
    attributes: Record<string, VertexAttributeValue>;
    drawMode?: DrawMode;
    elementsCount?: number;
    instanceCount?: number;
};
declare type VertexArray = {
    internalVertexArray: WebGLVertexArrayObject;
    program: Program;
    verticesBuffers: VertexArrayBuffer[];
    elementsCount: number;
    elementBuffer?: VertexElementArrayBuffer;
    drawMode: DrawMode;
    instanceCount: number;
    multiDraw?: {
        firstsList?: Iterable<number> | Int32Array;
        firstsOffset?: number;
        countsList?: Iterable<number> | Int32Array;
        countsOffset?: number;
        offsetsList?: Iterable<number> | Int32Array;
        offsetsOffset?: number;
        instanceCountsList?: Iterable<number> | Int32Array;
        instanceCountsOffset?: number;
        drawCount?: number;
    };
};
export declare type VertexArrayBuffer = Buffer & {
    vertexAttributes: Record<string, VertexAttribute>;
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
    #private;
    static getDataTypeNumComponents(type: AttributeDataType): number;
    static getComponentTypeArrayConstructor(type: DataComponentType): Float32ArrayConstructor | Int32ArrayConstructor | Uint32ArrayConstructor | Int16ArrayConstructor | Uint16ArrayConstructor | Int8ArrayConstructor | Uint8ArrayConstructor;
    static getArrayComponentType(array: AttributeArray): DataComponentType;
    static createVertexElementArrayBuffer(gl: WebGL2RenderingContext, indices: Uint8Array | Uint16Array | Uint32Array): VertexElementArrayBuffer | null;
    static createVertexArrayBuffer(gl: WebGL2RenderingContext, program: Program, attributes: Record<string, VertexAttributeProperties>, usage?: BufferDataUsage, interleaved?: boolean): VertexArrayBuffer | null;
    static setVertexArrayValues(gl: WebGL2RenderingContext, vertexArray: VertexArray, values: VertexArrayValues): void;
    static setVertexArrayBufferData(gl: WebGL2RenderingContext, buffer: VertexArrayBuffer | VertexElementArrayBuffer, data: ArrayBufferView, dstByteOffset?: number, srcOffset?: number, length?: number): void;
    static createVertexArray(gl: WebGL2RenderingContext, program: Program, vertexArray: VertexArrayProperties): VertexArray | null;
    static deleteVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void;
    static enableMultidrawExtension(gl: WebGL2RenderingContext): void;
    static drawVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void;
    static unbindVertexArray(gl: WebGL2RenderingContext): void;
    static getElementArrayBufferType(indices: Uint8Array | Uint16Array | Uint32Array): ElementArrayDataType;
}
