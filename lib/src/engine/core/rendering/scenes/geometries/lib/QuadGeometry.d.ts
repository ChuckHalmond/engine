import { GeometryBase } from "../geometry";
import { GeometryBuilder } from "../GeometryBuilder";
export { QuadGeometry };
declare class QuadGeometry extends GeometryBase {
    width: number;
    height: number;
    widthSegments: number;
    heightSegments: number;
    constructor(properties?: {
        width?: number;
        height?: number;
        widthSegments?: number;
        heightSegments?: number;
    });
    toBuilder(): GeometryBuilder;
}
