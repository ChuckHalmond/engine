import { Vector3List, Vector3ListBase } from "engine/libs/maths/extensions/lists/Vector3List";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { Vector3ListPool };

const Vector3ListPool: StackPool<Vector3List> = new StackPool(Vector3ListBase);