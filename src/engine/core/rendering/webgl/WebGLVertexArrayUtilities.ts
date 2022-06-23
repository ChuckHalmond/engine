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

    static getAttributeDataType(attribute: VertexArrayAttributeProperties): ArrayDataType {
        const {array} = attribute;
        if (array instanceof Float32Array || array instanceof Int32Array || array instanceof Uint32Array) {
            return ArrayDataType.FLOAT;
        }
        else if (array instanceof Int16Array) {
            return ArrayDataType.SHORT;
        }
        else if (array instanceof Uint16Array) {
            return ArrayDataType.UNSIGNED_SHORT;
        }
        else if (array instanceof Int8Array) {
            return ArrayDataType.BYTE;
        }
        else if (array instanceof Uint8Array) {
            return ArrayDataType.UNSIGNED_BYTE;
        }
        console.error(`Unsupported attribute array ${array.constructor.name}.`);
        return -1;
    };

    static createVertexArray(gl: WebGL2RenderingContext, program: Program, vertexArray: VertexArrayProperties): VertexArray | null {
        const {attributes, indices, numElements} = vertexArray;

        const internal = gl.createVertexArray();
        if (internal === null) {
            console.error("Could not create WebGLVertexArrayObject.");
            return null;
        }

        gl.bindVertexArray(internal);

        const attributesEntries = Object.entries(attributes);

        const buffersProps: {
            usage: BufferDataUsage;
            byteLength: number;
        }[] = [];
        attributesEntries.forEach(([_, attribute]) => {
            const {usage, array} = attribute;
            const {byteLength} = array;
            const bufferUsage = usage || gl.STATIC_DRAW;
            const bufferIndex = buffersProps.findIndex(bufferProps => bufferProps.usage === bufferUsage);

            if (bufferIndex < 0) {
                buffersProps.push({
                    usage: bufferUsage,
                    byteLength: byteLength
                });
            }
            else {
                buffersProps[bufferIndex].byteLength += byteLength;
            }
        });

        const attributesSetters: {
            [name: string]: VertexArrayAttributeSetter;
        } = {};
        const buffers: VertexArray["verticesBuffers"] = [];
        buffersProps.forEach((bufferProps, bufferIndex) => {
            const {byteLength, usage} = bufferProps;

            const buffer = gl.createBuffer();
            if (buffer == null) {
                console.error("Could not create WebGLBuffer.");
                return null;
            }

            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, byteLength, usage);

            let bufferBytesOffset = 0;
            attributesEntries
                .filter(([_, attribute]) => (attribute.usage || gl.STATIC_DRAW) === usage)
                .forEach(([attributeName, attribute]) => {

                const constant = attribute.constant ?? false;
                const {array} = attribute;

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
    
                bufferBytesOffset += array.byteLength;
            });

            buffers.push({
                internal: buffer,
                target: gl.ARRAY_BUFFER,
                usage: usage,
                byteLength: byteLength
            });
        });

        let indicesBuffer: WebGLBuffer | null | undefined = void 0;
        let indexType: ElementArrayDataType | undefined = void 0;

        if (typeof indices !== "undefined") {
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
            attributeSetters: attributesSetters,
            verticesBuffers: buffers,
            indicesBuffer: indicesBuffer,
            program: program,
            internal: internal,
            numElements: numElements,
            indexType: indexType
        };
    }

    static deleteVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray): void {
        const {internal} = vertexArray;
        if (gl.isVertexArray(internal)) {
            gl.deleteVertexArray(internal);
        }
    }

    static drawVertexArray(gl: WebGL2RenderingContext, vertexArray: VertexArray, mode: DrawMode, instanceCount?: number): void {
        const {program, internal, indexType, numElements} = vertexArray;

        WebGLProgramUtilities.useProgram(gl, program);
        
        const currentVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        if (currentVertexArray !== internal) {
            gl.bindVertexArray(internal);
        }
        
        if (typeof indexType !== "undefined") {
            if (typeof instanceCount !== "undefined") {
                gl.drawElementsInstanced(mode, numElements, indexType, 0, instanceCount);
            }
            else {
                gl.drawElements(mode, numElements, indexType, 0);
            }
        }
        else {
            if (typeof instanceCount !== "undefined") {
                gl.drawArraysInstanced(mode, 0, numElements, instanceCount);
            }
            else {
                gl.drawArrays(mode, 0, numElements);
            }
        }
    }

    static setVertexArrayAttributeValue(gl: WebGL2RenderingContext, vertexArray: VertexArray, attributeName: string, value: VertexArrayAttributeValue) {
        const {attributeSetters, verticesBuffers} = vertexArray;
        const {array} = value;
        
        const attributeSetter = attributeSetters[attributeName];
        const verticesBuffer = verticesBuffers[attributeSetter.bufferIndex];

        const {internal: internalBuffer} = verticesBuffer;
        const currentArrayBufferBinding = gl.getParameter(gl.ARRAY_BUFFER_BINDING);
        if (currentArrayBufferBinding !== internalBuffer) {
            gl.bindBuffer(gl.ARRAY_BUFFER, internalBuffer);
        }

        let {srcOffset, srcLength} = value;
        srcOffset = srcOffset ?? 0;
        srcLength = srcLength ?? array.length;

        if (typeof attributeSetter !== "undefined") {
            const {bufferBytesOffset} = attributeSetter;
            gl.bufferSubData(gl.ARRAY_BUFFER, bufferBytesOffset, array, srcOffset, srcLength);
        }
        else {
            console.warn(`Attribute ${attributeName} does not exist in the setters.`);
        }
    }

    static setVertexArrayValues(gl: WebGL2RenderingContext, vertexArray: VertexArray, values: VertexArrayValues): void {
        const {internal, indicesBuffer} = vertexArray;
        const {attributes, indices} = values;

        const currentVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        if (currentVertexArray !== internal) {
            gl.bindVertexArray(internal);
        }

        Object.entries(attributes).forEach(([attributeName, attribute]) => {
            this.setVertexArrayAttributeValue(gl, vertexArray, attributeName, attribute);
        });

        if (typeof indices !== "undefined" && typeof indicesBuffer !== "undefined") {
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