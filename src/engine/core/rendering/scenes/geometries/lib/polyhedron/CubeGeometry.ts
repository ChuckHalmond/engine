import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";

/**
 *     v0_______v1
 *     |\        |
 *     |  \      |
 *     |    \    |
 *     |      \  |
 *    v2_______\v3
 *
 */
export class CubeGeometry extends GeometryBase {
	width: number;
	height: number;
	depth: number;
	widthSegments: number;
	heightSegments: number;
	depthSegments: number;

	constructor(properties?: {width?: number, height?: number, depth?: number, widthSegments?: number, heightSegments?: number, depthSegments?: number}) {
		super();
		const {width, height, depth, widthSegments, heightSegments, depthSegments} = properties ?? {};
		this.width = width ?? 1;
		this.height = height ?? 1;
		this.depth = depth ?? 1;
		this.widthSegments = widthSegments ?? 1;
		this.heightSegments = heightSegments ?? 1;
		this.depthSegments = depthSegments ?? 1;
	}
	
	toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();
		const {width, height, depth} = this;
		let {widthSegments, heightSegments, depthSegments} = this;
		widthSegments = Math.floor(widthSegments);
		heightSegments = Math.floor(heightSegments);
		depthSegments = Math.floor(depthSegments);

		const indices: number[] = [];
		const vertices: number[] = [];
		const uvs: number[] = [];
		let verticesCount = 0;

		[
			[2, 1, 0, -1, -1, depth, height, width, depthSegments, heightSegments],
			[2, 1, 0, +1, -1, depth, height, -width, depthSegments, heightSegments],
			[0, 2, 1, +1, +1, width, depth, height, widthSegments, depthSegments],
			[0, 2, 1, +1, -1, width, depth, -height, widthSegments, depthSegments],
			[0, 1, 2, +1, -1, width, height, depth, widthSegments, heightSegments],
			[0, 1, 2, -1, -1, width, height, -depth, widthSegments, heightSegments]
		].forEach(([u, v, w, udir, vdir, width, height, depth, gridX, gridY]) => {
			const segmentWidth = width / gridX;
			const segmentHeight = height / gridY;
			const widthHalf = width / 2;
			const heightHalf = height / 2;
			const depthHalf = depth / 2;
			const gridX1 = gridX + 1;
			const gridY1 = gridY + 1;
			let index = 0;
			for (let iy = 0; iy < gridY1; iy++) {
				const y = iy * segmentHeight - heightHalf;
				for (let ix = 0; ix < gridX1; ix++) {
					const x = ix * segmentWidth - widthHalf;
					const vertex = new Array(3);
					vertex[u] = x * udir;
					vertex[v] = y * vdir;
					vertex[w] = depthHalf;
					vertices.push(
						...vertex
					);
					uvs.push(ix / gridX, 1 - (iy / gridY));
					index++;
				}
			}
			for (let iy = 0; iy < gridY; iy++) {
				for (let ix = 0; ix < gridX; ix++) {
					const a = verticesCount + ix + gridX1 * iy;
					const b = verticesCount + ix + gridX1 * (iy + 1);
					const c = verticesCount + (ix + 1) + gridX1 * (iy + 1);
					const d = verticesCount + (ix + 1) + gridX1 * iy;
					indices.push(a, b, d);
					indices.push(b, c, d);
				}
			}
			verticesCount += index;
		});

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

/*const directions = [Space.left, Space.right, Space.up, Space.down, Space.forward, Space.backward];
const transform = new Transform();
const dimensions = new Matrix3([
	this.width / 2, 0, 0,
	0, this.height / 2, 0,
	0, 0, this.depth / 2
]);
const [forward, right, up] = Vector3Pool.acquire(3);
directions.forEach((direction) => {
	switch (direction.dot(Space.up)) {
		case 1: 
			transform.lookAt(direction.clone().scale(-1), Space.backward);
			break;
		case -1: 
			transform.lookAt(direction.clone().scale(-1), Space.forward);
			break;
		default:
			transform.lookAt(direction.clone().scale(-1), Space.up);
			break;
	}
	const forwardArray = transform.getForward(forward).mult(dimensions).array;
	const rightArray = transform.getRight(right).mult(dimensions).array;
	const upArray = transform.getUp(up).mult(dimensions).array;
	const upperLeftVertex = forwardArray.map((forward_i, i) => forward_i - rightArray[i] + upArray[i]);
	const upperLeftUV = [0, 0];
	const lowerLeftVertex = forwardArray.map((forward_i, i) => forward_i - rightArray[i] - upArray[i]);
	const lowerLeftUV = [0, 1];
	const lowerRightVertex = forwardArray.map((forward_i, i) => forward_i + rightArray[i] - upArray[i]);
	const lowerRightUV = [1, 1];
	const upperRightVertex = forwardArray.map((forward_i, i) => forward_i + rightArray[i] + upArray[i]);
	const upperRightUV = [1, 0];
	builder.addQuadFaceVertices(
		upperLeftVertex, lowerLeftVertex, lowerRightVertex, upperRightVertex,  {
			uv: [upperLeftUV, lowerLeftUV, lowerRightUV, upperRightUV]
		}
	);
});
Vector3Pool.release(3);*/