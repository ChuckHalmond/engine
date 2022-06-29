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