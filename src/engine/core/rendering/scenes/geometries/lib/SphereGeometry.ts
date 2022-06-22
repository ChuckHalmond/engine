import { Vector3List } from "../../../../../libs/maths/extensions/lists/Vector3List";
import { GeometryBase } from "../Geometry";
import { GeometryBuilder, FaceVerticesIterator } from "../GeometryBuilder";
/*
const buildSphereGeometry = function(properties: {radius: number, widthSegment: number, heightSegment: number}) {
	const builder = new GeometryBuilder();
    const {radius, widthSegment, heightSegment} = properties;
    const widthAngleSlice = 2 * Math.PI / widthSegment;
	const heightAngleSlice = Math.PI / heightSegment;
    const lowerOrigin = builder.addVertex([0, 0, -radius]);
	const upperOrigin = builder.addVertex([0, 0, radius]);
    Array(heightSegment).fill(0).forEach((_, heightSegmentIndex) => {
		const deltaZ = Math.sin(heightSegmentIndex * heightAngleSlice) * radius;
		const z = Math.sin(-(Math.PI / 2) + heightSegmentIndex * heightAngleSlice) * radius;
		Array(widthSegment).fill(0).forEach((_, widthSegmentIndex) => {
			if (heightSegmentIndex === heightSegment || heightSegmentIndex === 0) {
				return;
			}
			if (heightSegmentIndex === 1 || heightSegmentIndex === heightSegment - 1) {
				const widthAngle = widthSegmentIndex * widthAngleSlice;
				const nextAngle = ((widthSegmentIndex + 1) % widthSegment) * widthAngleSlice;
				let v0 = (heightSegmentIndex === 1) ? lowerOrigin : upperOrigin;
				let v1 = builder.addVertex([Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, z]);
				let v2 = builder.addVertex([Math.cos(widthAngle) * radius, Math.sin(widthAngle) * radius, z]);
				builder.addTriangleFace(
					v0, v1, v2
				);
			}
			const widthAngle = widthSegmentIndex * widthAngleSlice;
			const nextAngle = ((widthSegmentIndex + 1) % widthSegment) * widthAngleSlice;
			let v0 = builder.addVertex([0, 0, z]);
			let v1 = builder.addVertex([Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, z]);
			let v2 = builder.addVertex([Math.cos(widthAngle) * radius, Math.sin(widthAngle) * radius, z]);
			builder.addQuadFace(
				v0, v1, v2
			);
			//}
			let v3 = builder.addVertex([Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, height]);
			let v4 = builder.addVertex([Math.cos(angle) * radius, Math.sin(angle) * radius, height]);
			builder.addTriangleFace(
				upperOrigin, v3, v4
			);
			builder.addQuadFace(
				v1, v2, v3, v4
			);
		});
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
		//if (faceVertices.length === 3) {
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

export class SphereGeometry extends GeometryBase {
	constructor(properties?: {radius?: number, widthSegment?: number, heightSegment?: number}) {
		const [vertices, indices, uvs, lines] = buildSphereGeometry({
			radius: properties?.radius ?? 1,
			widthSegment: properties?.widthSegment ?? 16,
			heightSegment: properties?.heightSegment ?? 16,
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