import { Matrix3 } from "../../../../../libs/maths/algebra/matrices/Matrix3";
import { Space } from "../../../../../libs/maths/geometry/space/Space";
import { buildArrayFromIndexedArrays } from "../../../../../utils/Snippets";
import { GeometryBase } from "../geometry";
import { GeometryBuilder } from "../GeometryBuilder";

export { QuadGeometry };

class QuadGeometry extends GeometryBase {
	width: number;
	height: number;
	widthSegment: number;
	heightSegment: number;

	constructor(properties?: {width?: number, height?: number, widthSegment?: number, heightSegment?: number}) {
		super();
		this.width = properties?.width ?? 2;
		this.height = properties?.height ?? 2;
		this.widthSegment = properties?.widthSegment ?? 1;
		this.heightSegment = properties?.heightSegment ?? 1;
	}
	
	toBuilder(): GeometryBuilder {
		const builder = new class extends GeometryBuilder {
			tangentsArray(): Float32Array {
				console.log("tangents");
				return new Float32Array([0, 1, 0]);
			}
		
			verticesNormalsArray(): Float32Array {
				console.log("verticesNormalsArray");
				return new Float32Array([0, 0, 1]);
			}
		};
		const vertices = builder.vertices;
		const {heightSegment, widthSegment, width, height} = this;
		
		const segmentVertexWidth = width / widthSegment;
		const segmentVertexHeight = height / heightSegment;
		const segmentUvWidth = 1 / widthSegment;
		const segmentUvHeight = 1 / heightSegment;
		const vertexOrigin = [-(this.width / 2), -(this.height / 2)];
		const uvOrigin = [0, 0];
		const vertexPosition = [...vertexOrigin];
		const uvPosition = [...uvOrigin];
		const uvs = [];
		
		for (let hi = 0; hi <= heightSegment; hi++) {
			builder.addVertex([vertexPosition[0], vertexPosition[1], 0]);
			uvs.push([uvPosition[0], uvPosition[1]]);
			vertexPosition[1] += segmentVertexHeight;
			uvPosition[1] += segmentUvHeight;
		}
		vertexPosition[1] = vertexOrigin[1];

		for (let wi = 0; wi < widthSegment; wi++) {
			vertexPosition[1] = vertexOrigin[1];
			uvPosition[1] = uvOrigin[1];

			builder.addVertex([vertexPosition[0] + segmentVertexWidth, vertexPosition[1], 0]);
			uvs.push([uvPosition[0] + segmentUvWidth, uvPosition[1]]);
			for (let hi = 0; hi < heightSegment; hi++) {
				const verticesCount = vertices.length;
				builder.addVertex([vertexPosition[0] + segmentVertexWidth, vertexPosition[1] + segmentVertexHeight, 0]);
				uvs.push([uvPosition[0] + segmentUvWidth, uvPosition[1] + segmentUvHeight]);
				builder.addQuadFace(
					vertices[verticesCount - (heightSegment + 1)],
					vertices[verticesCount - (heightSegment + 1) - 1],
					vertices[verticesCount - 1],
					vertices[verticesCount], {
						uv: [
							uvs[verticesCount - (heightSegment + 1)],
							uvs[verticesCount - (heightSegment + 1) - 1],
							uvs[verticesCount - 1],
							uvs[verticesCount]
						]
					}
				);
				vertexPosition[1] += segmentVertexHeight;
				uvPosition[1] += segmentUvHeight;
			}
			vertexPosition[0] += segmentVertexWidth;
			uvPosition[0] += segmentUvWidth;
		}
		return builder;
	}
}