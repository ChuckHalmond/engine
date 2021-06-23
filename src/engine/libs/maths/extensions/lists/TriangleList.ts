import { Triangle, TrianglePool } from "engine/libs/maths/geometry/primitives/Triangle";
import { Vector3Values } from "engine/libs/maths/algebra/vectors/Vector3";
import { clamp } from "engine/libs/maths/Snippets";

export { TriangleList };
export { TriangleListBase };

interface TriangleList {
    readonly array: ArrayLike<number>;
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
    new(): TriangleList;
    new(array: WritableArrayLike<number>): TriangleList;
}

class TriangleListBase implements TriangleList {
    private _array: WritableArrayLike<number>;
    
    constructor()
    constructor(array: WritableArrayLike<number>)
    constructor(array?: WritableArrayLike<number>) {
        this._array = array || [];
    }
    
    public get array(): ArrayLike<number> {
        return this._array;
    }

    public get count(): number {
        return Math.floor(this._array.length / 9);
    }

    public setArray(array: WritableArrayLike<number>): this {
		this._array = array;
		return this;
    }

    public get(idx: number, tri: Triangle): Triangle {
        if (idx >= this.count) {
            throw new Error(`Index ${idx} out of bounds.`);
        }
        return tri.readFromArray(this._array, idx * 9);
    }

    public set(idx: number, tri: Triangle): void {
        if (idx >= this.count) {
            throw new Error(`Index ${idx} out of bounds.`);

        }
        tri.writeIntoArray(this._array, idx * 9);
    }
    
    public indexOf(tri: Triangle): number {
        const count = this.count;

        let idxBuf = 0,
            idxObj = 0,
            indexOf = -1;
        
        const tempTri = TrianglePool.acquire();
        {
            while (idxBuf < count) {
                tempTri.readFromArray(this._array, idxBuf);
                if (tri.equals(tempTri)) {
                    indexOf = idxObj;
                    idxObj += 1;
                    break;
                }
                idxObj += 1;
                idxBuf += 9;
            }
        }
        TrianglePool.release(1);

        return indexOf;
    }

    public forEach(func: (triangle: Triangle, idx: number, ...args: any) => void,
        options: {
            idxFrom: number;
            idxTo: number;
        } = { idxTo: this.count, idxFrom: 0 }): void {
        
        const idxTo = clamp(options.idxTo, 0, this.count);
        const idxFrom = clamp(options.idxFrom, 0, idxTo);
        
        let idxObj = idxFrom;
        
        const tempTri = TrianglePool.acquire();
        {
            while (idxObj < idxTo) {

                this.get(idxObj, tempTri);

                func(tempTri, idxObj);
                idxObj += 1;
            }
        }
        TrianglePool.release(1);
    }

    public getIndexedPoints(indices: Vector3Values, tri: Triangle): void {
        tri.point1.readFromArray(this._array, indices[0]);
        tri.point2.readFromArray(this._array, indices[1]);
        tri.point3.readFromArray(this._array, indices[2]);
    }

    public forIndexedPoints(func: (tri: Triangle, idx: number, pointsIndices: Vector3Values) => void, indices: ArrayLike<number>,
        options: {
            idxFrom: number;
            idxTo: number;
        } = { idxTo: indices.length / 3, idxFrom: 0 }): void {
        
        const idxTo = clamp(options.idxTo, 0, indices.length / 3);
        const idxFrom = clamp(options.idxFrom, 0, idxTo);
        
        let idxBuf = idxFrom * 3;
        
        const tempTri = TrianglePool.acquire();
        {
            const pointsIndices: Vector3Values = [0, 0, 0];
            for (let idxObj = idxFrom; idxObj < idxTo; idxObj++) {
                pointsIndices[0] = indices[idxBuf    ];
                pointsIndices[1] = indices[idxBuf + 1];
                pointsIndices[2] = indices[idxBuf + 2];
                
                tempTri.point1.readFromArray(this._array, pointsIndices[0] * 3);
                tempTri.point2.readFromArray(this._array, pointsIndices[1] * 3);
                tempTri.point3.readFromArray(this._array, pointsIndices[2] * 3);

                func(tempTri, idxObj, pointsIndices);
                idxBuf += 3;
            }
        }
        TrianglePool.release(1);
    }
}

const TriangleList: TriangleListConstructor = TriangleListBase;