export { GeometryBuffer };
interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new (attributes: {
        [name: string]: GeometryBufferAttribute;
    }, interleaved?: boolean): GeometryBuffer;
}
interface GeometryBuffer {
    readonly interleaved: boolean;
    readonly buffer: ArrayBuffer;
    readonly attributes: {
        [name: string]: {
            byteOffset: number;
            numComponents: 1 | 2 | 3 | 4;
        };
    };
    getAttribute(name: string): GeometryBufferAttribute | null;
}
declare type GeometryBufferAttributeArray = Float32Array | Uint8Array | Uint16Array | Uint32Array;
interface GeometryBufferAttribute {
    array: GeometryBufferAttributeArray;
    numComponents: 1 | 2 | 3 | 4;
}
declare var GeometryBuffer: GeometryBufferConstructor;
