import { BufferDataUsage, Buffer } from "./WebGLBufferUtilities";
import { Program, WebGLProgramUtilities } from "./WebGLProgramUtilities";

export { VertexAttributeValue };
export { VertexAttributeProperties };
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

type VertexAttributeProperties = {
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
}

type VertexAttributeValue = {
    array: AttributeArray;
    srcOffset?: number;
    srcLength?: number;
    constant?: boolean;
}

type VertexAttribute = {
    divisor: number;
    componentType: DataComponentType;
    numComponents: number;
    constant: boolean;
    constantValue?: AttributeArray;
    byteOffset: number;
    bytesPerElement: number;
    type: AttributeDataType;
    normalize: boolean;
}

type VertexArrayProperties = {
    vertexBuffers?: (VertexArrayBuffer | VertexArrayBufferProperties)[];
    vertexAttributes?: Record<string, VertexAttributeProperties>;
    elementBuffer?: VertexElementArrayBuffer | VertexElementArrayBufferProperties;
    elementIndices?: Uint8Array | Uint16Array | Uint32Array;
    elementsCount: number;
}

type VertexArrayValues = {
    attributes: Record<string, VertexAttributeValue>;
    elementsCount?: number;
}

type VertexArray = {
    internalVertexArray: WebGLVertexArrayObject;
    program: Program;
    verticesBuffers: VertexArrayBuffer[];
    elementsCount: number;
    elementBuffer?: VertexElementArrayBuffer;
}

export type VertexArrayBuffer = Buffer & {
    vertexAttributes: Record<string, VertexAttribute>;
    byteLength: number;
    byteStride: number;
    interleaved: boolean;
}

export type VertexArrayBufferProperties = {
    usage?: BufferDataUsage;
    interleaved?: boolean;
}

export type VertexElementArrayBuffer = Buffer & {
    indexType: ElementArrayDataType;
};

export type VertexElementArrayBufferProperties = {
    usage?: BufferDataUsage;
}

export type VertexArrayBufferLayout = Record<string, {
    byteOffset: number;
    bytesPerElement: number;
}>;

class WebGLVertexArrayUtilities {

