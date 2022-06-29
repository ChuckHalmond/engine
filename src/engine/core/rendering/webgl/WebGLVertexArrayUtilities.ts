import { LogLevel } from "../../logger/Logger";
import { BufferDataUsage, BufferTarget, Buffer } from "./WebGLBufferUtilities";
import { Program, WebGLProgramUtilities } from "./WebGLProgramUtilities";

export { VertexArrayAttributeValue };
export { VertexArrayAttributeProperties };
export { VertexArrayProperties };
export { VertexArrayValues };
export { VertexArray };
export { WebGLVertexArrayUtilities };

export enum DrawMode {
    POINTS = 0x0000,
    LINES = 0x0001,
    LINE_LOOP = 0x0002,
    LINE_STRIP = 0x0003,
    TRIANGLES = 0x0004,
    TRIANGLE_STRIP = 0x0005,
    TRIANGLE_FAN = 0x0006
}

export enum DataComponentType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406
}

export enum AttributeDataType {
    VEC2 = "VEC2",
    VEC3 = "VEC3",
    VEC4 = "VEC4"
}

export enum ElementArrayDataType {
    UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_INT = 0x1405
}

export type AttributeArray =
    Float32Array | Int32Array | Uint32Array |
    Int16Array | Uint16Array |
    Int8Array | Uint8Array;

type VertexArrayAttributeProperties = {
    array: AttributeArray;
    type: AttributeDataType;
    divisor?: number;
    normalize?: boolean;
    constant?: boolean;
}

type VertexArrayAttributeValue = {
    array: AttributeArray;
    srcOffset?: number;
    srcLength?: number;
}

type VertexArrayAttributeSetter = {
    location: number;
    divisor: number;
    componentType: DataComponentType;
    constant: boolean;
    byteOffset: number;
    type: AttributeDataType;
    normalize: boolean;
}

type VertexArrayProperties = {
    attributes: {
        [name: string]: VertexArrayAttributeProperties;
    };
    usage?: BufferDataUsage;
    interleave?: boolean;
    indices?: Uint8Array | Uint16Array | Uint32Array;
    elementsCount: number;
}

type VertexArrayValues = {
    attributes: {
        [name: string]: VertexArrayAttributeValue;
    };
    indices?: Uint8Array | Uint16Array | Uint32Array;
    elementsCount: number;
}

type VertexArray = {
    internal: WebGLVertexArrayObject;
    program: Program;
    attributeSetters: {
        [name: string]: VertexArrayAttributeSetter;
    };
    verticesBuffer: Buffer;
    elementsCount: number;
    indexType?: ElementArrayDataType;
    indicesBuffer?: WebGLBuffer;
}

class WebGLVertexArrayUtilities {

    static getAttributeDataTypeElementsSize(type: AttributeDataType): number {
        switch (type) {
            case AttributeDataType.VEC2:
                return 2;
            case AttributeDataType.VEC3:
                return 3;
            case AttributeDataType.VEC4:
                return 4;
            default:
                throw new Error(`Unsupported AttributeDataType ${type}`);
        }
    }

    static getDataComponentTypeArrayConstructor(type: DataComponentType):
        typeof Float32Array | typeof Int32Array | typeof Uint32Array |
        typeof Int16Array | typeof Uint16Array |
        typeof Int8Array | typeof Uint8Array {
        switch (type) {
            case DataComponentType.FLOAT:
                return Float32Array;
            case DataComponentType.BYTE:
                return Uint8Array;
            case DataComponentType.UNSIGNED_BYTE:
                return Uint8Array;
            case DataComponentType.SHORT:
                return Int16Array;
            case DataComponentType.UNSIGNED_SHORT:
                return Uint16Array;
            case DataComponentType.INT:
                return Int32Array;
            case DataComponentType.UNSIGNED_INT:
                return Uint32Array;
            default:
                throw new Error(`Unsupported DataComponentType ${type}`);
        }
    }

    static getAttributeArrayDataComponentType(array: AttributeArray): DataComponentType {
        if (array instanceof Float32Array) {
            return DataComponentType.FLOAT;
        }
        else if (array instanceof Int32Array) {
            return DataComponentType.INT;
        }
        else if (array instanceof Uint32Array) {
            return DataComponentType.UNSIGNED_INT;
        }
        else if (array instanceof Int16Array) {
            return DataComponentType.SHORT;
        }
        else if (array instanceof Uint16Array) {
            return DataComponentType.UNSIGNED_SHORT;
        }
        else if (array instanceof Int8Array) {
            return DataComponentType.BYTE;
        }
        else if (array instanceof Uint8Array) {
            return DataComponentType.UNSIGNED_BYTE;
        }
        throw new Error(`Unsupported VertexArrayAttributeArray`);
    }

