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
    widthSegments: number;
    heightSegments: number;
    depthSegments: number;
    constructor(properties?: {
        width?: number;
        height?: number;
        depth?: number;
        widthSegments?: number;
        heightSegments?: number;
        depthSegments?: number;
    });
    toBuilder(): GeometryBuilder;
}
