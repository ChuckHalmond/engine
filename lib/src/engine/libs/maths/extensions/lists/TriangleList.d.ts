import { Vector3Values } from "../../algebra/vectors/Vector3";
import { Triangle } from "../../geometry/primitives/Triangle";
export { TriangleList };
export { TriangleListBase };
interface TriangleList {
    readonly array: WritableArrayLike<number>;
    readonly count: number;
    setArray(array: WritableArrayLike<number>): this;
    get(idx: number, tri: Triangle): Triangle;
    set(idx: number, tri: Triangle): void;
    indexOf(tri: Triangle): number;
    forEach(func: (tri: Triangle, idx: number) => void, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    getIndexedPoints(indices: Vector3Values, triangle: Triangle): void;
    forIndexedPoints(func: (tri: Triangle, idx: number, pointsIndices: Vector3Values) => void, indices: ArrayLike<number>, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
}
interface TriangleListConstructor {
    readonly prototype: TriangleList;
    new (): TriangleList;
    new (array: WritableArrayLike<number>): TriangleList;
}
declare class TriangleListBase implements TriangleList {
    private _array;
    constructor();
    constructor(array: WritableArrayLike<number>);
    get array(): WritableArrayLike<number>;
    get count(): number;
    setArray(array: WritableArrayLike<number>): this;
    get(idx: number, tri: Triangle): Triangle;
    set(idx: number, tri: Triangle): void;
    indexOf(tri: Triangle): number;
    forEach(func: (triangle: Triangle, idx: number, ...args: any) => void, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    getIndexedPoints(indices: Vector3Values, tri: Triangle): void;
    forIndexedPoints(func: (tri: Triangle, idx: number, pointsIndices: Vector3Values) => void, indices: ArrayLike<number>, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
}
declare const TriangleList: TriangleListConstructor;
