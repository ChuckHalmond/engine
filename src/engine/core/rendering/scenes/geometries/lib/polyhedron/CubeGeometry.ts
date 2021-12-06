import { buildArrayFromIndexedArrays } from "../../../../../../utils/Snippets";
import { GeometryBase } from "../../Geometry";


export { CubeGeometry };

class CubeGeometry extends GeometryBase {
	constructor() {
		super({
			vertices: new Float32Array(cubeVertices),
			indices: new Uint8Array(cubeIndices),
			uvs: new Float32Array(cubeUVS),
		})
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
 *              v0_______v1
 *              |\        |
 *              |  \   f1 |
 *              |    \    |
 *              |  f0  \  |
 *    v0________v2_______\v3________v1
 *    |\        |\        |\        |
 *    |  \  f3  |  \  f5  |  \  f7  |
 *    |    \    |    \    |    \    |
 *    | f2   \  | f4   \  | f6   \  |
 *    v4_______\v5_______\v6_______\v7
 *              |\        |
 *              |  \   f9 |
 *              |    \    |
 *              |  f8  \  |
 *              v4_______\v7
 *              |\        |
 *              |  \  f11 |
 *              |    \    |
 *              | f10  \  |
 *              v0_______\v1
 *  
 * v0 = [-1, +1, -1]
 * v1 = [+1, +1, -1]
 * v2 = [-1, +1, +1]
 * v3 = [+1, +1, +1]
 * v4 = [-1, -1, -1]
 * v5 = [-1, -1, +1]
 * v6 = [+1, -1, +1]
 * v7 = [+1, -1, -1]
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

const cubeVerticesSet = [
	[-1, +1, -1], // v0
	[+1, +1, -1], // v1
	[-1, +1, +1], // v2
	[+1, +1, +1], // v3
	[-1, -1, -1], // v4
	[-1, -1, +1], // v5
	[+1, -1, +1], // v6
	[+1, -1, -1], // v7
];

const cubeVertices = buildArrayFromIndexedArrays(
	cubeVerticesSet,
	[
		0, 2, 3, 1, //  f0  f1
		0, 4, 5, 2, //  f2  f3
		2, 5, 6, 3, //  f4  f5
		3, 6, 7, 1, //  f6  f6
		5, 4, 7, 6, //  f8  f9
		4, 0, 1, 7, // f10 f11
	]
);

const cubeUVsSet = [
	[0, 0],
	[1, 0],
	[0, 1],
	[1, 1],
];

const cubeUVS = buildArrayFromIndexedArrays(
	cubeUVsSet,
	[
		0, 1, 3, 2, //  f0  f1
		0, 1, 3, 2, //  f2  f3
		0, 1, 3, 2, //  f4  f5
		0, 1, 3, 2, //  f6  f6
		0, 1, 3, 2, //  f8  f9
		0, 1, 3, 2, // f10 f11
	]
);

const cubeIndices = [
	 0,  1,  2, //  f0
	 0,  2,  3, //  f1
	 4,  5,  6, //  f2
	 4,  6,  7, //  f3
	 8,  9, 10, //  f4
	 8, 10, 11, //  f5
	12, 13, 14, //  f6
	12, 14, 15, //  f7
	16, 17, 18, //  f8
	16, 18, 19, //  f9
	20, 21, 22, // f10
	20, 22, 23, // f11
];