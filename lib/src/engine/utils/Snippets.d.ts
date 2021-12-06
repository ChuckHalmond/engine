export { isNotNull };
export { crashIfNull };
export { hasMemberOfPrototype };
export { isOfPrototype };
export { hasFunctionMember };
export { buildArrayFromIndexedArrays };
export { safeQuerySelector };
declare function isNotNull<O extends any>(obj: O): obj is Exclude<O, null>;
declare function crashIfNull<O extends any>(obj: O): Exclude<O, null>;
declare function hasMemberOfPrototype<K extends string, P extends object>(obj: any, key: K, ctor: new (...args: any) => P): obj is {
    [key in K]: P;
};
declare function isOfPrototype<P extends object>(obj: any, ctor: new (...args: any) => P): obj is P;
declare function hasFunctionMember<K extends string>(obj: any, key: K): obj is {
    [key in K]: Function;
};
declare function buildArrayFromIndexedArrays(arrays: number[][], indexes: ArrayLike<number>): number[];
declare function safeQuerySelector<E extends Element>(parent: ParentNode, query: string): E;