    static getAttributeDataTypeNumComponents(type: AttributeDataType): number {
        switch (type) {
            case AttributeDataType.VEC2:
                return 2;
            case AttributeDataType.VEC3:
                return 3;
            case AttributeDataType.VEC4:
                return 4;
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
        else {
            return DataComponentType.UNSIGNED_BYTE;
        }
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

    static createVertexElementArrayBuffer(gl: WebGL2RenderingContext, indices: Uint8Array | Uint16Array | Uint32Array): VertexElementArrayBuffer | null {
        const internalBuffer = gl.createBuffer();
        if (internalBuffer === null) {
            return null;
        }
        const usage = BufferDataUsage.STATIC_READ;
        const target = gl.ELEMENT_ARRAY_BUFFER;
        const indexType = this.getElementArrayBufferType(indices);

        gl.bindBuffer(target, internalBuffer);
        gl.bufferData(target, indices, usage);

        return {
            internalBuffer,
            target,
            usage,
            indexType
        };
    }

    static createVertexArrayBuffer(gl: WebGL2RenderingContext, program: Program, attributes: Record<string, VertexAttributeProperties>, usage?: BufferDataUsage, interleaved?: boolean): VertexArrayBuffer | null {
        const {internalProgram} = program;

        const DEFAULT_USAGE = BufferDataUsage.STATIC_READ;
        const DEFAULT_INTERLEAVED = false;
        interleaved = interleaved ?? DEFAULT_INTERLEAVED;
        usage = usage ?? DEFAULT_USAGE;

        const attributesEntries = attributes ? Object.entries(attributes) : null;
        const byteLength = (attributesEntries !== null) ? attributesEntries.reduce(
            (byteLength, [_, attribute]) => byteLength + (attribute.array?.byteLength ?? attribute.byteLength ?? 0), 0
        ) : 0;
        
        const internalBuffer = gl.createBuffer();
        if (internalBuffer === null) {
            return null;
        }

        const target = gl.ARRAY_BUFFER;
        gl.bindBuffer(target, internalBuffer);
        const dataBuffer = new ArrayBuffer(byteLength);
        let byteStride = 0;

        const vertexAttributes: Record<string, VertexAttribute> = {};
        if (attributesEntries !== null) {

            attributesEntries.forEach(([_, attribute]) => {
                const {array, componentType, byteLength} = attribute;
                if (!array && !(componentType && byteLength)) {
                    throw new Error("Every attribute requires either an array or a componentType and a byteLength");
                }
            });

            byteStride = interleaved ? attributesEntries.reduce(
                (stride, [_, attribute]) => {
                    const {constant} = attribute;
                    if (!constant) {
                        const {array, type, componentType} = attribute;
                        const bytesPerElement = array?.BYTES_PER_ELEMENT ?? this.getDataComponentTypeBytesPerElement(componentType!);
                        const numComponents = WebGLVertexArrayUtilities.getAttributeDataTypeNumComponents(type);
                        return stride + bytesPerElement * numComponents;
                    }
                    return stride;
                }, 0
            ) : 0;
            const bufferSlices = interleaved ? Math.trunc(byteLength / byteStride) : 0;
            let byteOffset = 0;
            let constantValue: AttributeArray | undefined;
    
            attributesEntries.forEach(([attributeName, attribute]) => {
                const {array, type} = attribute;
                let {constant, divisor, normalize, componentType} = attribute;
                constant = constant ?? false;
    
                const location = gl.getAttribLocation(internalProgram, attributeName);
                if (location == -1) {
                    console.warn(`Attribute ${attributeName} could not be located.`);
                    return;
                }
                
                componentType = array ? this.getAttributeArrayDataComponentType(array) : componentType!;

                const numComponents = this.getAttributeDataTypeNumComponents(type);
                divisor = divisor ?? 0;
                normalize = normalize ?? false;
                
                gl.vertexAttribPointer(location, numComponents, componentType, normalize, byteStride, byteOffset);
                if (divisor > 0) {
                    gl.vertexAttribDivisor(location, divisor);
                }
                if (constant) {
                    if (!array) {
                        throw new Error("constant flag requires an array parameter");
                    }
                    constantValue = array;
                    switch (numComponents) {
                        case 1:
                            gl.vertexAttrib1fv(location, constantValue);
                            break;
                        case 2:
                            gl.vertexAttrib2fv(location, constantValue);
                            break;
                        case 3:
                            gl.vertexAttrib3fv(location, constantValue);
                            break;
                        case 4:
                            gl.vertexAttrib4fv(location, constantValue);
                            break;
                    }
                }
                else {
                    if (!constant) {
                        const {array, type} = attribute;
                        const numComponents = WebGLVertexArrayUtilities.getAttributeDataTypeNumComponents(type);
                        let byteLength = 0;
                        let bytesPerElement = 0;
                        if (interleaved) {
                            if (array) {
                                ({BYTES_PER_ELEMENT: bytesPerElement, byteLength} = array);
                                const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                                    WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                                );
                                const bufferArray = new bufferArrayConstructor(dataBuffer, byteOffset);
                                const arrayStrideOffset = byteStride / bytesPerElement;
                                for (let i = 0; i < bufferSlices; i++) {
                                    let arraySliceIndex = i * numComponents;
                                    bufferArray.set(
                                        array.slice(
                                            arraySliceIndex,
                                            arraySliceIndex + numComponents
                                        ),
                                        i * arrayStrideOffset
                                    );
                                }
                            }
                            else {
                                bytesPerElement = this.getDataComponentTypeBytesPerElement(componentType!);
                                byteLength = attribute.byteLength!;
                            }
                        }
                        else {
                            if (array) {
                                ({BYTES_PER_ELEMENT: bytesPerElement, byteLength} = array);
                                const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                                    WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                                );
                                const bufferArray = new bufferArrayConstructor(dataBuffer, byteOffset);
                                bufferArray.set(array);
                            }
                            else {
                                bytesPerElement = this.getDataComponentTypeBytesPerElement(componentType!);
                                byteLength = attribute.byteLength!;
                            }
                        }
                        vertexAttributes[attributeName] = {
                            constantValue,
                            numComponents,
                            divisor,
                            componentType,
                            constant,
                            byteOffset,
                            bytesPerElement,
                            type,
                            normalize
                        };
                        byteOffset += interleaved ? bytesPerElement * numComponents : byteLength;
                    }
                    gl.enableVertexAttribArray(location);
                }
            });
        }
        gl.bufferData(target, dataBuffer, usage);
        return {
            internalBuffer,
            target,
            usage,
            interleaved,
            byteStride,
            byteLength,
            vertexAttributes
        };
    }

