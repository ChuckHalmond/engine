import { GeometryBase } from "../Geometry";
import { GeometryBuilder } from "../GeometryBuilder";
export declare class SphereGeometry extends GeometryBase {
    radius: number;
    widthSegment: number;
    heightSegment: number;
    phiStart: number;
    phiLength: number;
    thetaStart: number;
    thetaLength: number;
    constructor(properties?: {
        radius?: number;
        widthSegment?: number;
        heightSegment?: number;
        phiStart?: number;
        phiLength?: number;
        thetaStart?: number;
        thetaLength?: number;
    });
    toBuilder(): GeometryBuilder;
}
