import { GeometryBase } from "../Geometry";
import { GeometryBuilder } from "../GeometryBuilder";
export declare class ConeGeometry extends GeometryBase {
    radius: number;
    segment: number;
    height: number;
    constructor(properties?: {
        radius?: number;
        segment?: number;
        height?: number;
    });
    toBuilder(): GeometryBuilder;
}
