import { GeometryBase } from "../../Geometry";
import { GeometryBuilder, Vertex } from "../../GeometryBuilder";

export { TetrahedronGeometry };

class TetrahedronGeometry extends GeometryBase {
	radius: number;
	detail: number;

	constructor(properties?: {radius?: number, detail?: number}) {
		super();
		const {radius, detail} = properties ?? {};
		this.radius = radius ?? 1;
		this.detail = detail ?? 1;
	}

	toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();

		const vertices = [
			1, 1, 1,
			-1, -1, 1,
			-1, 1, -1,
			1, -1, -1
		];

		const indices = [
			2, 1, 0,
			0, 3, 2,
			1, 3, 0,
			2, 3, 1
		];

		const {length: indicesCount} = indices;
		const verticesArray: Vertex[] = [];
		for (let i = 0; i < indicesCount; i += 3) {
			const vi1 = 3 * indices[i], vi2 = 3 * indices[i + 1], vi3 = 3 * indices[i + 2];
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
			builder.addTriangleFace(v1, v2, v3);
		}
		
		return builder;
	}
}