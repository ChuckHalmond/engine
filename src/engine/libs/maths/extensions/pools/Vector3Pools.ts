import { StackPool } from "../../../patterns/pools/StackPool";
import { Matrix4 } from "../../algebra/matrices/Matrix4";
import { Vector3, Vector3Constructor } from "../../algebra/vectors/Vector3";

export { Vector3Pool };

class Vector3PoolBase extends StackPool<Vector3> implements StackPool<Vector3> {
    private _buffer: Float32Array;
    private _bufferViews: Array<WritableArrayLike<number>>;
    private _extensions: Array<WritableArrayLike<number>>;

    constructor(ctor: Vector3Constructor, options?: any) {
        super(ctor, options);
        this._buffer = new Float32Array(0);
        this._bufferViews = Array(options?.size || 0).fill(0).map(() => {
            return this._buffer.subarray();
        });
        this._extensions = [];
    }
}

const Vector3Pool: StackPool<Vector3> = new Vector3PoolBase(Vector3);