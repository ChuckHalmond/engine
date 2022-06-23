import { Vector3 } from "../../algebra/vectors/Vector3";

export { Vector3List };
export { Vector3ListBase };

interface Vector3List {
    readonly array: WritableArrayLike<number>;
    readonly count: number;

    setArray(array: WritableArrayLike<number>): this;

    forEach(func: (vec: Vector3, idx: number) => void, options?: {
        idxFrom: number;
        idxTo: number;
    }): void;
    forEachFromIndices(func: (vec: Vector3, idx: number, indice: number) => void, indices: ArrayLike<number>, options?: {
        idxFrom: number;
        idxTo: number;
    }): void
    indexOf(vec: Vector3): number;
    get(idx: number, vec: Vector3): Vector3;
    set(idx: number, vec: Vector3): void;
}

interface Vector3ListConstructor {
    readonly prototype: Vector3List;
    new(): Vector3List;
    new(array: WritableArrayLike<number>): Vector3List;
}

class Vector3ListBase implements Vector3List {
    private _array: WritableArrayLike<number>;
    
    constructor()
    constructor(array: WritableArrayLike<number>)
    constructor(array?: WritableArrayLike<number>) {
        this._array = array || [];
    }

    get array(): WritableArrayLike<number> {
        return this._array;
    }

    get count(): number {
        return Math.floor(this._array.length / 3);
    }

    setArray(array: WritableArrayLike<number>): this {
		this._array = array;
		return this;
    }

    forEach(func: (vec: Vector3, idx: number) => void,
        options: {
            idxFrom: number;
            idxTo: number;
        } = { idxTo: this.count, idxFrom: 0 }): void {
        const count = this.count;
        const idxTo = Math.min(Math.max(options.idxTo, 0), count);
        const idxFrom = Math.min(Math.max(options.idxFrom, 0), idxTo);

        let idxObj = idxFrom;
        const tempVec = new Vector3();
        while (idxObj < count) {
            this.get(idxObj, tempVec);
            func(tempVec, idxObj);
            idxObj += 1;
        }
    }

    forEachFromIndices(func: (vec: Vector3, idx: number, indice: number) => void, indices: ArrayLike<number>,
        options: {
            idxFrom: number;
            idxTo: number;
        } = { idxTo: indices.length / 3, idxFrom: 0 }): void {
        
        const idxTo = Math.min(Math.max(options.idxTo, 0), indices.length / 3);
        const idxFrom = Math.min(Math.max(options.idxFrom, 0), idxTo);
        
        let idxBuf = idxFrom * 3;

        const tempVec = new Vector3();
        for (let idxObj = idxFrom; idxObj < idxTo; idxObj++) {
            const indice = indices[idxBuf];
            this.get(indice, tempVec);
            func(tempVec, idxObj, indice);
        }
    }

    indexOf(vec: Vector3): number {
        const count = this.count;

        let idxBuf = 0,
            idxObj = 0,
            indexOf = -1;
    
        const tempVec = new Vector3();
        while (idxBuf < count) {
            tempVec.readFromArray(this._array, idxBuf);
            if (vec.equals(tempVec)) {
                
                indexOf = idxObj;
                break;
            }
            idxObj += 1;
            idxBuf += 3;
        }

        return indexOf;
    }

    get(idx: number, vec: Vector3): Vector3 {
        if (idx >= this.count) {
            throw new Error(`Index ${idx} out of bounds.`);
        }
        return vec.readFromArray(this._array, idx * 3);
    }

    set(idx: number, vec: Vector3): void {
        if (idx >= this.count) {
            throw new Error(`Index ${idx} out of bounds.`);
        }
        vec.writeIntoArray(this._array, idx * 3);
    }
}

const Vector3List: Vector3ListConstructor = Vector3ListBase;