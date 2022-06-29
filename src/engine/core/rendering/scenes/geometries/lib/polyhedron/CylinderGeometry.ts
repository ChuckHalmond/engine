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
			if (radiusTop > 0) generateCap( true );
			if (radiusBottom > 0) generateCap( false );
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
/*
const buildCylinderGeometry = function(properties: {radius: number, segment: number, height: number}) {
	const builder = new GeometryBuilder();
    const {segment, radius, height} = properties;
    const total = 2 * Math.PI;
    const angleSlice = total / segment;
    const lowerOrigin = builder.addVertex([0, 0, 0]);
	const upperOrigin = builder.addVertex([0, 0, height]);
    Array(segment).fill(0).forEach((_, index) => {
        const angle = index * angleSlice;
        const nextAngle = ((index + 1) % segment) * angleSlice;
        let v1 = builder.addVertex([Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, 0]);
        let v2 = builder.addVertex([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
        builder.addTriangleFace(
			lowerOrigin, v1, v2
		);
		let v3 = builder.addVertex([Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, height]);
        let v4 = builder.addVertex([Math.cos(angle) * radius, Math.sin(angle) * radius, height]);
		builder.addTriangleFace(
			upperOrigin, v3, v4
		);
        builder.addQuadFace(
			v1, v2, v3, v4
		);
    });
	
	const vertices = new Float32Array(builder.faces.flatMap((face) => {
		return Array.from(new FaceVerticesIterator(face)).flatMap((vertex) => {
			return vertex.point;
		});
	}));

	const indices = new Uint8Array(builder.faces.reduce(([indices, index]) => {
		return [indices.concat([index, index + 1, index + 2]), index + 3] as [number[], number];
	}, [[], 0] as [number[], number])[0]);

	const uvs = new Float32Array(builder.faces.flatMap((face) => {
		return face.uv.flat(1);
	}));

	const lines = new Float32Array(builder.faces.flatMap((face) => {
		const faceVertices = Array.from(new FaceVerticesIterator(face));
		if (faceVertices.length === 3) {
			const origin = faceVertices[0];
			const v1 = faceVertices[1];
			const v2 = faceVertices[2];
			return [
				...origin.point, ...v1.point,
				...v1.point, ...v2.point,
				...v2.point, ...origin.point
			];
		}
		else {
			const upperLeftVertex = faceVertices[0];
			const upperRightVertex = faceVertices[1];
			const lowerLeftVertex = faceVertices[2];
			const lowerRightVertex = faceVertices[3];
			return [
				...upperLeftVertex.point, ...upperRightVertex.point,
				...upperRightVertex.point, ...lowerRightVertex.point,
				...lowerRightVertex.point, ...lowerLeftVertex.point,
				...lowerLeftVertex.point, ...upperLeftVertex.point
			];
		}
	}));

	return [vertices, indices, uvs, lines];
};

export class CylinderGeometry extends GeometryBase {
	constructor(properties?: {radius?: number, segment?: number, height?: number}) {
		const [vertices, indices, uvs, lines] = buildCylinderGeometry({
			radius: properties?.radius ?? 1,
			segment: properties?.segment ?? 32,
            height: properties?.height ?? 1
		});
		super({
			vertices: vertices,
			indices: indices,
			uvs: uvs
		});
		Object.assign(this, {
			lines: new Vector3List(lines)
		});
	}
}*/