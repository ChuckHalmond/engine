export { GeometryBuffer };

interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new(attributes: {[name: string]: GeometryBufferAttribute;}, interleaved?: boolean): GeometryBuffer;
}

interface GeometryBuffer {
    interleaved: boolean;
    buffer: ArrayBuffer;
    attributes: {
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
    buffer: ArrayBuffer;
    attributes: {
        [name: string]: {
            arrayType: GeometryBufferAttributeArrayConstructor;
            byteOffset: number;
            byteLength: number;
            numComponents: 1 | 2 | 3 | 4;
        }
    };
    interleaved: boolean;
    stride: number;

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
        Object.entries(attributes).forEach(([name, attribute]) => {
            const {array, numComponents} = attribute;
            const arrayType = array.constructor as GeometryBufferAttributeArrayConstructor;
            const byteLength = array.byteLength;
            const bytesPerElement = array.BYTES_PER_ELEMENT;
            const bufferArray = new arrayType(buffer, byteOffset);
            if (interleaved) {
                const arrayStrideOffset = (bufferStride / bytesPerElement);
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
                bufferArray.set(array);
            }
            this.attributes[name] = {
                byteOffset: byteOffset,
                byteLength: byteLength,
                arrayType: arrayType,
                numComponents: numComponents
            };
            byteOffset += (interleaved) ? 
                (numComponents * bytesPerElement) : byteLength;
        });
    }


    public getAttribute(name: string): GeometryBufferAttribute | null {
        const attribute = this.attributes[name];
        if (attribute) {
            const {arrayType, byteLength, byteOffset, numComponents} = attribute;
            const bufferArray = new arrayType(this.buffer, byteOffset);
            const bufferByteLength = this.buffer.byteLength;
            const interleaved = this.interleaved;
            const bufferStride = this.stride;
            const bufferSlices = Math.trunc(bufferByteLength / bufferStride);
            const bytesPerElement = arrayType.BYTES_PER_ELEMENT;
            const attributeArray = new arrayType(byteLength / bytesPerElement);
            if (interleaved) {
                const arrayStrideOffset = (bufferStride / bytesPerElement);
                for (let i = 0; i < bufferSlices; i++) {
                    let arraySliceIndex = arrayStrideOffset * i;
                    attributeArray.set(
                        bufferArray.slice(
                            arraySliceIndex,
                            arraySliceIndex + numComponents
                        ),
                        numComponents * i
                    );
                }
            }
            else {
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