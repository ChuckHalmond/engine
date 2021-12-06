import { StackPool } from "../../../patterns/pools/StackPool";
import { Vector4, Vector4Base } from "../../algebra/vectors/Vector4";

export { Vector4Pool };

const Vector4Pool: StackPool<Vector4> = new StackPool(Vector4Base);