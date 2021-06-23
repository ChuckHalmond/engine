import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
import { Vector2Pool } from "engine/libs/maths/extensions/pools/Vector2Pools";
import { clamp } from "engine/libs/maths/Snippets";

export { Vector2List };
export { Vector2ListBase };

interface Vector2List {
    readonly array: ArrayLike<number>;
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
    new(): Vector2List;
    new(array: WritableArrayLike<number>): Vector2List;
}

class Vector2ListBase implements Vector2List {
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
        return Math.floor(this._array.length / 2);
    }

    public setArray(array: WritableArrayLike<number>): this {
		this._array = array;
		return this;
    }

    public forEach(func: (vec: Vector2, idx: number) => void,
        options: {
            idxFrom: number;
            idxTo: number;
        } = { idxTo: this.count, idxFrom: 0 }): void {
        
        const count = this.count;
        const idxTo = clamp(options.idxTo, 0, count);
        const idxFrom = clamp(options.idxFrom, 0, idxTo);

        let idxObj = idxFrom;

        Vector2Pool.acquireTemp(1, (vector) => {
            while (idxObj < count) {
                this.get(idxObj, vector);
                func(vector, idxObj);

                idxObj += 1;
            }
        });
    }

    public indexOf(vec: Vector2): number {
        const count = this.count;

        let idxBuf = 0,
            idxObj = 0,
            indexOf = -1;
        
            Vector2Pool.acquireTemp(1, (vector) => {
            while (idxBuf < count) {
                vector.readFromArray(this._array, idxBuf);
                if (vector.equals(vec)) {
                    
                    indexOf = idxObj;
                    break;
                }
                idxObj += 1;
                idxBuf += 2;
            }
        });

        return indexOf;
    }

    public get(idx: number, vec: Vector2): Vector2 {
        if (idx >= this.count) {
            throw new Error(`Index ${idx} out of bounds.`);
        }
        return vec.readFromArray(this._array, idx * 2);
    }

    public set(idx: number, vec: Vector2): void {
        if (idx >= this.count) {
            throw new Error(`Index ${idx} out of bounds.`);
        }
        vec.readFromArray(this._array, idx * 2);
    }
}

const Vector2List: Vector2ListConstructor = Vector2ListBase;