import { BufferDataUsage } from "../../webgl/WebGLBufferUtilities";
import { AttributeArray, AttributeDataType, DataComponentType, WebGLVertexArrayUtilities } from "../../webgl/WebGLVertexArrayUtilities";

export { GeometryBuffer };

interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new(): GeometryBuffer;
    new(
        attributes: Record<string, GeometryBufferAttribute>,
        indices?: Uint8Array | Uint16Array | Uint32Array,
        interleaved?: boolean,
        usage?: BufferDataUsage
    ): GeometryBuffer;
    fromBlob(blob: Blob): Promise<GeometryBuffer>;
}

interface GeometryBuffer {
    interleaved: boolean;
    buffer: ArrayBuffer;
    usage: BufferDataUsage;
    stride: number;
    indices?: Uint8Array | Uint16Array | Uint32Array;
    attributes: Record<string, {
        type: AttributeDataType;
        componentType: DataComponentType;
        offset: number;
        count: number;
        constant?: boolean;
        normalize?: boolean;
    }>;
    getAttribute(name: string): GeometryBufferAttribute | null;
    toBlob(): Blob;
}

interface GeometryBufferAttribute {
    array: AttributeArray,
    type: AttributeDataType;
    constant?: boolean;
    normalize?: boolean;
}

class GeometryBufferBase implements GeometryBuffer {
    buffer!: ArrayBuffer;
    attributes!: Record<string, {
        type: AttributeDataType;
        componentType: DataComponentType;
        offset: number;
        count: number;
        constant?: boolean;
        normalize?: boolean;
    }>;
    indices?: Uint8Array | Uint16Array | Uint32Array;
    usage!: BufferDataUsage;
    interleaved!: boolean;
    stride!: number;

