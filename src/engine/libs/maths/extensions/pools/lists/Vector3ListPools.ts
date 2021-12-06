import { StackPool } from "../../../../patterns/pools/StackPool";
import { Vector3List, Vector3ListBase } from "../../lists/Vector3List";

export { Vector3ListPool };

const Vector3ListPool: StackPool<Vector3List> = new StackPool(Vector3ListBase);