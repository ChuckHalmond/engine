import { GeometryBase } from "../geometry";
import { GeometryBuilder } from "../GeometryBuilder";

export { QuadGeometry };

class QuadGeometry extends GeometryBase {
	width: number;
	height: number;
	widthSegments: number;
	heightSegments: number;

	constructor(properties?: {width?: number, height?: number, widthSegments?: number, heightSegments?: number}) {
		super();
		this.width = properties?.width ?? 1;
		this.height = properties?.height ?? 1;
		this.widthSegments = properties?.widthSegments ?? 1;
		this.heightSegments = properties?.heightSegments ?? 1;
	}
	
	toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();
		const {heightSegments, widthSegments, width, height} = this;
		const widthHalf = width / 2;
		const heightHalf = height / 2;

		const gridX = Math.floor(widthSegments);
		const gridY = Math.floor(heightSegments);

		const gridX1 = gridX + 1;
		const gridY1 = gridY + 1;

		const segmentWidth = width / gridX;
		const segmentHeight = height / gridY;
		const indices = [];
		const vertices = [];
		const uvs = [];

		for (let iy = 0; iy < gridY1; iy++) {
			const y = iy * segmentHeight - heightHalf;
			for (let ix = 0; ix < gridX1; ix++) {
				const x = ix * segmentWidth - widthHalf;
				vertices.push(x, - y, 0);
				uvs.push(ix / gridX);
				uvs.push(1 - (iy / gridY));
			}
		}
		for (let iy = 0; iy < gridY; iy++) {
			for (let ix = 0; ix < gridX; ix++) {
				const a = ix + gridX1 * iy;
				const b = ix + gridX1 * (iy + 1);
				const c = (ix + 1) + gridX1 * (iy + 1);
				const d = (ix + 1) + gridX1 * iy;
				indices.push(a, b, d);
				indices.push(b, c, d);
			}
		}

		const {length: indicesCount} = indices;
		const verticesArray: number[] = [];
		const uvsArray: number[][] = [];
		for (let i = 0; i < indicesCount; i += 3) {
			const vi1 = 3 * indices[i], vi2 = 3 * indices[i + 1], vi3 = 3 * indices[i + 2];
			const ui1 = 2 * indices[i], ui2 = 2 * indices[i + 1], ui3 = 2 * indices[i + 2];
			let v1 = verticesArray[vi1], v2 = verticesArray[vi2], v3 = verticesArray[vi3];
			if (v1 == undefined) {
				v1 = builder.addVertex([vertices[vi1], vertices[vi1 + 1], vertices[vi1 + 2]]), verticesArray[vi1] = v1;
			}
			if (v2 == undefined) {
				v2 = builder.addVertex([vertices[vi2], vertices[vi2 + 1], vertices[vi2 + 2]]), verticesArray[vi2] = v2;
			}
			if (v3 == undefined) {
				v3 = builder.addVertex([vertices[vi3], vertices[vi3 + 1], vertices[vi3 + 2]]), verticesArray[vi3] = v3;
			}
			let uv1 = uvsArray[ui1], uv2 = uvsArray[ui2], uv3 = uvsArray[ui3];
			if (uv1 == undefined) {
				uv1 = [uvs[ui1], uvs[ui1 + 1]], uvsArray[ui1] = uv1;
			}
			if (uv2 == undefined) {
				uv2 = [uvs[ui2], uvs[ui2 + 1]], uvsArray[ui2] = uv2;
			}
			if (uv3 == undefined) {
				uv3 = [uvs[ui3], uvs[ui3 + 1]], uvsArray[ui3] = uv3;
			}
			builder.addTriangleFace(v1, v2, v3, {
				uv: [uv1, uv2, uv3]
			});
		}
		
		return builder;
	}
}