import { buildArrayFromIndexedArrays } from "../../../../../../utils/Snippets";
import { GeometryBase } from "../../Geometry";

export { TetrahedronGeometry };

class TetrahedronGeometry extends GeometryBase {

	constructor() {
		super({
			vertices: new Float32Array(tetrahedronVertices),
			uvs: new Float32Array(tetrahedronUVS),
			indices: new Uint8Array(tetrahedronIndices)
		})
	}
}

/**
 *          v0
 *         / \
 *        /   \
 *       /     \
 *      /  f0   \
 *     v1--------v2
 *     /\        /\
 * 	  /  \  f2  /  \
 *   /    \    /    \
 *  /  f1  \  /  f3  \
 * v0-------v3--------v0
 * 
 * v0 = [+1,-1,+1]
 * v1 = [-1,+1,+1]
 * v2 = [+1,+1,-1]
 * v3 = [+1,+1,+1]
 * 
 */

const tetrahedronVerticesSet = [
	[+1, -1, +1], // v0
	[-1, +1, +1], // v1
	[+1, +1, -1], // v2
	[+1, +1, +1], // v3
];

const tetrahedronUVsSet = [
	[0, 0],
	[1, 0],
	[0, 1],
	[1, 1],
];

const tetrahedronVertices = buildArrayFromIndexedArrays(
	tetrahedronVerticesSet,
	[
		0, 1, 2, // f0
		1, 0, 3, // f1
		1, 3, 2, // f2
		2, 3, 0, // f3
	]
);

const tetrahedronUVS = buildArrayFromIndexedArrays(
	tetrahedronUVsSet,
	[
		1, 2, 0, // f0
		1, 3, 0, // f1
		2, 3, 0, // f2
		1, 2, 3, // f3
	]
);

const tetrahedronIndices = [
    0,  1,  2, // f0
    3,  4,  5, // f1
    6,  7,  8, // f2
    9, 10, 11, // f3
];