import { StackPool } from "../../../../patterns/pools/StackPool";
import { TriangleList, TriangleListBase } from "../../lists/TriangleList";

export { TriangleListPool };

const TriangleListPool: StackPool<TriangleList> = new StackPool(TriangleListBase);