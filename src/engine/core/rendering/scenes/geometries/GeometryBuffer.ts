import { BufferDataUsage } from "../../webgl/WebGLBufferUtilities";
import { AttributeArray, AttributeDataType, DataComponentType, WebGLVertexArrayUtilities } from "../../webgl/WebGLVertexArrayUtilities";

export { GeometryBuffer };

interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new(): GeometryBuffer;
    new(
        attributes: Record<string, GeometryBufferAttribute>,
        indices?: Uint8Array | Uint16Array | Uint32Array,
        interleaved?: boolean
    ): GeometryBuffer;
    fromBlob(blob: Blob): Promise<GeometryBuffer>;
}

interface GeometryBuffer {
    interleaved: boolean;
    buffer: ArrayBuffer;
    stride: number;
    indices?: Uint8Array | Uint16Array | Uint32Array;
    attributes: Record<string, {
        type: AttributeDataType;
        componentType: DataComponentType;
        byteOffset: number;
        byteLength: number;
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
    buffer: ArrayBuffer;
    attributes: Record<string, {
        type: AttributeDataType;
        componentType: DataComponentType;
        byteOffset: number;
        byteLength: number;
        constant?: boolean;
        normalize?: boolean;
    }>;
    indices?: Uint8Array | Uint16Array | Uint32Array;
    interleaved: boolean;
    stride: number;

    constructor()
    constructor(
        attributes: Record<string, GeometryBufferAttribute>,
        indices?: Uint8Array | Uint16Array | Uint32Array,
        interleaved?: boolean
    )
    constructor(
        attributes: Record<string, GeometryBufferAttribute> = {},
        indices?: Uint8Array | Uint16Array | Uint32Array,
        interleaved?: boolean
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
                    return stride + array.BYTES_PER_ELEMENT * WebGLVertexArrayUtilities.getDataTypeNumComponents(type);
                }, 0
            ) : 0;
            const bufferSlices = Math.trunc(bufferByteLength / stride);
            
            this.attributes = {};
            this.indices = indices;
            this.interleaved = interleaved ?? false;
            this.stride = stride;
            this.buffer = buffer;
            
            let byteOffset = 0;
            if (interleaved) {
                Object.entries(attributes).forEach(([name, attribute]) => {
                    const {array, type, constant, normalize} = attribute;
                    const componentType = WebGLVertexArrayUtilities.getArrayComponentType(array);
                    const numComponents = WebGLVertexArrayUtilities.getDataTypeNumComponents(type);
                    const bufferArrayConstructor = WebGLVertexArrayUtilities.getComponentTypeArrayConstructor(
                        WebGLVertexArrayUtilities.getArrayComponentType(array)
                    );
                    const {byteLength, BYTES_PER_ELEMENT} = array;
                    const bufferArray = new bufferArrayConstructor(buffer, byteOffset);
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
                        byteOffset,
                        byteLength,
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
                    const {byteLength} = array;
                    const componentType = WebGLVertexArrayUtilities.getArrayComponentType(array);
                    const bufferArrayConstructor = WebGLVertexArrayUtilities.getComponentTypeArrayConstructor(
                        WebGLVertexArrayUtilities.getArrayComponentType(array)
                    );
                    const bufferArray = new bufferArrayConstructor(buffer, byteOffset);
                    bufferArray.set(array);
                    this.attributes[name] = {
                        byteOffset,
                        byteLength,
                        type,
                        componentType
                    };
                    byteOffset += byteLength;
                });
            }
        }
        else {
            this.attributes = {};
            this.indices = undefined;
            this.interleaved = false;
            this.stride = 0;
            this.buffer = new ArrayBuffer(0);
        }
    }

    toBlob(): Blob {
        const {attributes, buffer, stride, interleaved, indices} = this;
        const bufferData = new Uint8Array(buffer);
        const {length: bufferLength} = bufferData;
        const indicesData = Uint8Array.from(indices ?? []);
        const indicesLength = indices?.length ?? 0;
        const headerData = new TextEncoder().encode(JSON.stringify({attributes, stride, interleaved}));
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
        const header = <Pick<GeometryBuffer, "attributes" | "stride" | "interleaved">>JSON.parse(new TextDecoder().decode(headerData));
        const {attributes, interleaved, stride} = header;
        const geometryBuffer = new GeometryBuffer();
        geometryBuffer.buffer = buffer;
        geometryBuffer.attributes = attributes;
        geometryBuffer.interleaved = interleaved;
        geometryBuffer.stride = stride;
        geometryBuffer.indices = indices;
        return geometryBuffer;
    }

    getAttribute(name: string): GeometryBufferAttribute | null {
        const {attributes} = this;
        const attribute = attributes[name];
        if (attribute) {
            const {buffer, interleaved, stride} = this;
            const {type, byteOffset, byteLength, componentType} = attribute;
            const attributeArrayConstructor = WebGLVertexArrayUtilities.getComponentTypeArrayConstructor(componentType);
            const bytesPerElement = attributeArrayConstructor.BYTES_PER_ELEMENT;
            const length = byteLength / bytesPerElement;
            const numComponents = WebGLVertexArrayUtilities.getDataTypeNumComponents(type);
            const {byteLength: bufferByteLength} = buffer;
            const {BYTES_PER_ELEMENT} = attributeArrayConstructor;
            const attributeArray = new attributeArrayConstructor(length);
            if (interleaved) {
                const bufferArray = new attributeArrayConstructor(buffer, byteOffset);
                const bufferStride = stride;
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
                const bufferArray = new attributeArrayConstructor(buffer, byteOffset, length);
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