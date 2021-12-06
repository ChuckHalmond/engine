import { TypedVector3 } from "../../extensions/typed/TypedVector3";
/**
 *     y axis
 * 	      ^   z axis
 *     UP |   ^  FORWARD
 *        | /
 *        +------> x axis
 *         RIGHT
 *
 *  left-handed coordinates system
 *
 */
export { Space };
declare class Space {
    private constructor();
    static readonly xAxis: TypedVector3<Uint8Array>;
    static readonly yAxis: TypedVector3<Uint8Array>;
    static readonly zAxis: TypedVector3<Uint8Array>;
    static readonly right: TypedVector3<Uint8Array>;
    static readonly left: TypedVector3<Uint8Array>;
    static readonly up: TypedVector3<Uint8Array>;
    static readonly down: TypedVector3<Uint8Array>;
    static readonly forward: TypedVector3<Uint8Array>;
    static readonly backward: TypedVector3<Uint8Array>;
}
