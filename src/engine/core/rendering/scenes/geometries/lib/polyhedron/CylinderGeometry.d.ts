import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";
export declare class CylinderGeometry extends GeometryBase {
    radiusTop: number;
    radiusBottom: number;
    height: number;
    radialSegments: number;
    heightSegments: number;
    openEnded: boolean;
    thetaStart: number;
    thetaLength: number;
    constructor(properties?: {
        radiusTop?: number;
        radiusBottom?: number;
        height?: number;
        radialSegments?: number;
        heightSegments?: number;
        openEnded?: boolean;
        thetaStart?: number;
        thetaLength?: number;
    });
    toBuilder(): GeometryBuilder;
}