    static getDataComponentTypeBytesPerElement(type: DataComponentType): number {
        switch (type) {
            case DataComponentType.FLOAT:
            case DataComponentType.INT:
            case DataComponentType.UNSIGNED_INT:
                return 4;
            case DataComponentType.SHORT:
            case DataComponentType.UNSIGNED_SHORT:
                return 2;
            case DataComponentType.BYTE:
            case DataComponentType.UNSIGNED_BYTE:
                return 1;
            default:
                throw new Error(`Unsupported DataComponentType ${type}`);
        }
    }

    static createVertexArray(gl: WebGL2RenderingContext, program: Program, vertexArray: VertexArrayProperties): VertexArray | null {
        const {attributes, indices, elementsCount, interleave} = vertexArray;
        let {usage} = vertexArray;

        const internal = gl.createVertexArray();
        if (internal === null) {
            console.error("Could not create WebGLVertexArrayObject.");
            return null;
        }
        gl.bindVertexArray(internal);
            
        const buffer = gl.createBuffer();
        if (buffer == null) {
            console.error("Could not create WebGLBuffer.");
            return null;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        
        const attributesEntries = Object.entries(attributes);
        const byteLength = attributesEntries.reduce(
            (byteLength, [_, attribute]) => byteLength + attribute.array.byteLength, 0
        );

        const data = new ArrayBuffer(byteLength);
        usage = usage ?? gl.STATIC_DRAW;

        const verticesBuffer = {
            internal: buffer,
            target: gl.ARRAY_BUFFER,
            usage, data
        };

        const byteStride = interleave ? attributesEntries.reduce(
            (stride, [_, attribute]) => {
                const {constant} = attribute;
                if (!constant) {
                    const {array, type} = attribute;
                    return stride + array.BYTES_PER_ELEMENT * WebGLVertexArrayUtilities.getAttributeDataTypeElementsSize(type);
                }
                return stride;
            }, 0
        ) : 0;
        const bufferSlices = interleave ? Math.trunc(byteLength / byteStride) : 0;
        let byteOffset = 0;

        const attributeSetters: {
            [name: string]: VertexArrayAttributeSetter;
        } = {};

        attributesEntries.forEach(([attributeName, attribute]) => {
            const {array, type} = attribute;
            let {constant, divisor, normalize} = attribute;
            constant = constant ?? false;

            const location = gl.getAttribLocation(program.internal, attributeName);
            if (location == -1) {
                console.warn(`Attribute ${attributeName} could not be located.`);
                return;
            }
            
            const componentType = this.getAttributeArrayDataComponentType(array);
            const elementsSize = this.getAttributeDataTypeElementsSize(type);
            divisor = divisor ?? 0;
            normalize = normalize ?? false;
            
            gl.vertexAttribPointer(location, elementsSize, componentType, normalize, byteStride, byteOffset);
            if (divisor > 0) {
                gl.vertexAttribDivisor(location, divisor);
            }
            if (constant) {
                switch (elementsSize) {
                    case 1:
                        gl.vertexAttrib1fv(location, array);
                        break;
                    case 2:
                        gl.vertexAttrib2fv(location, array);
                        break;
                    case 3:
                        gl.vertexAttrib3fv(location, array);
                        break;
                    case 4:
                        gl.vertexAttrib4fv(location, array);
                        break;
                }
            }
            else {
                if (interleave) {
                    const {array, type} = attribute;
                    const elementsSize = WebGLVertexArrayUtilities.getAttributeDataTypeElementsSize(type);
                    const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                        WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                    );
                    const {BYTES_PER_ELEMENT} = array;
                    const bufferArray = new bufferArrayConstructor(data, byteOffset);
                    const arrayStrideOffset = byteStride / BYTES_PER_ELEMENT;
                    for (let i = 0; i < bufferSlices; i++) {
                        let arraySliceIndex = i * elementsSize;
                        bufferArray.set(
                            array.slice(
                                arraySliceIndex,
                                arraySliceIndex + elementsSize
                            ),
                            i * arrayStrideOffset
                        );
                    }
                    byteOffset += elementsSize * BYTES_PER_ELEMENT;
                }
                else {
                    const {array} = attribute;
                    const {byteLength} = array;
                    const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                        WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                    );
                    const bufferArray = new bufferArrayConstructor(data, byteOffset);
                    bufferArray.set(array);
                    byteOffset += byteLength;
                }
                gl.enableVertexAttribArray(location);
            }
            attributeSetters[attributeName] = {
                location,
                componentType,
                type,
                normalize,
                constant,
                divisor,
                byteOffset
            };
        });

