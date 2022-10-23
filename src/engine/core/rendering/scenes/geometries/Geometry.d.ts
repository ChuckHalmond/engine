import { GeometryBuilder } from "./GeometryBuilder";
export { Geometry };
export { GeometryBase };
interface GeometryConstructor {
}
interface Geometry {
}
declare class GeometryBase implements Geometry {
    toBuilder(): GeometryBuilder;
}
declare var Geometry: GeometryConstructor;
