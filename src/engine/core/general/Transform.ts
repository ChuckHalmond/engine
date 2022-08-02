import { EulerAngles } from "../../libs/maths/algebra/angles/EulerAngles";
import { Matrix3 } from "../../libs/maths/algebra/matrices/Matrix3";
import { Matrix4 } from "../../libs/maths/algebra/matrices/Matrix4";
import { Quaternion, QuaternionPool } from "../../libs/maths/algebra/quaternions/Quaternion";
import { Vector3 } from "../../libs/maths/algebra/vectors/Vector3";
import { Vector3Pool } from "../../libs/maths/extensions/pools/Vector3Pools";
import { UUID, UUIDGenerator } from "../../libs/maths/statistics/random/UUIDGenerator";
import { Object3D } from "../rendering/scenes/objects/Object3D";

export { Transform };
export { TransformBase };

interface TransformConstructor {
    readonly prototype: Transform;
    new(): Transform;
    new(owner: Object3D): Transform;
}

const tempMatrix = new Matrix4();

interface Transform {
    hasChanged: boolean;

    readonly localArray: Float32Array;
    readonly array: Float32Array;
    readonly uuid: UUID;
    readonly owner: Object3D | null;

    localMatrix: Matrix4;
    matrix: Matrix4;

    getMatrix(matrix: Matrix4): Matrix4;
    setMatrix(matrix: Matrix4): this;
    getLocalMatrix(matrix: Matrix4): Matrix4;
    setLocalMatrix(matrix: Matrix4): this;

    getRight(vector: Vector3): Vector3;
    getLeft(vector: Vector3): Vector3;
    getUp(vector: Vector3): Vector3;
    getDown(vector: Vector3): Vector3;
    getForward(vector: Vector3): Vector3;
    getBackward(vector: Vector3): Vector3;

    getTranslation(vector: Vector3): Vector3;
    setTranslation(vector: Vector3): this;
    translate(vector: Vector3): this;

    getRotation(rotation: Quaternion): Quaternion;
    setRotation(rotation: Quaternion): this;
    rotate(rotation: Quaternion): this;

    getScaling(scaling: Vector3): Vector3;
    setScaling(scaling: Vector3): this;
    scale(scaling: Vector3): this;
    
    lookAt(target: Vector3, up: Vector3): this;
}

class TransformBase implements Transform {
    readonly localArray: Float32Array;
    readonly array: Float32Array;
    readonly uuid: UUID;
    readonly owner: Object3D | null;

    readonly matrix: Matrix4;
    readonly localMatrix: Matrix4;;

    hasChanged: boolean;
    readonly isStatic: boolean;

    constructor(owner?: Object3D, isStatic?: boolean) {
        this.uuid = UUIDGenerator.newUUID();
        this.owner = owner || null;

        this.isStatic = isStatic ?? false;
        
        this.array = new Float32Array(16);
        this.localArray = new Float32Array(16);

        this.matrix = new Matrix4(this.array).setIdentity();
        this.localMatrix = new Matrix4(this.localArray).setIdentity();

        this.hasChanged = false;
    }

    getMatrix(matrix: Matrix4): Matrix4 {
        const thisArray = this.array;
        const matrixArray = matrix.array;
        matrixArray[ 0] = thisArray[ 0];
        matrixArray[ 1] = thisArray[ 1];
        matrixArray[ 2] = thisArray[ 2];
        matrixArray[ 3] = thisArray[ 3];
        matrixArray[ 4] = thisArray[ 4];
        matrixArray[ 5] = thisArray[ 5];
        matrixArray[ 6] = thisArray[ 6];
        matrixArray[ 7] = thisArray[ 7];
        matrixArray[ 8] = thisArray[ 8];
        matrixArray[ 9] = thisArray[ 9];
        matrixArray[10] = thisArray[10];
        matrixArray[11] = thisArray[11];
        matrixArray[12] = thisArray[12];
        matrixArray[13] = thisArray[13];
        matrixArray[14] = thisArray[14];
        matrixArray[15] = thisArray[15];

        return matrix;
    }

    setMatrix(matrix: Matrix4): this {
        const thisArray = this.array;
        const matrixArray = matrix.array;
        thisArray[ 0] = matrixArray[ 0];
        thisArray[ 1] = matrixArray[ 1];
        thisArray[ 2] = matrixArray[ 2];
        thisArray[ 3] = matrixArray[ 3];
        thisArray[ 4] = matrixArray[ 4];
        thisArray[ 5] = matrixArray[ 5];
        thisArray[ 6] = matrixArray[ 6];
        thisArray[ 7] = matrixArray[ 7];
        thisArray[ 8] = matrixArray[ 8];
        thisArray[ 9] = matrixArray[ 9];
        thisArray[10] = matrixArray[10];
        thisArray[11] = matrixArray[11];
        thisArray[12] = matrixArray[12];
        thisArray[13] = matrixArray[13];
        thisArray[14] = matrixArray[14];
        thisArray[15] = matrixArray[15];

        return this;
    }