    static setVertexArrayValues(gl: WebGL2RenderingContext, vertexArray: VertexArray, values: VertexArrayValues): void {
        const {attributes, elementsCount} = values;

        const attributesNames = Object.keys(attributes);
        attributesNames.forEach((attributeName) => {
            const {verticesBuffers} = vertexArray;
            const verticesBuffer = verticesBuffers.find(
                (verticesBuffer) => attributeName in verticesBuffer.vertexAttributes
            );
            if (verticesBuffer) {
                const {internalBuffer, target, byteStride, interleaved, vertexAttributes} = verticesBuffer;
                const currentArrayBufferBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
                if (currentArrayBufferBinding !== internalBuffer) {
                    gl.bindBuffer(target, internalBuffer);
                }
                
                const attribute = attributes[attributeName];
                const {byteOffset, bytesPerElement} = vertexAttributes[attributeName];
                const {array} = attribute;
                const {length, BYTES_PER_ELEMENT} = array;
                const elementsCount = bytesPerElement / BYTES_PER_ELEMENT;
                let {srcOffset, srcLength} = attribute;
                srcOffset = srcOffset ?? 0;
                srcLength = srcLength ?? length;
                let dstOffset = byteOffset;
                if (interleaved) {
                    const slices = interleaved ? Math.trunc(srcLength / elementsCount) : 0;
                    for (let i = 0; i < slices; i++) {
                        gl.bufferSubData(target, dstOffset, array, srcOffset, elementsCount);
                        srcOffset += elementsCount;
                        dstOffset += byteStride;
                    }
                }
                else {
                    gl.bufferSubData(target, dstOffset, array, srcOffset, srcLength);
                }
            }
        });

        if (elementsCount !== undefined) {
            vertexArray.elementsCount = elementsCount;
        }
    }

    static setVertexArrayBufferData(gl: WebGL2RenderingContext, buffer: VertexArrayBuffer | VertexElementArrayBuffer, data: ArrayBufferView, dstByteOffset?: number, srcOffset?: number, length?: number): void {
        const {internalBuffer, target} = buffer;
        gl.bindBuffer(target, internalBuffer);
        dstByteOffset = dstByteOffset ?? 0;
        srcOffset = srcOffset ?? 0;
        gl.bufferSubData(target, dstByteOffset, data, srcOffset, length);
    }

