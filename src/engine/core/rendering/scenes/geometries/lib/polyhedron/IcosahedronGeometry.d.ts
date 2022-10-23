import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";
export { IcosahedronGeometry };
declare class IcosahedronGeometry extends GeometryBase {
    radius: number;
    detail: number;
    constructor(properties?: {
        radius?: number;
        detail?: number;
    });
    toBuilder(): GeometryBuilder;
}
