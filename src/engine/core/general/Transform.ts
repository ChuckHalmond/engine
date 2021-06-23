
import { Quaternion } from "engine/libs/maths/algebra/quaternions/Quaternion";
import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { UUID, UUIDGenerator } from "engine/libs/maths/statistics/random/UUIDGenerator";
import { Object3D } from "../rendering/scenes/objects/Object3D";
import { Node, NodeBase } from "engine/libs/structures/trees/Node";

export { Transform };
export { isTransform };
export { TransformBase };

function isTransform(obj: any): obj is Transform {
    return (obj as Transform).isTransform;
}

interface TransformConstructor {
    readonly prototype: Transform;
    new(owner?: Object3D): Transform;
}

interface Transform extends Node<Transform> {
    readonly isTransform: true;
    readonly uuid: UUID;
    readonly owner: Object3D | null;

    localPosition: Vector3;
    globalPosition: Vector3;
    rotation: Quaternion;
    localScale: Vector3;

    left: Vector3;
    up: Vector3;
    forward: Vector3;

    root(): Transform;

    translate(vec: Vector3): this;
    scale(vec: Vector3): this;
    rotate(quat: Quaternion): this;
    lookAt(target: Vector3, up: Vector3): this;
}

class TransformBase extends NodeBase<TransformBase> implements Transform {
    public readonly isTransform: true;
    public readonly uuid: UUID;
    public readonly owner: Object3D | null;

    private _localMatrixArray: TypedArray;
    private _globalMatrixArray: TypedArray;

    private _localMatrix: Matrix4;
    private _globalMatrix: Matrix4;

    private _array: TypedArray;
    private _localPosition: Vector3;
    private _globalPosition: Vector3;
    private _rotation: Quaternion;
    private _localScale: Vector3;

    private _up: Vector3;
    private _left: Vector3;
    private _forward: Vector3;

    private _hasChanged: boolean;

    constructor(owner?: Object3D) {
        super();
        
        this.isTransform = true;
        this.uuid = UUIDGenerator.newUUID();
        this.owner = owner || null;

        this._localMatrixArray = new Float32Array(16);
        this._globalMatrixArray = new Float32Array(16);

        this._localMatrix = new Matrix4().setArray(this._localMatrixArray).setIdentity();
        this._globalMatrix = new Matrix4().setArray(this._globalMatrixArray).setIdentity();

        const localPosLength = 3;
        const globalPosLength = 3;
        const rotationLength = 4;
        const localScaleLength = 3;
        const upLength = 3;
        const leftLength = 3;
        const forwardLength = 3;

        this._array = new Float64Array(
            localPosLength + globalPosLength + rotationLength + localScaleLength +
            upLength + leftLength + forwardLength
        );
        
        let storageIdx = 0;
        this._localPosition = new Vector3().setArray(this._array.subarray(storageIdx, storageIdx += localPosLength));
        this._globalPosition = new Vector3().setArray(this._array.subarray(storageIdx, storageIdx += globalPosLength));
        this._rotation = new Quaternion().setArray(this._array.subarray(storageIdx, storageIdx += rotationLength));
        this._localScale = new Vector3().setArray(this._array.subarray(storageIdx, storageIdx += localScaleLength));
        this._up = new Vector3().setArray(this._array.subarray(storageIdx, storageIdx += upLength));
        this._left = new Vector3().setArray(this._array.subarray(storageIdx, storageIdx += leftLength));
        this._forward = new Vector3().setArray(this._array.subarray(storageIdx, storageIdx += forwardLength));

        this._hasChanged = true;
    }

    public get localPosition(): Vector3 {
        return this._localPosition.setValues([
            this._localMatrixArray[12], this._localMatrixArray[13], this._localMatrixArray[14]
        ]);
    }

    public set localPosition(position: Vector3) {
        this._localMatrixArray[12] = position.x;
        this._localMatrixArray[13] = position.y;
        this._localMatrixArray[14] = position.z;
        
        this._hasChanged = true;
    }

    public get globalPosition(): Vector3 {
        return this._globalPosition.setValues([
            this._localMatrixArray[12], this._localMatrixArray[13], this._localMatrixArray[14]
        ]);
    }

    public set globalPosition(position: Vector3) {
        this._globalMatrixArray[12] = position.x;
        this._globalMatrixArray[13] = position.y;
        this._globalMatrixArray[14] = position.z;

        this._hasChanged = true;
    }

    public get rotation(): Quaternion {
        return this._rotation.setFromTransformMatrix(this._localMatrix);
    }

    public set rotation(rotation: Quaternion) {
        this._localMatrix.setUpper33(rotation.asMatrix33());

        this._hasChanged = true;
    }

    public get localScale(): Vector3 {
        return this._localScale.setValues([
            this._localMatrixArray[0], this._localMatrixArray[5], this._localMatrixArray[10]
        ]);
    }

    public set localScale(scale: Vector3) {
        this._globalMatrixArray[ 0] = scale.x;
        this._globalMatrixArray[ 5] = scale.y;
        this._globalMatrixArray[10] = scale.z;
        
        this._hasChanged = true;
    }
    
    public get left(): Vector3 {
        const g = this._globalMatrix.array;
        return this._left.setValues([
            g[0], g[4], g[8]
        ]);
    }

    public get up(): Vector3 {
        const g = this._globalMatrix.array;
        return this._up.setValues([
            g[1], g[5], g[9]
        ]);
    }

    public get forward(): Vector3 {
        const g = this._globalMatrix.array;
        return this._forward.setValues([
            g[2], g[6], g[10]
        ]);
    }

    public root(): Transform {
        while (this._parent !== null) {
            return this._parent.root();
        }
        return this;
    }

    public get hasChanged() {
        return this._hasChanged;
    }

    public translate(vec: Vector3): this {
        this._globalMatrix.translate(vec);
        return this;
    }

    public scale(vec: Vector3): this {
        this._globalMatrix.scale(vec);
        return this;
    }

    public rotate(quat: Quaternion): this {
        this._globalMatrix.setUpper33(quat.asMatrix33());
        return this;
    }

    public lookAt(target: Vector3, up: Vector3): this {
        this._globalMatrix.lookAt(this.globalPosition, target, up);
        return this;
    }

    private _bottomUpRecursiveMatrixUpdate(): Matrix4 {
        if (this.parent == null) {
            return this._localMatrix;
        }
        else if (this.parent._hasChanged) {
            return this._localMatrix.mult(this.parent._bottomUpRecursiveMatrixUpdate());
        }
        else {
            return this._localMatrix.mult(this.parent._globalMatrix);
        }
    }

    private _topDownRecursiveFlagUpdate(): void {
        for (const child of this.children) {
            child._hasChanged = true;
            child._topDownRecursiveFlagUpdate();
        }
    }
}

const Transform: TransformConstructor = TransformBase;