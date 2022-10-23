import { BoundingBox } from "../scenes/geometries/bounding/BoundingBox";
export { AABBHelper };
interface AABBHelperConstructor {
}
interface AABBHelper {
    readonly aabb: BoundingBox;
}
declare var AABBHelper: AABBHelperConstructor;
