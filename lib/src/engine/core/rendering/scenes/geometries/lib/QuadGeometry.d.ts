import { GeometryBase } from "../geometry";
import { GeometryBuilder } from "../GeometryBuilder";
export { QuadGeometry };
declare class QuadGeometry extends GeometryBase {
    width: number;
    height: number;
    widthSegment: number;
    heightSegment: number;
    constructor(properties?: {
        width?: number;
        height?: number;
        widthSegment?: number;
        heightSegment?: number;
    });
    toBuilder(): GeometryBuilder;
}
