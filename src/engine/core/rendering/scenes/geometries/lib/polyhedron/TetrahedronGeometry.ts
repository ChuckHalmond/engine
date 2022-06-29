import { buildArrayFromIndexedArrays } from "../../../../../../utils/Snippets";
import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";

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

		const indicesCount = indices.length;
		for (let i = 0; i < indicesCount; i += 3) {
			let vi1 = 3 * indices[i    ];
			let vi2 = 3 * indices[i + 1];
			let vi3 = 3 * indices[i + 2];
			builder.addTriangleFaceVertices(
				[vertices[vi1], vertices[vi1 + 1], vertices[vi1 + 2]],
				[vertices[vi2], vertices[vi2 + 1], vertices[vi2 + 2]],
				[vertices[vi3], vertices[vi3 + 1], vertices[vi3 + 2]]
			);
		}
		return builder;
	}
}