import { buildArrayFromIndexedArrays } from "../../../../../../utils/Snippets";
import { GeometryBase } from "../../Geometry";
import { GOLDEN_RATIO as p } from "../../../../../../libs/maths/geometry/GeometryConstants";
import { GeometryBuilder } from "../../GeometryBuilder";

export { IcosahedronGeometry };

class IcosahedronGeometry extends GeometryBase {
	vertices: Float32Array;
	uvs: Float32Array;
	indices: Uint8Array;

	constructor() {
		super();
		this.vertices = new Float32Array(icosahedronVertices);
		this.uvs = new Float32Array(icosahedronUVS);
		this.indices = new Uint8Array(icosahedronIndices);
	}

	toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();
		const {indices, vertices, uvs} = this;
		const indicesCount = indices.length;
		for (let i = 0; i < indicesCount; i += 3) {
			let vi1 = 3 * indices[i    ];
			let vi2 = 3 * indices[i + 1];
			let vi3 = 3 * indices[i + 2];
			let ui1 = 2 * indices[i    ];
			let ui2 = 2 * indices[i + 1];
			let ui3 = 2 * indices[i + 2];
			builder.addTriangleFaceVertices(
				[vertices[vi1], vertices[vi1 + 1], vertices[vi1 + 2]],
				[vertices[vi2], vertices[vi2 + 1], vertices[vi2 + 2]],
				[vertices[vi3], vertices[vi3 + 1], vertices[vi3 + 2]], {
					uv: [
						[uvs[ui1], uvs[ui1 + 1]],
						[uvs[ui2], uvs[ui2 + 1]],
						[uvs[ui3], uvs[ui3 + 1]]
					]
				}
			);
		}
		return builder;
	}
}

/**
 * 
 *      v0        v0        v0        v0        v0
 *     / \       / \       / \       / \       / \ 
 *    /   \     /   \     /   \     /   \     /   \ 
 *   /     \   /     \   /     \   /     \   /     \ 
 *  /  f0   \ /  f1   \ /  f2   \ /  f3   \ /  f4   \
 * v1--------v2--------v3--------v4--------v5--------v1
 *  \        /\        /\        /\        /\        /\   
 *   \  f5  /  \  f7  /  \  f9  /  \  11  /  \ f13  /  \
 *    \    /    \    /    \    /    \    /    \    /    \
 *     \  /  f6  \  /  f8  \  / f10  \  / f12  \  / f14  \
 *      v6--------v7--------v8--------v9--------v10-------v6
 *       \        /\        /\        /\        /\        /
 * 	      \ f15  /  \ f16  /  \ f17  /  \ f18  /  \ f19  /
 *         \    /    \    /    \    /    \    /    \    /
 *          \  /      \  /      \  /      \  /      \  /
 *           v11       v11       v11       v11       v11
 * 
 * v0  = [ 0, +p, +h]
 * v1  = [+h,  0, +p]
 * v2  = [+p, +h,  0]
 * v3  = [ 0, +p, -h]
 * v4  = [-p, +h,  0]
 * v5  = [-h,  0, +p]
 * v6  = [+p, -h,  0]
 * v7  = [+h,  0, -p]
 * v8  = [-h,  0, -p]
 * v9  = [-p, -h,  0]
 * v10 = [ 0, -p, +h]
 * v11 = [ 0, -p, -h]
 * 
 */

const icosahedronVerticesSet = [
	[0, +p, +1], // v0
	[+1, 0, +p], // v1
	[+p, +1, 0], // v2
	[0, +p, -1], // v3
	[-p, +1, 0], // v4
	[-1, 0, +p], // v5
	[+p, -1, 0], // v6
	[+1, 0, -p], // v7
	[-1, 0, -p], // v8
	[-p, -1, 0], // v9
	[0, -p, +1], // v10
	[0, -p, -1], // v11
];

const IcosahedronUVsSet = [
	[0, 0],
	[1, 0],
	[0, 1],
	[1, 1],
];

const icosahedronVertices = buildArrayFromIndexedArrays(
	icosahedronVerticesSet,
	[
		0,  1,  2, // f0
		0,  2,  3, // f1
		0,  3,  4, // f2
		0,  4,  5, // f3
		0,  5,  1, // f4
		1,  6,  2, // f5
		2,  6,  7, // f6
		2,  7,  3, // f7
		3,  7,  8, // f8
		3,  8,  4, // f9
		4,  8,  9, // f10
		4,  9,  5, // f11
		5,  9, 10, // f12
		5, 10,  1, // f13
		1, 10,  6, // f14
		6, 11,  7, // f15
		7, 11,  8, // f16
		8, 11,  9, // f17
		9, 11, 10, // f18
		10, 11,  6, // f19
	]
);

const icosahedronUVS = buildArrayFromIndexedArrays(
	IcosahedronUVsSet,
	[
		1, 2, 0, // f0
		1, 2, 0, // f1
		1, 2, 0, // f2
		1, 2, 0, // f3
		1, 2, 0, // f4
		1, 2, 0, // f5
		1, 2, 0, // f6
		1, 2, 0, // f7
		1, 2, 0, // f8
		1, 2, 0, // f9
		1, 2, 0, // f10
		1, 2, 0, // f11
		1, 2, 0, // f12
		1, 2, 0, // f13
		1, 2, 0, // f14
		1, 2, 0, // f15
		1, 2, 0, // f16
		1, 2, 0, // f17
		1, 2, 0, // f18
		1, 2, 0, // f19
	]
);

const icosahedronIndices = [
     0,  1,  2, // f0
     3,  4,  5, // f1
     6,  7,  8, // f2
	 9, 10, 11, // f3
	12, 13, 14, // f4
	15, 16, 17, // f5
	18, 19, 20, // f6
	21, 22, 23, // f7
	24, 25, 26, // f8
	27, 28, 29, // f9
	30, 31, 32, // f10
   	33, 34, 35, // f11
   	36, 37, 38, // f12
   	39, 40, 41, // f13
   	42, 43, 44, // f14
  	45, 46, 47, // f15
  	48, 49, 50, // f16
  	51, 52, 53, // f17
  	54, 55, 56, // f18
  	57, 58, 59, // f19
];
