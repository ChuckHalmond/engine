import { Vector2List, Vector2ListBase } from "engine/libs/maths/extensions/lists/Vector2List";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { Vector2ListPool };

const Vector2ListPool: StackPool<Vector2List> = new StackPool(Vector2ListBase);