import { Vector3 } from "../../algebra/vectors/Vector3";

export class Space {

    private constructor () {};
    
    public static readonly origin:      Vector3 = new Vector3([ 0,  0,  0]);
    public static readonly right:       Vector3 = new Vector3([ 1,  0,  0]);
    public static readonly left:        Vector3 = new Vector3([-1,  0,  0]);
    public static readonly up:          Vector3 = new Vector3([ 0,  1,  0]);
    public static readonly down:        Vector3 = new Vector3([ 0, -1,  0]);
    public static readonly forward:     Vector3 = new Vector3([ 0,  0,  1]);
    public static readonly backward:    Vector3 = new Vector3([ 0,  0, -1]);
}