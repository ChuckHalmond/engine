import { Vector3Values, Vector3, Vector3Base } from "../../algebra/vectors/Vector3";
export { TypedVector3Constructor };
export { TypedVector3 };
export { TypedVector3Base };
interface TypedVector3Constructor {
    readonly prototype: TypedVector3<TypedArray>;
    new (): TypedVector3<Float64Array>;
    new <T extends TypedArray>(type: Constructor<T>): TypedVector3<T>;
    new <T extends TypedArray>(type: Constructor<T>, values: Vector3Values): TypedVector3<T>;
}
interface TypedVector3<T extends TypedArray = Float64Array> extends Vector3 {
    readonly array: T;
    setArray<O extends T>(typedArray: O): this;
}
declare class TypedVector3Base<T extends TypedArray = Float64Array> extends Vector3Base {
    protected _array: T;
    constructor();
    constructor(type: Constructor<T>);
    constructor(type: Constructor<T>, values: Vector3Values);
    get array(): T;
    setArray<O extends T>(typedArray: O): this;
}
declare const TypedVector3: TypedVector3Constructor;
