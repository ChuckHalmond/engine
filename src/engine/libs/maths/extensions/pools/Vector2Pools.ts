import { Vector2, Vector2Base } from "engine/libs/maths/algebra/vectors/Vector2";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { Vector2Pool };

const Vector2Pool: StackPool<Vector2> = new StackPool(Vector2Base);