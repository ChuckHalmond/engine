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

export enum ArrayDataType {
    BYTE = 0x1400,
    UNSIGNED_BYTE = 0x1401,
    SHORT = 0x1402,
    UNSIGNED_SHORT = 0x1403,
    INT = 0x1404,
    UNSIGNED_INT = 0x1405,
    FLOAT = 0x1406,
    HALF_FLOAT = 0x140B,
}

export enum ElementArrayDataType {
    UNSIGNED_BYTE = 0x1401,
    UNSIGNED_SHORT = 0x1403,
    UNSIGNED_INT = 0x1405
}

type VertexArrayAttributeArray =
    Float32Array | Int32Array | Uint32Array |
    Int16Array | Uint16Array |
    Int8Array | Uint8Array | Uint8ClampedArray;

type VertexArrayAttributeProperties = {
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
}

type VertexArrayAttributeValue = {
    array: VertexArrayAttributeArray;
    srcOffset?: number;
    srcLength?: number;
}

type VertexArrayAttributeSetter = {
    bufferIndex: number;
    location: number;
    divisor: number;
    stride: number;
    constant: boolean;
    offset: number;
    numComponents: number;
    normalize: boolean;
    bufferBytesOffset: number;
}

type VertexArrayProperties = {
    attributes: {
        [name: string]: VertexArrayAttributeProperties;
    };
    indices?: Uint8Array | Uint16Array | Uint32Array;
    numElements: number;
}

type VertexArrayValues = {
    attributes: {
        [name: string]: VertexArrayAttributeValue;
    };
    indices?: Uint8Array | Uint16Array | Uint32Array;
    numElements: number;
}

type VertexArray = {
    internal: WebGLVertexArrayObject;
    program: Program;
    attributeSetters: {
        [name: string]: VertexArrayAttributeSetter;
    };
    verticesBuffers: Buffer[];
    numElements: number;
    indexType?: ElementArrayDataType;
    indicesBuffer?: WebGLBuffer;
}

class WebGLVertexArrayUtilities {

    public static getAttributeDataType(attribute: VertexArrayAttributeProperties): ArrayDataType {
        if (attribute.array instanceof Float32Array || attribute.array instanceof Int32Array || attribute.array instanceof Uint32Array) {
            return ArrayDataType.FLOAT;
        }
        else if (attribute.array instanceof Int16Array) {
            return ArrayDataType.SHORT;
        }
        else if (attribute.array instanceof Uint16Array) {
            return ArrayDataType.UNSIGNED_SHORT;
        }
        else if (attribute.array instanceof Int8Array) {
            return ArrayDataType.BYTE;
        }
        else if (attribute.array instanceof Uint8Array) {
            return ArrayDataType.UNSIGNED_BYTE;
        }
        console.error(`Unsupported attribute array ${attribute.array.constructor.name}.`);
        return -1;
    };

    public static createVertexArray(gl: WebGL2RenderingContext, program: Program, vertexArray: VertexArrayProperties): VertexArray | null {
        
        const _vertexArray = gl.createVertexArray();
        if (_vertexArray === null) {
            console.error("Could not create WebGLVertexArrayObject.");
            return null;
        }

        gl.bindVertexArray(_vertexArray);

        const attributesEntries = Object.entries(vertexArray.attributes);

        const buffersProps: {
            usage: BufferDataUsage;
            byteLength: number;
        }[] = [];
        attributesEntries.forEach(([_, attribute]) => {
            const bufferUsage = attribute.usage || gl.STATIC_DRAW;
            const bufferIndex = buffersProps.findIndex(bufferProps => bufferProps.usage === bufferUsage);

            if (bufferIndex < 0) {
                buffersProps.push({
                    usage: bufferUsage,
                    byteLength: attribute.array.byteLength
                });
            }
            else {
                buffersProps[bufferIndex].byteLength += attribute.array.byteLength;
            }
        });

        const attributesSetters: {
            [name: string]: VertexArrayAttributeSetter;
        } = {};
        const buffers: VertexArray["verticesBuffers"] = [];
        buffersProps.forEach((bufferProps, bufferIndex) => {
            const buffer = gl.createBuffer();
            if (buffer == null) {
                console.error("Could not create WebGLBuffer.");
                return null;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, bufferProps.byteLength, bufferProps.usage);

            let bufferBytesOffset = 0;
            attributesEntries
                .filter(([_, attribute]) => (attribute.usage || gl.STATIC_DRAW) === bufferProps.usage)
                .forEach(([attributeName, attribute]) => {

                const constant = attribute.constant ?? false;
                const array = attribute.array;

                if ("buffer" in array && !constant) {
                    const srcOffset = (typeof attribute.srcOffset === "undefined") ? 0 : attribute.srcOffset;
                    const srcLength = (typeof attribute.srcLength === "undefined") ? array.length : attribute.srcLength;
                    gl.bufferSubData(gl.ARRAY_BUFFER, bufferBytesOffset, array, srcOffset, srcLength);
                }
                
                const location = gl.getAttribLocation(program.internal, attributeName);
                if (location == -1) {
                    console.warn(`Attribute ${attributeName} could not be located.`);
                    return;
                }
                
                const type = this.getAttributeDataType(attribute);
                const stride = attribute.stride ?? 0;
                const numComponents = attribute.numComponents;
                const divisor = attribute.divisor ?? 0;
                const normalize = attribute.normalize ?? false;
                const offset = (stride > 0) ? (attribute.offset || 0) : bufferBytesOffset;
                
                gl.vertexAttribPointer(location, numComponents, type, normalize, stride, offset);
                if (divisor > 0) {
                    gl.vertexAttribDivisor(location, divisor);
                }
                if (constant) {
                    switch (numComponents) {
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
                    gl.enableVertexAttribArray(location);
                }
    
                attributesSetters[attributeName] = {
                    bufferIndex: bufferIndex,
                    location: location,
                    stride: stride,
                    numComponents: numComponents,
                    normalize: normalize,
                    constant: constant,
                    divisor: divisor,
                    offset: offset,
                    bufferBytesOffset: bufferBytesOffset
                };
    
                bufferBytesOffset += attribute.array.byteLength;
            });

            buffers.push({
                internal: buffer,
                target: gl.ARRAY_BUFFER,
                usage: bufferProps.usage,
                byteLength: bufferProps.byteLength
            });
        });

        let indicesBuffer: WebGLBuffer | null | undefined = void 0;
        let indexType: ElementArrayDataType | undefined = void 0;

        if (typeof vertexArray.indices !== "undefined") {
            indexType = this.getElementArrayBufferType(vertexArray.indices);
            indicesBuffer = gl.createBuffer();
            if (indicesBuffer == null) {
                console.error("Could not create WebGLBuffer.");
                return null;
            }
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, vertexArray.indices, gl.STATIC_DRAW);
        }

        return {
            attributeSetters: attributesSetters,
            verticesBuffers: buffers,
            indicesBuffer: indicesBuffer,
            program: program,
            internal: _vertexArray,
            numElements: vertexArray.numElements,
            indexType: indexType
        };
    }

