import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";
export { IcosahedronGeometry };
declare class IcosahedronGeometry extends GeometryBase {
    vertices: Float32Array;
    uvs: Float32Array;
    indices: Uint8Array;
    constructor();
    toBuilder(): GeometryBuilder;
}
