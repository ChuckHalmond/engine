import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Vector3List } from "../../maths/extensions/lists/Vector3List";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingBox, BoundingBoxPool } from "./BoundingBox";

export { BoundingSphere };
export { BoundingSphereInjector };
export { BoundingSphereBase };

interface BoundingSphere {
	center: Vector3;
	radius: number;
	set(center: Vector3, radius: number): BoundingSphere;
	copy(sphere: BoundingSphere): BoundingSphere;
	clone(): BoundingSphere;
	setFromPoints(points: Vector3List, center?: Vector3): BoundingSphere;
	isEmpty(): boolean;
	makeEmpty(): BoundingSphere;
	containsPoint(point: Vector3): boolean;
	dist(point: Vector3): number;
	distToPlane(plane: Plane): number;
	intersectsSphere(sphere: BoundingSphere): boolean;
	intersectsBox(box: BoundingBox): boolean;
	intersectsPlane(plane: Plane): boolean;
	clampPoint(point: Vector3, out: Vector3): Vector3;
	getBoundingBox(out: BoundingBox): BoundingBox;
	transform(mat: Matrix4): void;
	translate(offset: Vector3): void;
}

interface BoundingSphereConstructor {
    readonly prototype: BoundingSphere;
    new(): BoundingSphere;
}

class BoundingSphereBase implements BoundingSphere {

    private _center: Vector3;
	private _radius: number;
	
    constructor() {
        this._center = new Vector3([-Infinity, -Infinity, -Infinity]);
        this._radius = 0;
	}

	get center(): Vector3 {
		return this._center;
	}

	set center(center: Vector3) {
		this._center = center;
	}

	get radius(): number {
		return this._radius;
	}

	set radius(radius: number) {
		this._radius = radius;
	}

	set(center: Vector3, radius: number): BoundingSphereBase {
		this._center.copy(center);
		this._radius = radius;

		return this;
	}

	copy(sphere: BoundingSphereBase): BoundingSphereBase {
		this._center.copy(sphere._center);
		this._radius = sphere._radius;
		
		return this;
	}

	clone(): BoundingSphereBase {
		return new BoundingSphereBase().copy(this);
	}
	
	setFromPoints(points: Vector3List, center?: Vector3): BoundingSphereBase {

		if (center !== undefined) {
			this._center.copy(center);
        }
        else {
			const [box] = BoundingBoxPool.acquire(1);
			box.setFromPoints(points).getCenter(this._center);
			BoundingBoxPool.release(1);
		}

        let maxRadiusSq = 0;
		
		points.forEach((point: Vector3) => {
			maxRadiusSq = Math.max(maxRadiusSq, this._center.distanceSquared(point));
		});

		this._radius = Math.sqrt(maxRadiusSq);

		return this;
    }

	isEmpty(): boolean {
		return (this._radius < 0);
	}

	makeEmpty(): BoundingSphereBase {
		this._center.setZeros();
		this._radius = -1;

		return this;
	}

	containsPoint(point: Vector3): boolean {
		return (point.distanceSquared(this._center) <= (this._radius * this._radius));
	}

	dist(point: Vector3): number {
		return (point.distance(this._center) - this._radius);
	}

	distToPlane(plane: Plane): number {
		return plane.distanceToPoint(this._center) - this._radius;
	}

	intersectsSphere(sphere: BoundingSphereBase): boolean {
        const radiusSum = this._radius + sphere._radius;
        
		return this._center.distanceSquared(sphere._center) <= (radiusSum * radiusSum);
	}

	intersectsBox(box: BoundingBox): boolean {
		return box.intersectsSphere(this);
	}

	intersectsPlane(plane: Plane): boolean {
		return Math.abs(plane.distanceToPoint(this._center)) <= this._radius;
	}

	clampPoint(point: Vector3, out: Vector3): Vector3 {
		const deltaLenSq = this._center.distanceSquared(point);

		out.copy(point);

		if (deltaLenSq > (this._radius * this._radius)) {
			out.sub(this._center).normalize();
			out.scale(this._radius).add(this._center);
		}

		return out;
	}

	getBoundingBox(out: BoundingBox): BoundingBox {

		if (this.isEmpty()) {
			out.makeEmpty();
			return out;
		}

		out.set(this._center, this._center);
		out.expandByScalar(this._radius);

		return out;
	}

	transform(matrix: Matrix4): void {
		matrix.transformPoint(this._center);
		this._radius = this._radius * matrix.getMaxScaleOnAxis();
	}

	translate(offset: Vector3): void {
		this._center.add(offset);
	}
}

var BoundingSphere: BoundingSphereConstructor = BoundingSphereBase;
const BoundingSphereInjector: Injector<BoundingSphereConstructor> = new Injector({
	defaultCtor: BoundingSphereBase,
	onDefaultOverride:
		(ctor: BoundingSphereConstructor) => {
			BoundingSphere = ctor;
		}
});