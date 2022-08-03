import { BoundingBox } from "../../../core/rendering/scenes/geometries/bounding/BoundingBox";
import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Vector3Pool } from "../../maths/extensions/pools/Vector3Pools";
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

		this.nearPlane.copy(nearPlane);
		this.farPlane.copy(farPlane);
        this.topPlane.copy(topPlane);
        this.bottomPlane.copy(bottomPlane);
        this.leftPlane.copy(leftPlane);
        this.rightPlane.copy(rightPlane);

		return this;
	}

    copy(frustrum: FrustrumBase): FrustrumBase {
        this.set(
            frustrum.nearPlane,
            frustrum.farPlane,
            frustrum.topPlane,
            frustrum.bottomPlane,
            frustrum.leftPlane,
            frustrum.rightPlane
        );

        return this;
    }

	clone(): FrustrumBase {
		return new FrustrumBase().copy(this);
    }
    
	setFromPerspectiveMatrix(matrix: Matrix4): FrustrumBase {
        const m11 = matrix.m11;
        const m12 = matrix.m12;
        const m13 = matrix.m13;
        const m14 = matrix.m14;
        const m21 = matrix.m21;
        const m22 = matrix.m22;
        const m23 = matrix.m23;
        const m24 = matrix.m24;
        const m31 = matrix.m31;
        const m32 = matrix.m32;
        const m33 = matrix.m33;
        const m34 = matrix.m34;
        const m41 = matrix.m41;
        const m42 = matrix.m42;
        const m43 = matrix.m43;
        const m44 = matrix.m44;

        this.nearPlane.set(m31 + m41, m32 + m42, m33 + m43, m34 + m44).normalized();
        this.farPlane.set(-m31 + m41, -m32 + m42, -m33 + m43, -m34 + m44).normalized();
        this.bottomPlane.set(m21 + m41, m22 + m42, m23 + m43, m24 + m44).normalized();
        this.topPlane.set(-m21 + m41, -m22 + m42, -m23 + m43, -m24 + m44).normalized();
        this.leftPlane.set(m11 + m41, m12 + m42, m13 + m43, m14 + m44).normalized();
        this.rightPlane.set(-m11 + m41, -m12 + m42, -m13 + m43, -m14 + m44).normalized();
        
		return this;
    }
    
	intersectsSphere(sphere: BoundingSphere): boolean {
        const center = sphere.center;
        const radius = sphere.radius;
        return center.dot(this.nearPlane.normal) + this.nearPlane.constant + radius <= 0 ||
            center.dot(this.farPlane.normal) + this.farPlane.constant + radius <= 0 ||
            center.dot(this.bottomPlane.normal) + this.bottomPlane.constant + radius <= 0 ||
            center.dot(this.topPlane.normal) + this.topPlane.constant + radius <= 0 ||
            center.dot(this.leftPlane.normal) + this.leftPlane.constant + radius <= 0 ||
            center.dot(this.rightPlane.normal) + this.rightPlane.constant + radius <= 0;
	}

	intersectsBox(box: BoundingBox): boolean {
        let intersects = true;

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

		return intersects;
	}

	containsPoint(point: Vector3): boolean {
        return this.nearPlane.distanceToPoint(point) >= 0 &&
            this.farPlane.distanceToPoint(point) >= 0 &&
            this.bottomPlane.distanceToPoint(point) >= 0 &&
            this.topPlane.distanceToPoint(point) >= 0 &&
            this.leftPlane.distanceToPoint(point) >= 0 &&
            this.rightPlane.distanceToPoint(point) >= 0;
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