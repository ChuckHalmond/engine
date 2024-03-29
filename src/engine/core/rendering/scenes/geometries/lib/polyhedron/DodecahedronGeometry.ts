import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";
 
export { DodecahedronGeometry };
 
class DodecahedronGeometry extends GeometryBase {
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

        const t = ( 1 + Math.sqrt( 5 ) ) / 2;
        const r = 1 / t;

        const vertices = [
            -1, -1, -1,
            -1, -1, 1,
            -1, 1, -1,
            -1, 1, 1,
            1, -1, -1,
            1, -1, 1,
            1, 1, -1,
            1, 1, 1,
            0, - r, - t,
            0, - r, t,
            0, r, - t,
            0, r, t,
            - r, - t, 0,
            - r, t, 0,
            r, - t, 0,
            r, t, 0,
            - t, 0, - r,
            t, 0, - r,
            - t, 0, r,
            t, 0, r
        ];
 
        const indices = [
            3, 11, 7,
            3, 7, 15,
            3, 15, 13,
            7, 19, 17,
            7, 17, 6,
            7, 6, 15,
            17, 4, 8,
            17, 8, 10,
            17, 10, 6,
            8, 0, 16,
            8, 16, 2,
            8, 2, 10,
            0, 12, 1,
            0, 1, 18,
            0, 18, 16,
            6, 10, 2,
            6, 2, 13,
            6, 13, 15,
            2, 16, 18,
            2, 18, 3,
            2, 3, 13,
            18, 1, 9,
            18, 9, 11,
            18, 11, 3,
            4, 14, 12,
            4, 12, 0,
            4, 0, 8,
            11, 9, 5,
            11, 5, 19,
            11, 19, 7,
            19, 5, 14,
            19, 14, 4,
            19, 4, 17,
            1, 12, 14,
            1, 14, 5,
            1, 5, 9
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