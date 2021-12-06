import { StackPool } from "../../../../patterns/pools/StackPool";
import { Vector2List, Vector2ListBase } from "../../lists/Vector2List";

export { Vector2ListPool };

const Vector2ListPool: StackPool<Vector2List> = new StackPool(Vector2ListBase);