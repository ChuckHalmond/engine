import { Matrix4 } from "../../maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Vector3List } from "../../maths/extensions/lists/Vector3List";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Injector } from "../../patterns/injectors/Injector";
import { BoundingBox, BoundingBoxPool } from "./AxisAlignedBoundingBox";

export { BoundingSphere };
export { BoundingSphereInjector };
export { BoundingSphereBase };

interface BoundingSphere {
	readonly center: Vector3;
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

    readonly center: Vector3;
	radius: number;
	
    constructor() {
        this.center = new Vector3([-Infinity, -Infinity, -Infinity]);
        this.radius = 0;
	}
	
	set(center: Vector3, radius: number): BoundingSphereBase {
		this.center.copy(center);
		this.radius= radius;

		return this;
	}

	copy(sphere: BoundingSphereBase): BoundingSphereBase {
		this.center.copy(sphere.center);
		this.radius = sphere.radius;
		
		return this;
	}

	clone(): BoundingSphereBase {
		return new BoundingSphereBase().copy(this);
	}
	
	setFromPoints(points: Vector3List, center?: Vector3): BoundingSphereBase {

		if (center !== undefined) {
			this.center.copy(center);
        }
        else {
			const [box] = BoundingBoxPool.acquire(1);
			box.setFromPoints(points).getCenter(this.center);
			BoundingBoxPool.release(1);
		}

        let maxRadiusSq = 0;
		
		points.forEach((point: Vector3) => {
			maxRadiusSq = Math.max(maxRadiusSq, this.center.distanceSquared(point));
		});

		this.radius = Math.sqrt(maxRadiusSq);

		return this;
    }

	isEmpty(): boolean {
		return (this.radius < 0);
	}

	makeEmpty(): BoundingSphereBase {
		this.center.setZeros();
		this.radius = -1;

		return this;
	}

	containsPoint(point: Vector3): boolean {
		return (point.distanceSquared(this.center) <= (this.radius * this.radius));
	}

	dist(point: Vector3): number {
		return (point.distance(this.center) - this.radius);
	}

	distToPlane(plane: Plane): number {
		return plane.distanceToPoint(this.center) - this.radius;
	}

	intersectsSphere(sphere: BoundingSphereBase): boolean {
        const radiusSum = this.radius + sphere.radius;
        
		return this.center.distanceSquared(sphere.center) <= (radiusSum * radiusSum);
	}

	intersectsBox(box: BoundingBox): boolean {
		return box.intersectsSphere(this);
	}

	intersectsPlane(plane: Plane): boolean {
		return Math.abs(plane.distanceToPoint(this.center)) <= this.radius;
	}

	clampPoint(point: Vector3, out: Vector3): Vector3 {
		const deltaLenSq = this.center.distanceSquared(point);

		out.copy(point);

		if (deltaLenSq > (this.radius * this.radius)) {
			out.sub(this.center).normalize();
			out.scale(this.radius).add(this.center);
		}

		return out;
	}

	getBoundingBox(out: BoundingBox): BoundingBox {

		if (this.isEmpty()) {
			out.makeEmpty();
			return out;
		}

		out.set(this.center, this.center);
		out.expandByScalar(this.radius);

		return out;
	}

	transform(matrix: Matrix4): void {
		matrix.transformPoint(this.center);
		this.radius = this.radius * matrix.getMaxScaleOnAxis();
	}

	translate(offset: Vector3): void {
		this.center.add(offset);
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