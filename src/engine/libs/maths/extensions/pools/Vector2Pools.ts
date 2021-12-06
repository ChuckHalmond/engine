import { StackPool } from "../../../patterns/pools/StackPool";
import { Vector2, Vector2Base } from "../../algebra/vectors/Vector2";

export { Vector2Pool };

const Vector2Pool: StackPool<Vector2> = new StackPool(Vector2Base);