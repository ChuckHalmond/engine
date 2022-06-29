import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";
export { DodecahedronGeometry };
declare class DodecahedronGeometry extends GeometryBase {
    radius: number;
    detail: number;
    constructor(properties?: {
        radius?: number;
        detail?: number;
    });
    toBuilder(): GeometryBuilder;
}
