import { StackPool } from "../../../patterns/pools/StackPool";
import { Vector3, Vector3Base } from "../../algebra/vectors/Vector3";

export { Vector3Pool };

const Vector3Pool: StackPool<Vector3> = new StackPool(Vector3Base);