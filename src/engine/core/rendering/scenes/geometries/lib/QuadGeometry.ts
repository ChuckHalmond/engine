import { buildArrayFromIndexedArrays } from "../../../../../utils/Snippets";
import { GeometryBase } from "../geometry";

export { QuadGeometry };

class QuadGeometry extends GeometryBase {

	constructor() {
		super({
			vertices: new Float32Array(quadVertices),
			uvs: new Float32Array(quadUVS),
			indices: new Uint8Array(quadIndices)
		});
	}

}

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

 /**      
 *      v0       v1
 * 		+_______+      o   ^ 
 * 	    \      /\     /     \
 *       \   /   \    \     / 
 *        \/      \    \ _ /
 *        +--------+
 *       v2         v3
 * 
 *  counter-clockwise winding order:
 * 		v0 -> v2 -> v1
 * 		v1 -> v2 -> v3
 */
/**
 *     v0_______v1
 *     |\        |
 *     |  \   f1 |
 *     |    \    |
 *     |  f0  \  |
 *    v2_______\v3
 *  
 * v0 = [-1, +1, -1]
 * v1 = [+1, +1, -1]
 * v2 = [-1, +1, +1]
 * v3 = [+1, +1, +1]
 */
/**
 * 	texture mappings
 * 
 *           
 *    uv0_____uv1
 *    | \       |
 *    |   \     |
 *    |     \   |
 *    |       \ |
 *    uv2_____uv3
 *        
 * 
 * uv0 = [0,0]
 * uv1 = [1,0]
 * uv2 = [0,1]
 * uv3 = [1,1]
 */

const quadVerticesSet = [
	[-1, +1, 1], // v0
	[+1, +1, 1], // v1
	[-1, -1, 1], // v2
	[+1, -1, 1], // v3
];

const quadUVsSet = [
	[0, 0],
	[1, 0],
	[0, 1],
	[1, 1]
];

const quadVertices = buildArrayFromIndexedArrays(
	quadVerticesSet,
	[
		0, 2, 3, 1, //  f0  f1
	]
);

const quadUVS = buildArrayFromIndexedArrays(
	quadUVsSet,
	[
		0, 2, 3, 1, //  f0  f1
	]
);

const quadIndices = [
	0, 1, 2, //  f0
	0, 2, 3, //  f1
];