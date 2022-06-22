import { Vector2 } from "../../algebra/vectors/Vector2";
export { Vector2List };
export { Vector2ListBase };
interface Vector2List {
    readonly array: WritableArrayLike<number>;
    readonly count: number;
    setArray(array: WritableArrayLike<number>): this;
    forEach(func: (vec: Vector2, idx: number) => void, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    indexOf(vec: Vector2): number;
    get(idx: number, vec: Vector2): Vector2;
    set(idx: number, vec: Vector2): void;
}
interface Vector2ListConstructor {
    readonly prototype: Vector2List;
    new (): Vector2List;
    new (array: WritableArrayLike<number>): Vector2List;
}
declare class Vector2ListBase implements Vector2List {
    private _array;
    constructor();
    constructor(array: WritableArrayLike<number>);
    get array(): WritableArrayLike<number>;
    get count(): number;
    setArray(array: WritableArrayLike<number>): this;
    forEach(func: (vec: Vector2, idx: number) => void, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    indexOf(vec: Vector2): number;
    get(idx: number, vec: Vector2): Vector2;
    set(idx: number, vec: Vector2): void;
}
declare const Vector2List: Vector2ListConstructor;
