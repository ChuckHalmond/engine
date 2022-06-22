import { Matrix3 } from "../../../../../../libs/maths/algebra/matrices/Matrix3";
import { Vector3Pool } from "../../../../../../libs/maths/extensions/pools/Vector3Pools";
import { Space } from "../../../../../../libs/maths/geometry/space/Space";
import { Transform } from "../../../../../general/Transform";
import { GeometryBase } from "../../Geometry";
import { GeometryBuilder } from "../../GeometryBuilder";

/**
 *     v0_______v1
 *     |\        |
 *     |  \      |
 *     |    \    |
 *     |      \  |
 *    v2_______\v3
 *
 */
export class CubeGeometry extends GeometryBase {
	width: number;
	height: number;
	depth: number;
	widthSegment: number;
	heightSegment: number;
	depthSegment: number;

	constructor(properties?: {width?: number, height?: number, depth?: number, widthSegment?: number, heightSegment?: number, depthSegment?: number}) {
		super();
		this.width = properties?.width ?? 1;
		this.height = properties?.height ?? 1;
		this.depth = properties?.depth ?? 1;
		this.widthSegment = properties?.widthSegment ?? 1;
		this.heightSegment = properties?.heightSegment ?? 1;
		this.depthSegment = properties?.depthSegment ?? 1;
	}
	
	public toBuilder(): GeometryBuilder {
		const builder = new GeometryBuilder();
		const directions = [Space.left, Space.right, Space.up, Space.down, Space.forward, Space.backward];
		const transform = new Transform();
		const dimensions = new Matrix3([
			this.width / 2, 0, 0,
			0, this.height / 2, 0,
			0, 0, this.depth / 2
		]);
		const [forward, right, up] = Vector3Pool.acquire(3);
		directions.forEach((direction) => {
			switch (direction.dot(Space.up)) {
				case 1: 
					transform.lookAt(direction.clone().scale(-1), Space.backward);
					break;
				case -1: 
					transform.lookAt(direction.clone().scale(-1), Space.forward);
					break;
				default:
					transform.lookAt(direction.clone().scale(-1), Space.up);
					break;
			}
			const forwardArray = transform.getForward(forward).mult(dimensions).array;
			const rightArray = transform.getRight(right).mult(dimensions).array;
			const upArray = transform.getUp(up).mult(dimensions).array;
			const upperLeftVertex = forwardArray.map((forward_i, i) => forward_i - rightArray[i] + upArray[i]);
			const upperLeftUV = [0, 0];
			const lowerLeftVertex = forwardArray.map((forward_i, i) => forward_i - rightArray[i] - upArray[i]);
			const lowerLeftUV = [0, 1];
			const lowerRightVertex = forwardArray.map((forward_i, i) => forward_i + rightArray[i] - upArray[i]);
			const lowerRightUV = [1, 1];
			const upperRightVertex = forwardArray.map((forward_i, i) => forward_i + rightArray[i] + upArray[i]);
			const upperRightUV = [1, 0];
			builder.addQuadFaceVertices(
				upperLeftVertex, lowerLeftVertex, lowerRightVertex, upperRightVertex,  {
					uv: [upperLeftUV, lowerLeftUV, lowerRightUV, upperRightUV]
				}
			);
		});
		Vector3Pool.release(3);
		return builder;
	}
}