    static createVertexArray(gl: WebGL2RenderingContext, program: Program, vertexArray: VertexArrayProperties): VertexArray | null {
        const {vertexAttributes, vertexBuffers, elementIndices, elementBuffer: elementBufferOrBufferProperties, elementsCount} = vertexArray;
        const internalVertexArray = gl.createVertexArray();
        if (internalVertexArray === null) {
            return null;
        }
        gl.bindVertexArray(internalVertexArray);

        const attributesEntries = vertexAttributes ? Object.entries(vertexAttributes) : [];
        
        const {internalProgram} = program;
        const verticesBuffers: VertexArray["verticesBuffers"] = [];
        if (vertexBuffers) {
            vertexBuffers.forEach((buffer_i, i) => {
                const attributes = Object.fromEntries(attributesEntries.filter(
                    ([_, attribute_i]) => attribute_i.buffer == i 
                ));
                let buffer: VertexArrayBuffer | null = null;
                if (buffer_i !== undefined) {
                    if ("internalBuffer" in buffer_i) {
                        const {target, internalBuffer} = buffer_i;
                        buffer = buffer_i;
                        gl.bindBuffer(target, internalBuffer);
                        const {byteStride, vertexAttributes} = buffer;
                        Object.entries(vertexAttributes).forEach(([attributeName, setter]) => {
                            const {numComponents, componentType, normalize, byteOffset, divisor, constant, constantValue} = setter;
                            const location = gl.getAttribLocation(internalProgram, attributeName);
                            if (location > -1) {
                                gl.vertexAttribPointer(location, numComponents, componentType, normalize, byteStride, byteOffset);
                                if (divisor > 0) {
                                    gl.vertexAttribDivisor(location, divisor);
                                }
                                if (constant && constantValue) {
                                    switch (numComponents) {
                                        case 1:
                                            gl.vertexAttrib1fv(location, constantValue);
                                            break;
                                        case 2:
                                            gl.vertexAttrib2fv(location, constantValue);
                                            break;
                                        case 3:
                                            gl.vertexAttrib3fv(location, constantValue);
                                            break;
                                        case 4:
                                            gl.vertexAttrib4fv(location, constantValue);
                                            break;
                                    }
                                }
                                else {
                                    gl.enableVertexAttribArray(location);
                                }
                            }
                        });
                    }
                    else if (attributes) {
                        const {usage, interleaved} = buffer_i;
                        buffer = this.createVertexArrayBuffer(gl, program, attributes, usage, interleaved);
                    }
                }
                else if (attributes) {
                    buffer = this.createVertexArrayBuffer(gl, program, attributes);
                }
                if (buffer === null) {
                    return null;
                }
                verticesBuffers.push(buffer);
            });
        }
        else if (vertexAttributes) {
            let buffer: VertexArrayBuffer | null = null;
            buffer = this.createVertexArrayBuffer(gl, program, vertexAttributes);
            if (buffer === null) {
                return null;
            }
            verticesBuffers.push(buffer);
        }
        
        let elementBuffer: VertexElementArrayBuffer | null | undefined = undefined;
        if (elementBufferOrBufferProperties !== undefined) {
            if ("internalBuffer" in elementBufferOrBufferProperties) {
                const {target, internalBuffer} = elementBufferOrBufferProperties;
                elementBuffer = elementBufferOrBufferProperties;
                gl.bindBuffer(target, internalBuffer);
            }
            else if (elementIndices) {
                elementBuffer = this.createVertexElementArrayBuffer(gl, elementIndices);
            }
        }
        else if (elementIndices) {
            elementBuffer = this.createVertexElementArrayBuffer(gl, elementIndices);
        }
        if (elementBuffer === null) {
            return null;
        }

        return {
            verticesBuffers,
            elementBuffer,
            program,
            internalVertexArray,
            elementsCount,
        };
    }

    static deleteVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void {
        const {internalVertexArray} = vertexArray;
        if (gl.isVertexArray(internalVertexArray)) {
            gl.deleteVertexArray(internalVertexArray);
        }
    }

    static drawVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray, mode: DrawMode, instanceCount?: number): void {
        const {program, internalVertexArray, elementBuffer, elementsCount} = vertexArray;

        WebGLProgramUtilities.useProgram(gl, program);
        
        const currentVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        if (currentVertexArray !== internalVertexArray) {
            gl.bindVertexArray(internalVertexArray);
        }
        
        if (elementBuffer) {
            const {indexType} = elementBuffer;
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