import { Vector3 } from "../../algebra/vectors/Vector3";
export { Vector3List };
export { Vector3ListBase };
interface Vector3List {
    readonly array: ArrayLike<number>;
    readonly count: number;
    setArray(array: WritableArrayLike<number>): this;
    forEach(func: (vec: Vector3, idx: number) => void, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    indexOf(vec: Vector3): number;
    get(idx: number, vec: Vector3): Vector3;
    set(idx: number, vec: Vector3): void;
}
interface Vector3ListConstructor {
    readonly prototype: Vector3List;
    new (): Vector3List;
    new (array: WritableArrayLike<number>): Vector3List;
}
declare class Vector3ListBase implements Vector3List {
    private _array;
    constructor();
    constructor(array: WritableArrayLike<number>);
    get array(): ArrayLike<number>;
    get count(): number;
    setArray(array: WritableArrayLike<number>): this;
    forEach(func: (vec: Vector3, idx: number) => void, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    forEachFromIndices(func: (vec: Vector3, idx: number, indice: number) => void, indices: ArrayLike<number>, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    indexOf(vec: Vector3): number;
    get(idx: number, vec: Vector3): Vector3;
    set(idx: number, vec: Vector3): void;
}
declare const Vector3List: Vector3ListConstructor;
