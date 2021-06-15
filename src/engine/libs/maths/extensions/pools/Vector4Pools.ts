import { Vector4, Vector4Base } from "engine/libs/maths/algebra/vectors/Vector4";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { Vector4Pool };

const Vector4Pool: StackPool<Vector4> = new StackPool(Vector4Base);