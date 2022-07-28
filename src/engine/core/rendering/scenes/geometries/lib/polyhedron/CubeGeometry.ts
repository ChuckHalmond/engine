import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";

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
					// indices.push(a, b, d);
					// indices.push(b, c, d);
					indices.push(a, b, d, c);
				}
			}
			verticesCount += index;
		});
		
		const {length: indicesCount} = indices;
		const verticesArray: number[] = [];
		const uvsArray: number[][] = [];
		for (let i = 0; i < indicesCount; i += 4) {
			const vi1 = 3 * indices[i], vi2 = 3 * indices[i + 1], vi3 = 3 * indices[i + 2], vi4 = 3 * indices[i + 3];
			const ui1 = 2 * indices[i], ui2 = 2 * indices[i + 1], ui3 = 2 * indices[i + 2], ui4 = 2 * indices[i + 3];
			let v1 = verticesArray[vi1], v2 = verticesArray[vi2], v3 = verticesArray[vi3], v4 = verticesArray[vi4];
			if (v1 === undefined) {
				v1 = builder.addVertex([vertices[vi1], vertices[vi1 + 1], vertices[vi1 + 2]]), verticesArray[vi1] = v1;
			}
			if (v2 === undefined) {
				v2 = builder.addVertex([vertices[vi2], vertices[vi2 + 1], vertices[vi2 + 2]]), verticesArray[vi2] = v2;
			}
			if (v3 === undefined) {
				v3 = builder.addVertex([vertices[vi3], vertices[vi3 + 1], vertices[vi3 + 2]]), verticesArray[vi3] = v3;
			}
			//
			if (v4 === undefined) {
				v4 = builder.addVertex([vertices[vi4], vertices[vi4 + 1], vertices[vi4 + 2]]), verticesArray[vi4] = v4;
			}
			let uv1 = uvsArray[ui1], uv2 = uvsArray[ui2], uv3 = uvsArray[ui3], uv4 = uvsArray[ui4];
			if (uv1 === undefined) {
				uv1 = [uvs[ui1], uvs[ui1 + 1]], uvsArray[ui1] = uv1;
			}
			if (uv2 === undefined) {
				uv2 = [uvs[ui2], uvs[ui2 + 1]], uvsArray[ui2] = uv2;
			}
			if (uv3 === undefined) {
				uv3 = [uvs[ui3], uvs[ui3 + 1]], uvsArray[ui3] = uv3;
			}
			//
			if (uv4 === undefined) {
				uv4 = [uvs[ui4], uvs[ui4 + 1]], uvsArray[ui4] = uv4;
			}
			/*builder.addTriangleFace(v1, v2, v3, {
				uv: [uv1, uv2, uv3]
			});*/
			builder.addQuadFace(v1, v2, v3, v4, {
				uv: [uv1, uv2, uv3, uv4]
			});
		}
		
		return builder;
	}
}