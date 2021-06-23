import { Matrix3, Matrix3Base } from "engine/libs/maths/algebra/matrices/Matrix3";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { Matrix3Pool };

const Matrix3Pool: StackPool<Matrix3> = new StackPool(Matrix3Base);