    public static deleteVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void {
        if (gl.isVertexArray(vertexArray.internal)) {
            gl.deleteVertexArray(vertexArray.internal);
        }
    }

    public static drawVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray, mode: DrawMode, instanceCount?: number): void {
        
        WebGLProgramUtilities.useProgram(gl, vertexArray.program);
        
        const currentVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        if (currentVertexArray !== vertexArray.internal) {
            gl.bindVertexArray(vertexArray.internal);
        }
        
        if (typeof vertexArray.indexType !== "undefined") {
            if (typeof instanceCount !== "undefined") {
                gl.drawElementsInstanced(mode, vertexArray.numElements, vertexArray.indexType, 0, instanceCount);
            }
            else {
                gl.drawElements(mode, vertexArray.numElements, vertexArray.indexType, 0);
            }
        }
        else {
            if (typeof instanceCount !== "undefined") {
                gl.drawArraysInstanced(mode, 0, vertexArray.numElements, instanceCount);
            }
            else {
                gl.drawArrays(mode, 0, vertexArray.numElements);
            }
        }
    }

    public static setVertexArrayValues(gl: WebGL2RenderingContext, vertexArray: VertexArray, values: VertexArrayValues): void {
        const currentVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        if (currentVertexArray !== vertexArray.internal) {
            gl.bindVertexArray(vertexArray.internal);
        }

        Object.entries(values.attributes).forEach(([attributeName, attribute]) => {
            const attributeSetter = vertexArray.attributeSetters[attributeName];
            const verticesBuffer = vertexArray.verticesBuffers[attributeSetter.bufferIndex];

            const currentArrayBufferBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
            if (currentArrayBufferBinding !== verticesBuffer.internal) {
                gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer.internal);
            }

            const srcOffset = (typeof attribute.srcOffset === "undefined") ? 0 : attribute.srcOffset;
            const srcLength = (typeof attribute.srcLength === "undefined") ? attribute.array.length : attribute.srcLength;

            if (typeof vertexArray !== "undefined") {
                gl.bufferSubData(gl.ARRAY_BUFFER, attributeSetter.bufferBytesOffset, attribute.array, srcOffset, srcLength);
            }
            else {
                console.warn(`Attribute ${attributeName} does not exist in the setters.`);
            }
        });

        if (typeof values.indices !== "undefined" && typeof vertexArray.indicesBuffer !== "undefined") {
            const currentElementArrayBufferBinding = gl.getParameter(gl.ELEMENT_ARRAY_BUFFER_BINDING);
            if (currentElementArrayBufferBinding !== vertexArray.indicesBuffer) {
                gl.bindBuffer(BufferTarget.ELEMENT_ARRAY_BUFFER, vertexArray.indicesBuffer);
            }
            gl.bufferSubData(BufferTarget.ELEMENT_ARRAY_BUFFER, 0, values.indices);
        }
    }

    public static unbindVertexArray(gl: WebGL2RenderingContext): void {
        gl.bindVertexArray(null);
    }

    public static getElementArrayBufferType(indices: Uint8Array | Uint16Array | Uint32Array): ElementArrayDataType {
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