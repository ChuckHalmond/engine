import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";

export class CylinderGeometry extends GeometryBase {
	radiusTop: number;
	radiusBottom: number;
	height: number;
	radialSegments: number;
	heightSegments: number;
	openEnded: boolean;
	thetaStart: number;
	thetaLength: number;

	constructor(properties?: {
		radiusTop?: number;
		radiusBottom?: number;
		height?: number;
		radialSegments?: number;
		heightSegments?: number;
		openEnded?: boolean;
		thetaStart?: number;
		thetaLength?: number;
	}) {
		super();
		const {radiusTop, radiusBottom, height, radialSegments, heightSegments, openEnded, thetaStart, thetaLength} = properties ?? {};
		this.radiusTop = radiusTop ?? 1;
		this.radiusBottom = radiusBottom ?? 1;
		this.height = height ?? 1;
		this.radialSegments = radialSegments ?? 8;
		this.heightSegments = heightSegments ?? 1;
		this.openEnded = openEnded ?? false;
		this.thetaStart = thetaStart ?? 0;
		this.thetaLength = thetaLength ?? 2 * Math.PI;
	}

	toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();
		const {radiusTop, radiusBottom, height, openEnded, thetaStart, thetaLength} = this;
		let {radialSegments, heightSegments} = this;

		radialSegments = Math.floor(radialSegments);
		heightSegments = Math.floor(heightSegments);

		const halfHeight = height / 2;
		
		const indices: number[] = [];
		const vertices: number[] = [];
		const uvs: number[] = [];
		const indexArray: (number[])[] = [];
		let index = 0;

		generateTorso();

		if (!openEnded) {
			if (radiusTop > 0) generateCap(true);
			if (radiusBottom > 0) generateCap(false);
		}

		function generateTorso() {
			for (let iy = 0; iy <= heightSegments; iy++) {
				const indexRow = [];
				const v = iy / heightSegments;
				const radius = v * (radiusBottom - radiusTop) + radiusTop;
				for (let ix = 0; ix <= radialSegments; ix++) {
					const u = ix / radialSegments;
					const theta = u * thetaLength + thetaStart;
					const sinTheta = Math.sin(theta);
					const cosTheta = Math.cos(theta);
					vertices.push(
						radius * sinTheta,
						-v * height + halfHeight,
						radius * cosTheta
					);
					uvs.push(u, 1 - v);
					indexRow.push(index ++);
				}
				indexArray.push(indexRow);
			}

			for (let ix = 0; ix < radialSegments; ix++) {
				for (let iy = 0; iy < heightSegments; iy++) {
					const lowerLeftIndex = indexArray[iy][ix];
					const upperLeftIndex = indexArray[iy + 1][ix];
					const upperRightVertex = indexArray[iy + 1][ix + 1];
					const lowerRightVertex = indexArray[iy][ix + 1];
					indices.push(lowerLeftIndex, upperLeftIndex, lowerRightVertex);
					indices.push(upperLeftIndex, upperRightVertex, lowerRightVertex);
				}
			}
		}

		function generateCap(top: boolean) {
			const centerIndexStart = index;
			const radius = top ? radiusTop : radiusBottom;
			const sign = top ? 1 : - 1;

			// first we generate the center vertex data of the cap.
			// because the geometry needs one set of uvs per face,
			// we must generate a center vertex per face/segment

			for (let x = 1; x <= radialSegments; x++) {
				vertices.push(0, halfHeight * sign, 0);
				uvs.push(0.5, 0.5);
				index++;
			}

			const centerIndexEnd = index;
			for (let x = 0; x <= radialSegments; x++) {
				const u = x / radialSegments;
				const theta = u * thetaLength + thetaStart;
				const cosTheta = Math.cos(theta);
				const sinTheta = Math.sin(theta);
				vertices.push(
					radius * sinTheta,
					halfHeight * sign,
					radius * cosTheta
				);
				uvs.push(
					(cosTheta * 0.5) + 0.5,
					(sinTheta * 0.5 * sign) + 0.5
				);
				index++;
			}
			for (let x = 0; x < radialSegments; x ++) {
				const c = centerIndexStart + x;
				const i = centerIndexEnd + x;
				if (top) {
					indices.push(i, i + 1, c);
				} else {
					indices.push(i + 1, i, c);
				}
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