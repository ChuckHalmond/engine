import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";
export { TetrahedronGeometry };
declare class TetrahedronGeometry extends GeometryBase {
    radius: number;
    detail: number;
    constructor(properties?: {
        radius?: number;
        detail?: number;
    });
    toBuilder(): GeometryBuilder;
}
