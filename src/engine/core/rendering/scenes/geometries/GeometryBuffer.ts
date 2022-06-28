import { BufferDataUsage } from "../../webgl/WebGLBufferUtilities";
import { AttributeArray, AttributeDataType, DataComponentType, WebGLVertexArrayUtilities } from "../../webgl/WebGLVertexArrayUtilities";

export { GeometryBuffer };

interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new(
        attributes: {
            [name: string]: GeometryBufferAttribute;
        },
        interleaved?: boolean,
        usage?: BufferDataUsage
    ): GeometryBuffer;
}

interface GeometryBuffer {
    readonly interleaved: boolean;
    readonly buffer: ArrayBuffer;
    readonly usage: BufferDataUsage;
    readonly attributes: {
        [name: string]: {
            componentType: DataComponentType;
            byteOffset: number;
            count: number;
            type: AttributeDataType;
        }
    }
    getAttribute(name: string): GeometryBufferAttribute | null;
}

interface GeometryBufferAttribute {
    array: AttributeArray,
    type: AttributeDataType;
}

class GeometryBufferBase implements GeometryBuffer {
    readonly buffer: ArrayBuffer;
    readonly attributes: {
        [name: string]: {
            componentType: DataComponentType;
            byteOffset: number;
            count: number;
            type: AttributeDataType;
        }
    };
    readonly usage: BufferDataUsage;
    readonly interleaved: boolean;
    readonly stride: number;

    constructor(
        attributes: {
            [name: string]: GeometryBufferAttribute
        },
        interleaved: boolean = false,
        usage: BufferDataUsage = BufferDataUsage.STATIC_DRAW
    ) {
        const attributesBuffers = Object.values(attributes);
        const bufferByteLength = attributesBuffers.reduce(
            (byteLength, attribute) => byteLength + attribute.array.byteLength, 0
        );
        const buffer = new ArrayBuffer(bufferByteLength);
        const bufferStride = (interleaved) ? attributesBuffers.reduce(
            (stride, attribute) => {
                const {array, type} = attribute;
                return stride + array.BYTES_PER_ELEMENT * WebGLVertexArrayUtilities.getAttributeDataTypeElementsSize(type);
            }, 0
        ) : 0;
        const bufferSlices = Math.trunc(bufferByteLength / bufferStride);
        
        this.attributes = {};
        this.interleaved = interleaved;
        this.stride = bufferStride;
        this.buffer = buffer;
        this.usage = usage;
        
        let byteOffset = 0;
        if (interleaved) {
            Object.entries(attributes).forEach(([name, attribute]) => {
                const {array, type} = attribute;
                const componentType = WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array);
                const elementsSize = WebGLVertexArrayUtilities.getAttributeDataTypeElementsSize(type);
                const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                    WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                );
                const {BYTES_PER_ELEMENT} = array;
                const {length: count} = array;
                const bufferArray = new bufferArrayConstructor(buffer, byteOffset);
                const arrayStrideOffset = bufferStride / BYTES_PER_ELEMENT;
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
                this.attributes[name] = {
                    type: type,
                    byteOffset: byteOffset,
                    count: count,
                    componentType: componentType
                };
                byteOffset += elementsSize * BYTES_PER_ELEMENT;
            });
        }
        else {
            Object.entries(attributes).forEach(([name, attribute]) => {
                const {array, type} = attribute;
                const {length: count} = array;
                const {byteLength} = array;
                const componentType = WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array);
                const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                    WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                );
                const bufferArray = new bufferArrayConstructor(buffer, byteOffset);
                bufferArray.set(array);
                this.attributes[name] = {
                    byteOffset: byteOffset,
                    count: count,
                    type: type,
                    componentType: componentType
                };
                byteOffset += byteLength;
            });
        }
    }

    getAttribute(name: string): GeometryBufferAttribute | null {
        const attribute = this.attributes[name];
        if (attribute) {
            const {count, type, byteOffset, componentType} = attribute;
            const attributeArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(componentType);
            const numComponents = WebGLVertexArrayUtilities.getAttributeDataTypeElementsSize(type);
            const bufferByteLength = this.buffer.byteLength;
            const interleaved = this.interleaved;
            const {BYTES_PER_ELEMENT} = attributeArrayConstructor;
            const attributeArray = new attributeArrayConstructor(count);
            if (interleaved) {
                const bufferArray = new attributeArrayConstructor(this.buffer, byteOffset);
                const bufferStride = this.stride;
                const bufferSlices = Math.trunc(bufferByteLength / bufferStride);
                const arrayStrideOffset = bufferStride / BYTES_PER_ELEMENT;
                for (let i = 0; i < bufferSlices; i++) {
                    let bufferArraySliceIndex = arrayStrideOffset * i;
                    attributeArray.set(
                        bufferArray.slice(
                            bufferArraySliceIndex,
                            bufferArraySliceIndex + numComponents
                        ),
                        numComponents * i
                    );
                }
            }
            else {
                const bufferArray = new attributeArrayConstructor(this.buffer, byteOffset, count);
                attributeArray.set(bufferArray);
            }
            return {
                array: attributeArray,
                type: type
            };
        }
        return null;
    }
}

var GeometryBuffer: GeometryBufferConstructor = GeometryBufferBase;