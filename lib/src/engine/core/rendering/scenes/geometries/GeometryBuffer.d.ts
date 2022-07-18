import { AttributeArray, AttributeDataType, DataComponentType } from "../../webgl/WebGLVertexArrayUtilities";
export { GeometryBuffer };
interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new (): GeometryBuffer;
    new (attributes: Record<string, GeometryBufferAttribute>, indices?: Uint8Array | Uint16Array | Uint32Array, interleaved?: boolean): GeometryBuffer;
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
    array: AttributeArray;
    type: AttributeDataType;
    constant?: boolean;
    normalize?: boolean;
}
declare var GeometryBuffer: GeometryBufferConstructor;
