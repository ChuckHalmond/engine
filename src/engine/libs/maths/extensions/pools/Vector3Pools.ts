import { Vector3, Vector3Base } from "engine/libs/maths/algebra/vectors/Vector3";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { Vector3Pool };

const Vector3Pool: StackPool<Vector3> = new StackPool(Vector3Base);