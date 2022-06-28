import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";

class CylinderGeometry extends GeometryBase {
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
		this.radiusTop = radiusTop ?? 2;
		this.radiusBottom = radiusBottom ?? 2;
		this.height = height ?? 2;
		this.radialSegments = radialSegments ?? 2;
		this.heightSegments = heightSegments ?? 2;
		this.openEnded = openEnded ?? true;
		this.thetaStart = thetaStart ?? 2;
		this.thetaLength = thetaLength ?? 2;
	}

	toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();
		
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