    constructor()
    constructor(
        attributes: Record<string, GeometryBufferAttribute>,
        indices?: Uint8Array | Uint16Array | Uint32Array,
        interleaved?: boolean,
        usage?: BufferDataUsage
    )
    constructor(
        attributes: Record<string, GeometryBufferAttribute> = {},
        indices?: Uint8Array | Uint16Array | Uint32Array,
        interleaved?: boolean,
        usage?: BufferDataUsage
    ) {
        if (attributes) {
            const attributesBuffers = Object.values(attributes);
            const bufferByteLength = attributesBuffers.reduce(
                (byteLength, attribute) => byteLength + attribute.array.byteLength, 0
            );
            const buffer = new ArrayBuffer(bufferByteLength);
            const stride = (interleaved) ? attributesBuffers.reduce(
                (stride, attribute) => {
                    const {array, type} = attribute;
                    return stride + array.BYTES_PER_ELEMENT * WebGLVertexArrayUtilities.getAttributeDataTypeNumComponents(type);
                }, 0
            ) : 0;
            const bufferSlices = Math.trunc(bufferByteLength / stride);
            
            this.attributes = {};
            this.indices = indices;
            this.interleaved = interleaved ?? false;
            this.stride = stride;
            this.buffer = buffer;
            this.usage = usage ?? BufferDataUsage.STATIC_READ;
            
            let byteOffset = 0;
            if (interleaved) {
                Object.entries(attributes).forEach(([name, attribute]) => {
                    const {array, type, constant, normalize} = attribute;
                    const componentType = WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array);
                    const numComponents = WebGLVertexArrayUtilities.getAttributeDataTypeNumComponents(type);
                    const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                        WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                    );
                    const {length, BYTES_PER_ELEMENT} = array;
                    const count = length / numComponents;
                    const bufferArray = new bufferArrayConstructor(buffer, byteOffset);
                    const offset = byteOffset / BYTES_PER_ELEMENT;
                    const arrayStrideOffset = stride / BYTES_PER_ELEMENT;
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
                    this.attributes[name] = {
                        type,
                        offset,
                        count,
                        componentType,
                        constant,
                        normalize
                    };
                    byteOffset += numComponents * BYTES_PER_ELEMENT;
                });
            }
            else {
                Object.entries(attributes).forEach(([name, attribute]) => {
                    const {array, type} = attribute;
                    const {length, byteLength, BYTES_PER_ELEMENT} = array;
                    const numComponents = WebGLVertexArrayUtilities.getAttributeDataTypeNumComponents(type);
                    const count = length / numComponents;
                    const componentType = WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array);
                    const bufferArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(
                        WebGLVertexArrayUtilities.getAttributeArrayDataComponentType(array)
                    );
                    const bufferArray = new bufferArrayConstructor(buffer, byteOffset);
                    const offset = byteOffset / BYTES_PER_ELEMENT;
                    bufferArray.set(array);
                    this.attributes[name] = {
                        offset,
                        count,
                        type,
                        componentType
                    };
                    byteOffset += byteLength;
                });
            }
        }
    }

    toBlob(): Blob {
        const {attributes, buffer, stride, interleaved, usage, indices} = this;
        const bufferData = new Uint8Array(buffer);
        const {length: bufferLength} = bufferData;
        const indicesData = Uint8Array.from(indices ?? []);
        const indicesLength = indices?.length ?? 0;
        const headerData = new TextEncoder().encode(JSON.stringify({attributes, stride, interleaved, usage}));
        const {length: headerLength} = headerData;

        const blobDataView = new Uint8Array(4 + headerLength + indicesLength + bufferLength);
        const {buffer: blobDataViewBuffer} = blobDataView;
        const blobDataHeaderView = new Uint16Array(blobDataViewBuffer, 0, 2);
        const blobDataHeaderLength = blobDataHeaderView.length * (Uint16Array.BYTES_PER_ELEMENT / Uint8Array.BYTES_PER_ELEMENT);
        blobDataHeaderView[0] = headerLength;
        blobDataHeaderView[1] = indicesLength;
        blobDataView.set(headerData, blobDataHeaderLength);
        blobDataView.set(indicesData, blobDataHeaderLength + headerLength);
        blobDataView.set(bufferData, blobDataHeaderLength + headerLength + indicesLength);

        return new Blob([blobDataView], {type: "application/octet-stream"});
    }

    static async fromBlob(blob: Blob): Promise<GeometryBuffer> {
        const arrayBuffer = await blob.arrayBuffer();
        const blobDataHeaderView = new Uint16Array(arrayBuffer, 0, 2);
        const {byteLength: blobDataHeaderByteLength} = blobDataHeaderView;
        const headerLength = blobDataHeaderView[0];
        const indicesLength = blobDataHeaderView[1];
        const headerData = new Uint8Array(arrayBuffer, blobDataHeaderByteLength, headerLength);
        const arrayConstructor = (indicesLength < Math.pow(2, 8)) ? Uint8Array : (indicesLength < Math.pow(2, 16)) ? Uint16Array : Uint32Array;
        const indices = new arrayConstructor(arrayBuffer.slice(blobDataHeaderByteLength + headerLength * Uint8Array.BYTES_PER_ELEMENT, indicesLength * arrayConstructor.BYTES_PER_ELEMENT));
        const buffer = arrayBuffer.slice(blobDataHeaderByteLength + (indicesLength + headerLength) * Uint8Array.BYTES_PER_ELEMENT);
        const header = <Pick<GeometryBuffer, "attributes" | "stride" | "interleaved" | "usage">>JSON.parse(new TextDecoder().decode(headerData));
        const {attributes, interleaved, usage, stride} = header;
        const geometryBuffer = new GeometryBuffer();
        geometryBuffer.buffer = buffer;
        geometryBuffer.attributes = attributes;
        geometryBuffer.interleaved = interleaved;
        geometryBuffer.usage = usage;
        geometryBuffer.stride = stride;
        geometryBuffer.indices = indices;
        return geometryBuffer;
    }

    getAttribute(name: string): GeometryBufferAttribute | null {
        const attribute = this.attributes[name];
        if (attribute) {
            const {count, type, offset, componentType} = attribute;
            const attributeArrayConstructor = WebGLVertexArrayUtilities.getDataComponentTypeArrayConstructor(componentType);
            const numComponents = WebGLVertexArrayUtilities.getAttributeDataTypeNumComponents(type);
            const bufferByteLength = this.buffer.byteLength;
            const interleaved = this.interleaved;
            const {BYTES_PER_ELEMENT} = attributeArrayConstructor;
            const length = count * numComponents;
            const attributeArray = new attributeArrayConstructor(length);
            const byteOffset = offset * BYTES_PER_ELEMENT;
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