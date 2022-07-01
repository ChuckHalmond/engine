import { GeometryBase } from "../Geometry";
import { GeometryBuilder, Vertex } from "../GeometryBuilder";

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
				const a = indexArray[iy][ix + 1];
				const b = indexArray[iy][ix];
				const c = indexArray[iy + 1][ix];
				const d = indexArray[iy + 1][ix + 1];
				if (iy !== 0 || thetaStart > 0) indices.push(a, b, d);
				if (iy !== heightSegments - 1 || thetaEnd < Math.PI) indices.push(b, c, d);
			}
		}
		
		const {length: indicesCount} = indices;
		const verticesArray: Vertex[] = [];
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