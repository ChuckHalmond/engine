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

class Space {

    private constructor () {};
    
    public static readonly xAxis: TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [1, 0, 0]);
    public static readonly yAxis: TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [0, 1, 0]);
    public static readonly zAxis: TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [0, 0, 1]);
    
    public static readonly right:       TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [ 1,  0,  0]);
    public static readonly left:        TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [-1,  0,  0]);
    public static readonly up:          TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [ 0,  1,  0]);
    public static readonly down:        TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [ 0, -1,  0]);
    public static readonly forward:     TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [ 0,  0,  1]);
    public static readonly backward:    TypedVector3<Uint8Array> = new TypedVector3(Uint8Array, [ 0,  0, -1]);
}