import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Vector3Pool } from "../../maths/extensions/pools/Vector3Pools";
import { Plane, PlaneInjector } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingBox } from "./BoundingBox";
import { BoundingSphere } from "./BoundingSphere";

export { Frustrum };
export { FrustrumInjector };
export { FrustrumBase };

interface Frustrum {
    nearPlane: Plane;
    farPlane: Plane;
    topPlane: Plane;
    bottomPlane: Plane;
    leftPlane: Plane;
    rightPlane: Plane;
    copy(frustrum: Frustrum): Frustrum;
	clone(): Frustrum;
	setFromPerspectiveMatrix(mat: Matrix4): Frustrum;
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
    private _nearPlane: Plane;
    private _farPlane: Plane;
    private _topPlane: Plane;
    private _bottomPlane: Plane;
    private _leftPlane: Plane;
    private _rightPlane: Plane;

    constructor() {
        const planeCtor = PlaneInjector.defaultCtor;
		this._nearPlane = new planeCtor();
        this._farPlane = new planeCtor();
        this._topPlane = new planeCtor();
        this._bottomPlane = new planeCtor();
        this._leftPlane = new planeCtor();
        this._rightPlane = new planeCtor();
    }
    
    public get nearPlane(): Plane {
        return this._nearPlane;
    }

    public set nearPlane(nearPlane: Plane) {
        this._nearPlane = nearPlane;
    }

    public get farPlane(): Plane {
        return this._farPlane;
    }

    public set farPlane(farPlane: Plane) {
        this._farPlane = farPlane;
    }

    public get topPlane(): Plane {
        return this._topPlane;
    }

    public set topPlane(topPlane: Plane) {
        this._topPlane = topPlane;
    }

    public get bottomPlane(): Plane {
        return this._bottomPlane;
    }

    public set bottomPlane(bottomPlane: Plane) {
        this._bottomPlane = bottomPlane;
    }

    public get leftPlane(): Plane {
        return this._leftPlane;
    }

    public set leftPlane(leftPlane: Plane) {
        this._leftPlane = leftPlane;
    }

    public get rightPlane(): Plane {
        return this._rightPlane;
    }

    public set rightPlane(rightPlane: Plane) {
        this._rightPlane = rightPlane;
    }

    public set(
        nearPlane: Plane, farPlane: Plane,
        topPlane: Plane, bottomPlane: Plane,
        leftPlane: Plane, rightPlane: Plane): Frustrum {

		this._nearPlane.copy(nearPlane);
		this._farPlane.copy(farPlane);
        this._topPlane.copy(topPlane);
        this._bottomPlane.copy(bottomPlane);
        this._leftPlane.copy(leftPlane);
        this._rightPlane.copy(rightPlane);

		return this;
	}

    public copy(frustrum: FrustrumBase): FrustrumBase {
        this.set(
            frustrum._nearPlane,
            frustrum._farPlane,
            frustrum._topPlane,
            frustrum._bottomPlane,
            frustrum._leftPlane,
            frustrum._rightPlane
        );

        return this;
    }

	public clone(): FrustrumBase {
		return new FrustrumBase().copy(this);
    }
    
	public setFromPerspectiveMatrix(mat: Matrix4): FrustrumBase {
        const m = mat.values;

        const m11 = m[ 0];
        const m12 = m[ 1];
        const m13 = m[ 2];
        const m14 = m[ 3];
        const m21 = m[ 4];
        const m22 = m[ 5];
        const m23 = m[ 6];
        const m24 = m[ 7];
        const m31 = m[ 8];
        const m32 = m[ 9];
        const m33 = m[10];
        const m34 = m[11];
        const m41 = m[12];
        const m42 = m[13];
        const m43 = m[14];
        const m44 = m[15];

        this._nearPlane.set(m31 + m41, m32 + m42, m33 + m43, m34 + m44).normalized();
        this._farPlane.set(-m31 + m41, -m32 + m42, -m33 + m43, -m34 + m44).normalized();
        this._bottomPlane.set(m21 + m41, m22 + m42, m23 + m43, m24 + m44).normalized();
        this._topPlane.set(-m21 + m41, -m22 + m42, -m23 + m43, -m24 + m44).normalized();
        this._leftPlane.set(m11 + m41, m12 + m42, m13 + m43, m14 + m44).normalized();
        this._rightPlane.set(-m11 + m41, -m12 + m42, -m13 + m43, -m14 + m44).normalized();
        
		return this;
    }
    
	public intersectsSphere(sphere: BoundingSphere): boolean {
        const center = sphere.center;
        const radius = sphere.radius;
        return center.dot(this._nearPlane.normal) + this._nearPlane.constant + radius <= 0 ||
            center.dot(this._farPlane.normal) + this._farPlane.constant + radius <= 0 ||
            center.dot(this._bottomPlane.normal) + this._bottomPlane.constant + radius <= 0 ||
            center.dot(this._topPlane.normal) + this._topPlane.constant + radius <= 0 ||
            center.dot(this._leftPlane.normal) + this._leftPlane.constant + radius <= 0 ||
            center.dot(this._rightPlane.normal) + this._rightPlane.constant + radius <= 0;
	}

	public intersectsBox(box: BoundingBox): boolean {
        let intersects = true;

        const boxMax = box.max;
        const boxMin = box.min;

        const temp: Vector3 = Vector3Pool.acquire();
        {
            intersects = 
                this._nearPlane.distanceToPoint(temp.setValues([
                    this._nearPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                    this._nearPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                    this._nearPlane.normal.z > 0 ? boxMax.z : boxMin.z
                ])) >= 0 &&
                this._farPlane.distanceToPoint(temp.setValues([
                    this._farPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                    this._farPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                    this._farPlane.normal.z > 0 ? boxMax.z : boxMin.z
                ])) >= 0 &&
                this._bottomPlane.distanceToPoint(temp.setValues([
                    this._bottomPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                    this._bottomPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                    this._bottomPlane.normal.z > 0 ? boxMax.z : boxMin.z
                ])) >= 0 &&
                this._topPlane.distanceToPoint(temp.setValues([
                    this._topPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                    this._topPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                    this._topPlane.normal.z > 0 ? boxMax.z : boxMin.z
                ])) >= 0 &&
                this._leftPlane.distanceToPoint(temp.setValues([
                    this._leftPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                    this._leftPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                    this._leftPlane.normal.z > 0 ? boxMax.z : boxMin.z
                ])) >= 0 &&
                this._rightPlane.distanceToPoint(temp.setValues([
                    this._rightPlane.normal.x > 0 ? boxMax.x : boxMin.x,
                    this._rightPlane.normal.y > 0 ? boxMax.y : boxMin.y,
                    this._rightPlane.normal.z > 0 ? boxMax.z : boxMin.z
                ])) >= 0;
        }
        Vector3Pool.release(1);

		return intersects;
	}

	public containsPoint(point: Vector3): boolean {
        return this._nearPlane.distanceToPoint(point) >= 0 &&
            this._farPlane.distanceToPoint(point) >= 0 &&
            this._bottomPlane.distanceToPoint(point) >= 0 &&
            this._topPlane.distanceToPoint(point) >= 0 &&
            this._leftPlane.distanceToPoint(point) >= 0 &&
            this._rightPlane.distanceToPoint(point) >= 0;
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