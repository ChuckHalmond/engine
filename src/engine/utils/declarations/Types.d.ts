
type TypedArray =
    Float64Array | 
    Float32Array | Int32Array | Uint32Array | 
    Int16Array | Uint16Array | 
    Int8Array | Uint8Array | Uint8ClampedArray;

type WritableArrayLike<T> = {
    [index: number]: T;
    readonly length: number;
};

type Tag<K extends keyof HTMLElementTagNameMap> = `<${K}>`;

type List<T = any> = {
    [name: string]: T
}

type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>;
}

type Tuple<T, N extends number> = [T, ...T[]] & { length: N }

type SplittedTupleFunction<T, N extends number, R> =
    N extends 1 ? (arg0: T) => R :
    N extends 2 ? (arg0: T, arg1: T) => R :
    N extends 3 ? (arg0: T, arg1: T, arg2: T) => R :
    N extends 4 ? (arg0: T, arg1: T, arg2: T, arg3: T) => R :
    N extends 5 ? (arg0: T, arg1: T, arg2: T, arg3: T, arg4: T) => R :
    N extends 6 ? (arg0: T, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T) => R :
    N extends 7 ? (arg0: T, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T) => R :
    N extends 8 ? (arg0: T, arg1: T, arg2: T, arg3: T, arg4: T, arg5: T, arg6: T, arg7: T) => R : never;

type Constructor<T> = new(...args: any[]) => T;
type ConstructorPrototype<C extends Constructor<any>> = {
    constructor: C;
};

type Override<T1, T2> = Omit<T1, keyof T2> & T2;