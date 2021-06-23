export { isNotNull };
export { crashIfNull };
export { hasMemberOfPrototype };
export { isOfPrototype };
export { hasFunctionMember };
export { buildArrayFromIndexedArrays };
export { safeQuerySelector };

function isNotNull<O extends any>(obj: O): obj is Exclude<O, null> {
    return !(obj === null);
}

function crashIfNull<O extends any>(obj: O): Exclude<O, null> {
    if (isNotNull(obj)) {
        return obj;
    }
    throw new TypeError(`Argument is null.`);
}

function hasMemberOfPrototype<K extends string, P extends object>(obj: any, key: K, ctor: new(...args: any) => P): obj is { [key in K]: P } {
    return !!obj && (obj[key]).constructor.prototype === ctor.prototype;
}

function isOfPrototype<P extends object>(obj: any, ctor: new(...args: any) => P): obj is P {
    return obj.constructor.prototype === ctor.prototype;
}

function hasFunctionMember<K extends string>(obj: any, key: K): obj is { [key in K]: Function } {
    return (typeof obj[key] === 'function');
}

function buildArrayFromIndexedArrays(arrays: number[][], indexes: ArrayLike<number>): number[] {
    const len = indexes.length;
    const array = [];
    let i = -1;
    while (++i < len) {
        array.push(...arrays[indexes[i]]);
    }
    return array;
}

function safeQuerySelector<E extends Element>(parent: ParentNode, query: string): E {
    const element = parent.querySelector(query);
    if (isNotNull(element)) {
        return element as E;
    }
    throw new Error(`Query '${query}' returned no result.`);
}