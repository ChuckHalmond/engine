export { GeometryBuffer };

interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new(attributes: {[name: string]: GeometryBufferAttribute;}, interleaved?: boolean): GeometryBuffer;
}

interface GeometryBuffer {
    readonly interleaved: boolean;
    readonly buffer: ArrayBuffer;
    readonly attributes: {
        [name: string]: {
            byteOffset: number;
            numComponents: 1 | 2 | 3 | 4;
        }
    }
    getAttribute(name: string): GeometryBufferAttribute | null;
}

type GeometryBufferAttributeArray = Float32Array | Uint8Array | Uint16Array | Uint32Array;
type GeometryBufferAttributeArrayConstructor = Float32ArrayConstructor | Uint8ArrayConstructor | Uint16ArrayConstructor | Uint32ArrayConstructor;

interface GeometryBufferAttribute {
    array: GeometryBufferAttributeArray, numComponents: 1 | 2 | 3 | 4
}

class GeometryBufferBase implements GeometryBuffer {
    readonly buffer: ArrayBuffer;
    readonly attributes: {
        [name: string]: {
            arrayType: GeometryBufferAttributeArrayConstructor;
            byteOffset: number;
            byteLength: number;
            numComponents: 1 | 2 | 3 | 4;
        }
    };
    readonly interleaved: boolean;
    readonly stride: number;

    constructor(
        attributes: {
            [name: string]: GeometryBufferAttribute
        },
        interleaved: boolean = false
    ) {
        const attributesBuffers = Object.values(attributes);
        const bufferByteLength = attributesBuffers.reduce(
            (byteLength, attribute) => byteLength + attribute.array.byteLength, 0
        );
        const buffer = new ArrayBuffer(bufferByteLength);
        const bufferStride = (interleaved) ? attributesBuffers.reduce(
            (stride, attribute) => stride + attribute.array.BYTES_PER_ELEMENT * attribute.numComponents, 0
        ) : 0;
        const bufferSlices = Math.trunc(bufferByteLength / bufferStride);
        
        this.attributes = {};
        this.interleaved = interleaved;
        this.stride = bufferStride;
        this.buffer = buffer;
        
        let byteOffset = 0;
        if (interleaved) {
            Object.entries(attributes).forEach(([name, attribute]) => {
                const {array, numComponents} = attribute;
                const arrayType = array.constructor as GeometryBufferAttributeArrayConstructor;
                const {byteLength, BYTES_PER_ELEMENT} = array;
                const bufferArray = new arrayType(buffer, byteOffset);
                const arrayStrideOffset = bufferStride / BYTES_PER_ELEMENT;
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
                    byteOffset: byteOffset,
                    byteLength: byteLength,
                    arrayType: arrayType,
                    numComponents: numComponents
                };
                byteOffset += numComponents * BYTES_PER_ELEMENT;
            });
        }
        else {
            Object.entries(attributes).forEach(([name, attribute]) => {
                const {array, numComponents} = attribute;
                const arrayType = array.constructor as GeometryBufferAttributeArrayConstructor;
                const {byteLength} = array;
                const bufferArray = new arrayType(buffer, byteOffset);
                bufferArray.set(array);
                this.attributes[name] = {
                    byteOffset: byteOffset,
                    byteLength: byteLength,
                    arrayType: arrayType,
                    numComponents: numComponents
                };
                byteOffset += byteLength;
            });
        }
    }

    getAttribute(name: string): GeometryBufferAttribute | null {
        const attribute = this.attributes[name];
        if (attribute) {
            const {arrayType, byteLength, byteOffset, numComponents} = attribute;
            const bufferByteLength = this.buffer.byteLength;
            const interleaved = this.interleaved;
            const {BYTES_PER_ELEMENT} = arrayType;
            const arrayLength = byteLength / BYTES_PER_ELEMENT;
            const attributeArray = new arrayType(arrayLength);
            if (interleaved) {
                const bufferArray = new arrayType(this.buffer, byteOffset);
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
                const bufferArray = new arrayType(this.buffer, byteOffset, arrayLength);
                attributeArray.set(bufferArray);
            }
            return {
                array: attributeArray,
                numComponents: numComponents
            };
        }
        return null;
    }
}

var GeometryBuffer: GeometryBufferConstructor = GeometryBufferBase;