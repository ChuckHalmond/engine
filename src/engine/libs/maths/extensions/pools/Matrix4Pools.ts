import { StackPool } from "../../../patterns/pools/StackPool";
import { Matrix4, Matrix4Base } from "../../algebra/matrices/Matrix4";

export { Matrix4Pool };

const Matrix4Pool: StackPool<Matrix4> = new StackPool(Matrix4Base);