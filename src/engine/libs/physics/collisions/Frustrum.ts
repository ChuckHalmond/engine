import { BoundingBox } from "../../../core/rendering/scenes/geometries/bounding/BoundingBox";
import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingSphere } from "./BoundingSphere";

export { Frustrum };
export { FrustrumInjector };

const tempVector = new Vector3();

interface Frustrum {
    readonly nearPlane: Plane;
    readonly farPlane: Plane;
    readonly topPlane: Plane;
    readonly bottomPlane: Plane;
    readonly leftPlane: Plane;
    readonly rightPlane: Plane;
    copy(frustrum: Frustrum): Frustrum;
	clone(): Frustrum;
	setFromPerspectiveMatrix(matrix: Matrix4): Frustrum;
	set(
        nearPlane: Plane, farPlane: Plane,
        topPlane: Plane, bottomPlane: Plane,
        leftPlane: Plane, rightPlane: Plane
    ): Frustrum;
	intersectsSphere(sphere: BoundingSphere): boolean;
	intersectsBox(box: BoundingBox): boolean;
	containsPoint(point: Vector3): boolean;
}

interface FrustrumConstructor {
    readonly prototype: Frustrum;
    new(): Frustrum;
}

class FrustrumBase implements Frustrum {
    readonly nearPlane: Plane;
    readonly farPlane: Plane;
    readonly topPlane: Plane;
    readonly bottomPlane: Plane;
    readonly leftPlane: Plane;
    readonly rightPlane: Plane;

    constructor() {
		this.nearPlane = new Plane();
        this.farPlane = new Plane();
        this.topPlane = new Plane();
        this.bottomPlane = new Plane();
        this.leftPlane = new Plane();
        this.rightPlane = new Plane();
    }

    set(
        nearPlane: Plane, farPlane: Plane,
        topPlane: Plane, bottomPlane: Plane,
        leftPlane: Plane, rightPlane: Plane): Frustrum {
        const {nearPlane: _nearPlane, farPlane: _farPlane, bottomPlane: _bottomPlane, topPlane: _topPlane, leftPlane: _leftPlane, rightPlane: _rightPlane} = this;
		_nearPlane.copy(nearPlane);
		_farPlane.copy(farPlane);
        _topPlane.copy(topPlane);
        _bottomPlane.copy(bottomPlane);
        _leftPlane.copy(leftPlane);
        _rightPlane.copy(rightPlane);
		return this;
	}

    copy(frustrum: FrustrumBase): Frustrum {
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = frustrum;
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

	clone(): Frustrum {
		return new FrustrumBase().copy(this);
    }
    
	setFromPerspectiveMatrix(matrix: Matrix4): Frustrum {
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = this;
        const [m0, m1, m2, m3, m4, m5, m6, m7, m8, m9, m10, m11, m12, m13, m14, m15] = matrix.array;
        rightPlane.set(m3 - m0, m7 - m4, m11 - m8, m15 - m12).normalized();
        leftPlane.set(m3 + m0, m7 + m4, m11 + m8, m15 + m12).normalized();
        bottomPlane.set(m3 + m1, m7 + m5, m11 + m9, m15 + m13).normalized();
        topPlane.set(m3 - m1, m7 - m5, m11 - m9, m15 - m13).normalized();
        farPlane.set(m3 - m2, m7 - m6, m11 - m10, m15 - m14).normalized();
        nearPlane.set(m3 + m2, m7 + m6, m11 + m10, m15 + m14).normalized();
        


        const leftBottomNear = Plane.intersection(leftPlane, bottomPlane, nearPlane, new Vector3());
        const leftTopNear = Plane.intersection(leftPlane, topPlane, nearPlane, new Vector3());
        const rightBottomNear = Plane.intersection(rightPlane, bottomPlane, nearPlane, new Vector3());
        const rightTopNear = Plane.intersection(rightPlane, topPlane, nearPlane, new Vector3());
        const leftBottomFar  = Plane.intersection(leftPlane, bottomPlane, farPlane, new Vector3());
        const leftTopFar = Plane.intersection(leftPlane, topPlane, farPlane, new Vector3());
        const rightBottomFar = Plane.intersection(rightPlane, bottomPlane, farPlane, new Vector3());
        const rightTopFar = Plane.intersection(rightPlane, topPlane, farPlane, new Vector3());
        //const offset = nearPlane.normal.normalize().clone().scale(nearPlane.constant);
        (<[string, Vector3][]>[
            ["leftBottomNear", leftBottomNear],
            ["leftTopNear", leftTopNear],
            ["rightBottomNear", rightBottomNear],
            ["rightTopNear", rightTopNear],
            ["leftBottomFar", leftBottomFar],
            ["leftTopFar", leftTopFar],
            ["rightBottomFar", rightBottomFar],
            ["rightTopFar", rightTopFar]
        ]).forEach(([name, vertex]) => {
            console.log(`${name} ${Array.from(vertex)}`);
        });

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
        let intersects = false;
        const {max: boxMax, min: boxMin} = box;
        const {nearPlane, farPlane, bottomPlane, topPlane, leftPlane, rightPlane} = this;
        intersects = 
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
        if (intersects) {
            console.log(`Box min(${Array.from(box.min)}) max(${Array.from(box.max)}) intersects!`);
        }
		return intersects;
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

var Frustrum: FrustrumConstructor = FrustrumBase;
const FrustrumInjector: Injector<FrustrumConstructor> = new Injector({
	defaultCtor: FrustrumBase,
	onDefaultOverride:
		(ctor: FrustrumConstructor) => {
			Frustrum = ctor;
		}
});