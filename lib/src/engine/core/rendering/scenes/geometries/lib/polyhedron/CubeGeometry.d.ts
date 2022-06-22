import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";
/**
 *     v0_______v1
 *     |\        |
 *     |  \      |
 *     |    \    |
 *     |      \  |
 *    v2_______\v3
 *
 */
export declare class CubeGeometry extends GeometryBase {
    width: number;
    height: number;
    depth: number;
    widthSegment: number;
    heightSegment: number;
    depthSegment: number;
    constructor(properties?: {
        width?: number;
        height?: number;
        depth?: number;
        widthSegment?: number;
        heightSegment?: number;
        depthSegment?: number;
    });
    toBuilder(): GeometryBuilder;
}