    getLocalMatrix(matrix: Matrix4): Matrix4 {
        const thisLocalArray = this.localArray;
        const matrixArray = matrix.array;
        matrixArray[ 0] = thisLocalArray[ 0];
        matrixArray[ 1] = thisLocalArray[ 1];
        matrixArray[ 2] = thisLocalArray[ 2];
        matrixArray[ 3] = thisLocalArray[ 3];
        matrixArray[ 4] = thisLocalArray[ 4];
        matrixArray[ 5] = thisLocalArray[ 5];
        matrixArray[ 6] = thisLocalArray[ 6];
        matrixArray[ 7] = thisLocalArray[ 7];
        matrixArray[ 8] = thisLocalArray[ 8];
        matrixArray[ 9] = thisLocalArray[ 9];
        matrixArray[10] = thisLocalArray[10];
        matrixArray[11] = thisLocalArray[11];
        matrixArray[12] = thisLocalArray[12];
        matrixArray[13] = thisLocalArray[13];
        matrixArray[14] = thisLocalArray[14];
        matrixArray[15] = thisLocalArray[15];

        return matrix;
    }

    setLocalMatrix(matrix: Matrix4): this {
        const thisLocalArray = this.localArray;
        const matrixArray = matrix.array;
        thisLocalArray[ 0] = matrixArray[ 0];
        thisLocalArray[ 1] = matrixArray[ 1];
        thisLocalArray[ 2] = matrixArray[ 2];
        thisLocalArray[ 3] = matrixArray[ 3];
        thisLocalArray[ 4] = matrixArray[ 4];
        thisLocalArray[ 5] = matrixArray[ 5];
        thisLocalArray[ 6] = matrixArray[ 6];
        thisLocalArray[ 7] = matrixArray[ 7];
        thisLocalArray[ 8] = matrixArray[ 8];
        thisLocalArray[ 9] = matrixArray[ 9];
        thisLocalArray[10] = matrixArray[10];
        thisLocalArray[11] = matrixArray[11];
        thisLocalArray[12] = matrixArray[12];
        thisLocalArray[13] = matrixArray[13];
        thisLocalArray[14] = matrixArray[14];
        thisLocalArray[15] = matrixArray[15];

        return this;
    }

    getRight(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = thisArray[0];
        vectorArray[1] = thisArray[1];
        vectorArray[2] = thisArray[2];
        return vector;
    }

    getLeft(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = -thisArray[0];
        vectorArray[1] = -thisArray[1];
        vectorArray[2] = -thisArray[2];
        return vector;
    }

    getUp(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = thisArray[4];
        vectorArray[1] = thisArray[5];
        vectorArray[2] = thisArray[6];
        return vector;
    }

    getDown(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = -thisArray[4];
        vectorArray[1] = -thisArray[5];
        vectorArray[2] = -thisArray[6];
        return vector;
    }

    getForward(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = thisArray[ 8];
        vectorArray[1] = thisArray[ 9];
        vectorArray[2] = thisArray[10];
        return vector;
    }

    getBackward(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = -thisArray[ 8];
        vectorArray[1] = -thisArray[ 9];
        vectorArray[2] = -thisArray[10];
        return vector;
    }

    getTranslation(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = thisArray[12];
        vectorArray[1] = thisArray[13];
        vectorArray[2] = thisArray[14];
        return vector;
    }

    setTranslation(vector: Vector3): this {
        const thisArray = this.array;
        const vectorArray = vector.array;
        thisArray[12] = vectorArray[0];
        thisArray[13] = vectorArray[1];
        thisArray[14] = vectorArray[2];
        return this;
    }

    translate(vector: Vector3): this {
        const thisArray = this.array;
        const vectorArray = vector.array;
        thisArray[12] += vectorArray[0];
        thisArray[13] += vectorArray[1];
        thisArray[14] += vectorArray[2];
        return this;
    }

    getScaling(vector: Vector3): Vector3 {
        const thisArray = this.array;
        const vectorArray = vector.array;
        vectorArray[0] = thisArray[ 0];
        vectorArray[1] = thisArray[ 5];
        vectorArray[2] = thisArray[10];
        return vector;
    }

    setScaling(vector: Vector3): this {
        const thisArray = this.array;
        const vectorArray = vector.array;
        thisArray[ 0] = vectorArray[0];
        thisArray[ 5] = vectorArray[1];
        thisArray[10] = vectorArray[2];
        return this;
    }

    scale(vector: Vector3): this {
        const thisArray = this.array;
        const vectorArray = vector.array;
        thisArray[ 0] *= vectorArray[0];
        thisArray[ 5] *= vectorArray[1];
        thisArray[10] *= vectorArray[2];
        return this;
    }

    getRotation(rotation: Quaternion): Quaternion {
        rotation.setMatrix(this.matrix);
        return rotation;
    }
    
    setRotation(rotation: Quaternion): this {
        this.matrix.setRotation(rotation);
        return this;
    }

    rotate(rotation: Quaternion): this {
        this.matrix.mult(
            rotation.getMatrix4(tempMatrix)
        );
        return this;
    }

    transformPoint(point: Vector3): Vector3 {
        return point;
    }

    transformDirection(direction: Vector3): Vector3 {
        return direction;
    }

    transformVector(vector: Vector3): Vector3 {
        return vector;
    }

    lookAt(target: Vector3, up: Vector3): this {
        const thisPosition = this.getTranslation(Vector3Pool.acquire(1)[0]);
        this.matrix.lookAt(thisPosition, target, up);
        Vector3Pool.release(1);
        return this;
    }
}

const Transform: TransformConstructor = TransformBase;