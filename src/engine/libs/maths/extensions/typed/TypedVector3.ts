import { Vector3Values, Vector3, Vector3Base } from "../../algebra/vectors/Vector3";
import { MathError } from "../../MathError";

export { TypedVector3Constructor };
export { TypedVector3 };
export { TypedVector3Base };

interface TypedVector3Constructor {
    readonly prototype: TypedVector3<TypedArray>;
    new(): TypedVector3<Float64Array>;
    new<T extends TypedArray>(type: Constructor<T>): TypedVector3<T>;
    new<T extends TypedArray>(type: Constructor<T>, values: Vector3Values): TypedVector3<T>;
}

interface TypedVector3<T extends TypedArray = Float64Array> extends Vector3 {
    readonly array: T;
    setArray<O extends T>(typedArray: O): this;
}

class TypedVector3Base<T extends TypedArray = Float64Array> extends Vector3Base {
    protected _array: T;

    constructor()
    constructor(type: Constructor<T>)
    constructor(type: Constructor<T>, values: Vector3Values)
    constructor(type?: Constructor<T>, values?: Vector3Values) {
        super();
        const ctor = (type || Float64Array) as Constructor<T>;
        this._array = values ? new ctor(values) : new ctor(3);
    }
    
    public get array(): T {
        return this._array;
    }

    public setArray<O extends T>(typedArray: O): this {
		if (typedArray.length < 3) {
			throw new MathError(`Array must be of length 3 at least.`);
		}
		this._array = typedArray;
		return this;
	}
}

const TypedVector3: TypedVector3Constructor = TypedVector3Base;