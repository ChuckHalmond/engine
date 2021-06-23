import { Matrix4, Matrix4Base, Matrix4Values } from "engine/libs/maths/algebra/matrices/Matrix4";
import { MathError } from "engine/libs/maths/MathError";

export { TypedMatrix4Constructor };
export { TypedMatrix4 };
export { TypedMatrix4Base };

interface TypedMatrix4Constructor {
    readonly prototype: TypedMatrix4<TypedArray>;
    new(): TypedMatrix4<Float64Array>;
    new<T extends TypedArray>(type: Constructor<T>): TypedMatrix4<T>;
    new<T extends TypedArray>(type: Constructor<T>, values: Matrix4Values): TypedMatrix4<T>;
}

interface TypedMatrix4<T extends TypedArray = Float64Array> extends Matrix4 {
    readonly array: T;
    setArray<O extends T>(typedArray: O): this;
}

class TypedMatrix4Base<T extends TypedArray = Float64Array> extends Matrix4Base {
    protected _array: T;

    constructor()
    constructor(type: Constructor<T>)
    constructor(type: Constructor<T>, values: Matrix4Values)
    constructor(type?: Constructor<T>, values?: Matrix4Values) {
        super();
        const ctor = (type || Float64Array) as Constructor<T>;
        this._array = values ? new ctor(values) : new ctor(16);
    }
    
    public get array(): T {
        return this._array;
    }

    public setArray<O extends T>(typedArray: O): this {
		if (typedArray.length < 16) {
			throw new MathError(`Array must be of length 16 at least.`);
		}
		this._array = typedArray;
		return this;
	}
}

const TypedMatrix4: TypedMatrix4Constructor = TypedMatrix4Base;