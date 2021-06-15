import { Matrix4, Matrix4Base } from "engine/libs/maths/algebra/matrices/Matrix4";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { Matrix4Pool };

const Matrix4Pool: StackPool<Matrix4> = new StackPool(Matrix4Base);