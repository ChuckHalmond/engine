import { GeometryBase } from "../Geometry";
import { GeometryBuilder, FaceVerticesIterator } from "../GeometryBuilder";

export class SphereGeometry extends GeometryBase {
	radius: number;
	widthSegments: number;
	heightSegments: number;
	phiStart: number;
	phiLength: number;
	thetaStart: number;
	thetaLength: number;

	constructor(properties?: {
		radius?: number,
		widthSegments?: number,
		heightSegments?: number,
		phiStart?: number,
		phiLength?: number,
		thetaStart?: number,
		thetaLength?: number
	}) {
		super();
		const {radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength} = properties ?? {};
		this.radius = radius ?? 1;
		this.widthSegments = widthSegments ?? 32;
		this.heightSegments = heightSegments ?? 16;
		this.phiStart = phiStart ?? 0;
		this.phiLength = phiLength ?? 2 * Math.PI;
		this.thetaStart = thetaStart ?? 0;
		this.thetaLength = thetaLength ?? Math.PI;
	}

	toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();
		const {radius, phiStart, phiLength, thetaStart, thetaLength} = this;
		let {widthSegments, heightSegments} = this;

		widthSegments = Math.max(3, Math.floor(widthSegments));
		heightSegments = Math.max(2, Math.floor(heightSegments));

		const thetaEnd = Math.min(thetaStart + thetaLength, Math.PI);

		const indexArray = [];
		const indices = [];
		const vertices = []
		const uvs = [];
		let index = 0;

		for (let iy = 0; iy <= heightSegments; iy++) {
			const indexRow = [];
			const v = iy / heightSegments;

			let uOffset = 0;
			if (iy == 0 && thetaStart == 0) {
				uOffset = 0.5 / widthSegments;
			} else if (iy == heightSegments && thetaEnd == Math.PI) {
				uOffset = -0.5 / widthSegments;
			}

			for (let ix = 0; ix <= widthSegments; ix++) {
				const u = ix / widthSegments;
				vertices.push(
					-radius * Math.cos(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength),
					radius * Math.cos(thetaStart + v * thetaLength),
					radius * Math.sin(phiStart + u * phiLength) * Math.sin(thetaStart + v * thetaLength)
				);
				uvs.push(u + uOffset, 1 - v);
				indexRow.push(index++);
			}
			indexArray.push(indexRow);
		}

		for (let iy = 0; iy < heightSegments; iy++) {
			for (let ix = 0; ix < widthSegments; ix++) {
				const lowerLeftIndex = indexArray[iy][ix];
				const upperLeftIndex = indexArray[iy + 1][ix];
				const upperRightVertex = indexArray[iy + 1][ix + 1];
				const lowerRightVertex = indexArray[iy][ix + 1];
				if (iy !== 0 || thetaStart > 0) indices.push(lowerRightVertex, lowerLeftIndex, upperRightVertex);
				if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(lowerLeftIndex, upperLeftIndex, upperRightVertex);
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