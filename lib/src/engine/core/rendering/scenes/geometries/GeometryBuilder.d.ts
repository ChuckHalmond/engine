import { Geometry } from "./Geometry";
export { GeometryBuilder };
export { GeometryBuilderBase };
interface GeometryBuilder<G extends PartialGeometry = PartialGeometry> {
    attribute<S extends string, C extends new (array: WritableArrayLike<number>) => any>(name: S, array: WritableArrayLike<number>, container: C): GeometryBuilder<G & {
        [K in S]: InstanceType<C>;
    }>;
    build(): G;
}
interface PartialGeometry extends Partial<Geometry> {
}
declare class GeometryBuilderBase<G extends PartialGeometry> implements GeometryBuilder<G> {
    private geometry;
    constructor(geometry: G);
    attribute<S extends string, C extends new (array: WritableArrayLike<number>) => any>(name: S, array: WritableArrayLike<number>, container: C): GeometryBuilder<G & {
        [K in S]: InstanceType<C>;
    }>;
    build(): G;
}
