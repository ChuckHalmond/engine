import { BufferDataUsage } from "../../webgl/WebGLBufferUtilities";
import { AttributeArray, AttributeDataType, DataComponentType } from "../../webgl/WebGLVertexArrayUtilities";
export { GeometryBuffer };
interface GeometryBufferConstructor {
    readonly prototype: GeometryBuffer;
    new (attributes: {
        [name: string]: GeometryBufferAttribute;
    }, interleaved?: boolean, usage?: BufferDataUsage): GeometryBuffer;
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
        };
    };
    getAttribute(name: string): GeometryBufferAttribute | null;
}
interface GeometryBufferAttribute {
    array: AttributeArray;
    type: AttributeDataType;
}
declare var GeometryBuffer: GeometryBufferConstructor;
