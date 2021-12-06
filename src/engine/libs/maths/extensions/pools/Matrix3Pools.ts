import { StackPool } from "../../../patterns/pools/StackPool";
import { Matrix3, Matrix3Base } from "../../algebra/matrices/Matrix3";

export { Matrix3Pool };

const Matrix3Pool: StackPool<Matrix3> = new StackPool(Matrix3Base);