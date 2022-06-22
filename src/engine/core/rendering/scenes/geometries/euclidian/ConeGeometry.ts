import { Vector3List } from "../../../../../libs/maths/extensions/lists/Vector3List";
import { GeometryBase } from "../Geometry";
import { GeometryBuilder, FaceVerticesIterator } from "../GeometryBuilder";
/*
const buildConeGeometry = function(properties: {radius: number, segment: number, height: number}) {
	const builder = new GeometryBuilder();
    const {segment, radius, height} = properties;
    const angleSlice = Math.PI / (segment * 0.5);
    const origin = builder.addVertex([0, 0, 0]);
    const top = builder.addVertex([0, 0, height]);
    Array(segment).fill(0).forEach((_, index) => {
        const angle = index * angleSlice;
        const nextAngle = ((index + 1) % segment) * angleSlice;
        let v1 = builder.addVertex([Math.cos(nextAngle) * radius, Math.sin(nextAngle) * radius, 0]);
        let v2 = builder.addVertex([Math.cos(angle) * radius, Math.sin(angle) * radius, 0]);
        builder.addTriangleFace(
			origin, v1, v2
		);
        builder.addTriangleFace(
			v2, top, v1
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
		const origin = faceVertices[0];
		const v1 = faceVertices[1];
		const v2 = faceVertices[2];
		return [
			...origin.point, ...v1.point,
			...v1.point, ...v2.point,
			...v2.point, ...origin.point
		];
	}));

	return [vertices, indices, uvs, lines];
};

export class ConeGeometry extends GeometryBase {
	constructor(properties?: {radius?: number, segment?: number, height?: number}) {
		const [vertices, indices, uvs, lines] = buildConeGeometry({
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