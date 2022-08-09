import { BoundingBox } from "../../../core/rendering/scenes/geometries/bounding/BoundingBox";
import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { BoundingSphere } from "./BoundingSphere";

export { Frustum };

const tempVector = new Vector3();

interface Frustum {
    readonly nearPlane: Plane;
    readonly farPlane: Plane;
    readonly topPlane: Plane;
    readonly bottomPlane: Plane;
    readonly leftPlane: Plane;
    readonly rightPlane: Plane;
    readonly extents: Vector3[];
    copy(Frustum: Frustum): Frustum;
	clone(): Frustum;
	setFromMatrix(matrix: Matrix4): Frustum;
	set(
        nearPlane: Plane, farPlane: Plane,
        topPlane: Plane, bottomPlane: Plane,
        leftPlane: Plane, rightPlane: Plane
    ): Frustum;
	intersectsSphere(sphere: BoundingSphere): boolean;
	intersectsBox(box: BoundingBox): boolean;
	containsPoint(point: Vector3): boolean;
    getEdges(edges: Vector3[]): Vector3[];
    getExtents(extents: Vector3[]): Vector3[];
}

interface FrustumConstructor {
    readonly prototype: Frustum;
    new(): Frustum;
}

class FrustumBase implements Frustum {
    readonly nearPlane: Plane;
    readonly farPlane: Plane;
    readonly topPlane: Plane;
    readonly bottomPlane: Plane;
    readonly leftPlane: Plane;
    readonly rightPlane: Plane;
    readonly extents: Vector3[];

    constructor() {
		this.nearPlane = new Plane();
        this.farPlane = new Plane();
        this.topPlane = new Plane();
        this.bottomPlane = new Plane();
        this.leftPlane = new Plane();
        this.rightPlane = new Plane();
        this.extents = new Array(8).fill(0).map(_ => new Vector3());
    }

    set(
        nearPlane: Plane, farPlane: Plane,
        topPlane: Plane, bottomPlane: Plane,
        leftPlane: Plane, rightPlane: Plane): Frustum {
        const {nearPlane: _nearPlane, farPlane: _farPlane, bottomPlane: _bottomPlane, topPlane: _topPlane, leftPlane: _leftPlane, rightPlane: _rightPlane} = this;
		_nearPlane.copy(nearPlane);
		_farPlane.copy(farPlane);
        _topPlane.copy(topPlane);
        _bottomPlane.copy(bottomPlane);
        _leftPlane.copy(leftPlane);
        _rightPlane.copy(rightPlane);
		return this;
	}

    copy(Frustum: FrustumBase): Frustum {
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = Frustum;
        this.set(
            nearPlane,
            farPlane,
            topPlane,
            bottomPlane,
            leftPlane,
            rightPlane
        );
        return this;
    }

	clone(): Frustum {
		return new FrustumBase().copy(this);
    }
    
	setFromMatrix(matrix: Matrix4): Frustum {
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane, extents} = this;
        const [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15] = matrix.array;
        rightPlane.set(m3 - m0, m7 - m4, m11 - m8, m15 - m12).normalized();
        leftPlane.set(m3 + m0, m7 + m4, m11 + m8, m15 + m12).normalized();
        bottomPlane.set(m3 + m1, m7 + m5, m11 + m9, m15 + m13).normalized();
        topPlane.set(m3 - m1, m7 - m5, m11 - m9, m15 - m13).normalized();
        farPlane.set(m3 - m2, m7 - m6, m11 - m10, m15 - m14).normalized();
        nearPlane.set(m3 + m2, m7 + m6, m11 + m10, m15 + m14).normalized();

        Plane.intersection(leftPlane, bottomPlane, nearPlane, extents[0]);
        Plane.intersection(leftPlane, topPlane, nearPlane, extents[1]);
        Plane.intersection(rightPlane, bottomPlane, nearPlane, extents[2]);
        Plane.intersection(rightPlane, topPlane, nearPlane, extents[3]);
        Plane.intersection(leftPlane, bottomPlane, farPlane, extents[4]);
        Plane.intersection(leftPlane, topPlane, farPlane, extents[5]);
        Plane.intersection(rightPlane, bottomPlane, farPlane, extents[6]);
        Plane.intersection(rightPlane, topPlane, farPlane, extents[7]);
        