        gl.bufferData(gl.ARRAY_BUFFER, data, usage);

        let indicesBuffer: WebGLBuffer | null | undefined = void 0;
        let indexType: ElementArrayDataType | undefined = void 0;
        if (indices !== void 0) {
            indexType = this.getElementArrayBufferType(indices);
            indicesBuffer = gl.createBuffer();
            if (indicesBuffer == null) {
                console.error("Could not create WebGLBuffer.");
                return null;
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        }

        return {
            attributeSetters,
            verticesBuffer,
            indicesBuffer,
            program,
            internal,
            elementsCount,
            indexType
        };
    }

    static deleteVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void {
        const {internal} = vertexArray;
        if (gl.isVertexArray(internal)) {
            gl.deleteVertexArray(internal);
        }
    }

    static drawVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray, mode: DrawMode, instanceCount?: number): void {
        const {program, internal, indexType, elementsCount} = vertexArray;

        WebGLProgramUtilities.useProgram(gl, program);
        
        const currentVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        if (currentVertexArray !== internal) {
            gl.bindVertexArray(internal);
        }
        
        if (indexType !== void 0) {
            if (instanceCount !== void 0) {
                gl.drawElementsInstanced(mode, elementsCount, indexType, 0, instanceCount);
            }
            else {
                gl.drawElements(mode, elementsCount, indexType, 0);
            }
        }
        else {
            if (instanceCount !== void 0) {
                gl.drawArraysInstanced(mode, 0, elementsCount, instanceCount);
            }
            else {
                gl.drawArrays(mode, 0, elementsCount);
            }
        }
    }

    static setVertexArrayAttributeValue(gl: WebGL2RenderingContext, vertexArray: VertexArray, attributeName: string, value: VertexArrayAttributeValue) {
        const {attributeSetters, verticesBuffer} = vertexArray;
        const attributeSetter = attributeSetters[attributeName];
        const {internal} = verticesBuffer;
        const {array} = value;

        const currentArrayBufferBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
        if (currentArrayBufferBinding !== internal) {
            gl.bindBuffer(gl.ARRAY_BUFFER, internal);
        }

        let {srcOffset, srcLength} = value;
        srcOffset = srcOffset ?? 0;

        if (attributeSetter !== void 0) {
            const {byteOffset} = attributeSetter;
            gl.bufferSubData(gl.ARRAY_BUFFER, byteOffset, array, srcOffset, srcLength);
        }
        else {
            console.warn(`Attribute ${attributeName} does not exist in the setters.`);
        }
    }

    static setVertexArrayValues(gl: WebGL2RenderingContext, vertexArray: VertexArray, values: VertexArrayValues): void {
        const {indicesBuffer} = vertexArray;
        const {attributes, indices, elementsCount} = values;

        Object.entries(attributes).forEach(([attributeName, attribute]) => {
            this.setVertexArrayAttributeValue(gl, vertexArray, attributeName, attribute);
        });

        Object.assign(vertexArray, {elementsCount});

        if (indices !== void 0 && indicesBuffer !== void 0) {
            const currentElementArrayBufferBinding = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
            if (currentElementArrayBufferBinding !== indicesBuffer) {
                gl.bindBuffer(BufferTarget.ELEMENT_ARRAY_BUFFER, indicesBuffer);
            }
            gl.bufferSubData(BufferTarget.ELEMENT_ARRAY_BUFFER, 0, indices);
        }
    }

    static unbindVertexArray(gl: WebGL2RenderingContext): void {
        gl.bindVertexArray(null);
    }

    static getElementArrayBufferType(indices: Uint8Array | Uint16Array | Uint32Array): ElementArrayDataType {
        if (indices instanceof Uint8Array) {
            return ElementArrayDataType.UNSIGNED_BYTE;
        }
        else if (indices instanceof Uint16Array) {
            return ElementArrayDataType.UNSIGNED_SHORT;
        }
        else {
            return ElementArrayDataType.UNSIGNED_INT;
        }
    }
}