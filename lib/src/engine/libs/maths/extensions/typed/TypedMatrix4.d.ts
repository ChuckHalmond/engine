import { Matrix4Values, Matrix4, Matrix4Base } from "../../algebra/matrices/Matrix4";
export { TypedMatrix4Constructor };
export { TypedMatrix4 };
export { TypedMatrix4Base };
interface TypedMatrix4Constructor {
    readonly prototype: TypedMatrix4<TypedArray>;
    new (): TypedMatrix4<Float64Array>;
    new <T extends TypedArray>(type: Constructor<T>): TypedMatrix4<T>;
    new <T extends TypedArray>(type: Constructor<T>, values: Matrix4Values): TypedMatrix4<T>;
}
interface TypedMatrix4<T extends TypedArray = Float64Array> extends Matrix4 {
    readonly array: T;
    setArray<O extends T>(typedArray: O): this;
}
declare class TypedMatrix4Base<T extends TypedArray = Float64Array> extends Matrix4Base {
    protected _array: T;
    constructor();
    constructor(type: Constructor<T>);
    constructor(type: Constructor<T>, values: Matrix4Values);
    get array(): T;
    setArray<O extends T>(typedArray: O): this;
}
declare const TypedMatrix4: TypedMatrix4Constructor;