		return this;
    }
    
	intersectsSphere(sphere: BoundingSphere): boolean {
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = this;
        const {center, radius} = sphere;
        return center.dot(nearPlane.normal) + nearPlane.constant + radius <= 0 ||
            center.dot(farPlane.normal) + farPlane.constant + radius <= 0 ||
            center.dot(bottomPlane.normal) + bottomPlane.constant + radius <= 0 ||
            center.dot(topPlane.normal) + topPlane.constant + radius <= 0 ||
            center.dot(leftPlane.normal) + leftPlane.constant + radius <= 0 ||
            center.dot(rightPlane.normal) + rightPlane.constant + radius <= 0;
	}
    
	intersectsBox(box: BoundingBox): boolean {
        const {max: boxMax, min: boxMin} = box;
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = this;
        let intersects = 
            nearPlane.distanceToPoint(tempVector.setValues(
                nearPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                nearPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                nearPlane.normal.z > 0 ? boxMax.z : boxMin.z
            )) >= 0 &&
            farPlane.distanceToPoint(tempVector.setValues(
                farPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                farPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                farPlane.normal.z > 0 ? boxMax.z : boxMin.z
            )) >= 0 &&
            bottomPlane.distanceToPoint(tempVector.setValues(
                bottomPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                bottomPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                bottomPlane.normal.z > 0 ? boxMax.z : boxMin.z
            )) >= 0 &&
            topPlane.distanceToPoint(tempVector.setValues(
                topPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                topPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                topPlane.normal.z > 0 ? boxMax.z : boxMin.z
            )) >= 0 &&
            leftPlane.distanceToPoint(tempVector.setValues(
                leftPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                leftPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                leftPlane.normal.z > 0 ? boxMax.z : boxMin.z
            )) >= 0 &&
            rightPlane.distanceToPoint(tempVector.setValues(
                rightPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                rightPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                rightPlane.normal.z > 0 ? boxMax.z : boxMin.z
            )) >= 0;
		return intersects;
	}

    getEdges(edges: Vector3[]): Vector3[] {
        const {extents} = this;
        const leftBottomNear = extents[0];
        const leftTopNear = extents[1];
        const rightBottomNear = extents[2];
        const rightTopNear = extents[3];
        const leftBottomFar = extents[4];
        const leftTopFar = extents[5];
        const rightBottomFar = extents[6];
        const rightTopFar = extents[7];
        edges[0].copy(leftTopFar).sub(leftTopNear);
        edges[1].copy(rightTopFar).sub(rightTopNear);
        edges[2].copy(leftBottomFar).sub(leftBottomNear);
        edges[3].copy(rightBottomFar).sub(rightBottomNear);
        edges[4].copy(rightTopFar).sub(leftTopFar);
        edges[5].copy(rightTopNear).sub(rightBottomNear);
        return edges;
    }

    getExtents(extents: Vector3[]): Vector3[] {
        const {extents: _extents} = this;
        extents[0].copy(_extents[0]);
        extents[1].copy(_extents[1]);
        extents[2].copy(_extents[2]);
        extents[3].copy(_extents[3]);
        extents[4].copy(_extents[4]);
        extents[5].copy(_extents[5]);
        extents[6].copy(_extents[6]);
        extents[7].copy(_extents[7]);
        return extents;
    }

	containsPoint(point: Vector3): boolean {
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = this;
        return nearPlane.distanceToPoint(point) >= 0 &&
            farPlane.distanceToPoint(point) >= 0 &&
            bottomPlane.distanceToPoint(point) >= 0 &&
            topPlane.distanceToPoint(point) >= 0 &&
            leftPlane.distanceToPoint(point) >= 0 &&
            rightPlane.distanceToPoint(point) >= 0;
    }
}

var Frustum: FrustumConstructor = FrustumBase;