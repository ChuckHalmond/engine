import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";

export { IcosahedronGeometry };

class IcosahedronGeometry extends GeometryBase {
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
		const t = (1 + Math.sqrt(5)) / 2;

		const vertices = [
			-1, t, 0,
			1, t, 0,
			-1, -t, 0,
			1, -t,  0,
			0, -1, t,
			0, 1, t,
			0, -1, -t,
			0,  1, -t,
			t, 0, -1,
			t, 0, 1,
			-t, 0, -1,
			-t,  0,  1
		];

		const indices = [
			0, 11, 5,
			0, 5, 1,
			0, 1, 7,
			0, 7, 10,
			0, 10, 11,
			1, 5, 9,
			5, 11, 4,
			11, 10, 2,
			10, 7, 6,
			7, 1, 8,
			3, 9, 4,
			3, 4, 2,
			3, 2, 6,
			3, 6, 8,
			3, 8, 9,
			4, 9, 5,
			2, 4, 11,
			6, 2, 10,
			8, 6, 7,
			9, 8, 1
		];

		const {length: indicesCount} = indices;
		const verticesArray: number[] = [];
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