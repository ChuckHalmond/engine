import { TriangleList, TriangleListBase } from "engine/libs/maths/extensions/lists/TriangleList";
import { StackPool } from "engine/libs/patterns/pools/StackPool";

export { TriangleListPool };

const TriangleListPool: StackPool<TriangleList> = new StackPool(TriangleListBase);