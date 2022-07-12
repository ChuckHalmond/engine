import { Vector3 } from "../../maths/algebra/vectors/Vector3";
import { Vector3List } from "../../maths/extensions/lists/Vector3List";
import { Vector3Pool } from "../../maths/extensions/pools/Vector3Pools";
import { Plane } from "../../maths/geometry/primitives/Plane";
import { Triangle } from "../../maths/geometry/primitives/Triangle";
import { Injector } from "../../patterns/injectors/Injector";
import { StackPool } from "../../patterns/pools/StackPool";
import { BoundingSphere } from "./BoundingSphere";

export { BoundingBox };
export { BoundingBoxInjector };
export { BoundingBoxBase };
export { BoundingBoxPool };

interface BoundingBox {
	readonly min: Vector3;
	readonly max: Vector3;
	set(min: Vector3, max: Vector3): void;
    copy(box: BoundingBox): BoundingBox;
    clone(box: BoundingBox): BoundingBox;
    makeEmpty(): void;
    isEmpty(): boolean;
	getCenter(out: Vector3): Vector3;
	getSize(out: Vector3): Vector3;
    setFromLengths(center: Vector3, length: number, width: number, height: number): BoundingBox;
	setFromPoints(points: Vector3List): BoundingBox;
	expandByPoint(point: Vector3): BoundingBox;
	expandByVector(vector: Vector3): BoundingBox;
	expandByScalar(k: number): void;
	clampPoint(point: Vector3, out: Vector3): Vector3;
	distanceToPoint(point: Vector3): number;
	intersectsPlane(plane: Plane): boolean;
	intersectsSphere(sphere: BoundingSphere): boolean;
    intersectsBox(box: BoundingBox): boolean;
	getBoundingSphere(out: BoundingSphere): BoundingSphere;
    intersectsTriangle(triangle: Triangle): boolean;
}

interface BoundingBoxConstructor {
    readonly prototype: BoundingBox;
    new(): BoundingBox;
}

class BoundingBoxBase implements BoundingBox {
    readonly min: Vector3;
	readonly max: Vector3;

    constructor() {
        this.min = new Vector3([-Infinity, -Infinity, -Infinity]);
        this.max = new Vector3([+Infinity, +Infinity, +Infinity]);
    }

	set(min: Vector3, max: Vector3): void {
        this.min.copy(min);
        this.max.copy(max);
    }

    copy(box: BoundingBoxBase): BoundingBoxBase {
        this.min.copy(box.min);
        this.max.copy(box.max);
        return this;
    }

    clone(box: BoundingBoxBase): BoundingBoxBase {
        return new BoundingBoxBase().copy(box);
    }

    makeEmpty(): void {
        this.min.setValues(Infinity, Infinity, Infinity);
        this.max.setValues(+Infinity, +Infinity, +Infinity);
    }

    isEmpty(): boolean {
        return (this.max.x < this.min.x) || (this.max.y < this.min.y) || (this.max.z < this.min.z);
    }

	getCenter(out: Vector3): Vector3 {
		this.isEmpty() ? out.setValues(0, 0, 0) : out.copy(this.min).add(this.max).scale(0.5);
		return out;
	}
    
	getSize(out: Vector3): Vector3 {
		this.isEmpty() ? out.setValues(0, 0, 0) : out.copy(this.max).sub(this.min);
		return out;
	}

    setFromLengths(center: Vector3, length: number, width: number, height: number): BoundingBoxBase {
        this.min.setValues(center.x - length / 2, center.y - width / 2, center.z - height / 2);
        this.max.setValues(center.x + length / 2, center.y + width / 2, center.z + height / 2);

        return this;
    }

	setFromPoints(points: Vector3List): BoundingBoxBase {
        this.makeEmpty();
		
        points.forEach((vec: Vector3) => {
            this.expandByPoint(vec);
        });
        
        return this;
    }
    
	expandByPoint(point: Vector3): BoundingBoxBase {
		this.min.min(point);
        this.max.min(point);
        
        return this;
    }

	expandByVector(vector: Vector3): BoundingBoxBase {
		this.min.sub(vector);
        this.max.add(vector);
        
		return this;
	}

	expandByScalar(k: number) {
		this.min.addScalar(-k);
		this.max.addScalar(k);

		return this;
    }
    
	clampPoint(point: Vector3, out: Vector3): Vector3 {
		return out.copy(point).clamp(this.min, this.max);
	}

	distanceToPoint(point: Vector3): number {
		let dist = 0;
		const [temp] = Vector3Pool.acquire(1);
		const clampedPoint = temp.copy(point).clamp(this.min, this.max);
		dist = clampedPoint.sub(point).length();
		Vector3Pool.release(1);
        return dist;
	}

	intersectsPlane(plane: Plane): boolean {
		let min = 0, max = 0;

		if (plane.normal.x > 0) {
			min = plane.normal.x * this.min.x;
			max = plane.normal.x * this.max.x;
        }
        else {
			min = plane.normal.x * this.max.x;
			max = plane.normal.x * this.min.x;
		}

		if (plane.normal.y > 0) {
			min += plane.normal.y * this.min.y;
			max += plane.normal.y * this.max.y;
        }
        else {
			min += plane.normal.y * this.max.y;
			max += plane.normal.y * this.min.y;
		}

		if (plane.normal.z > 0) {
			min += plane.normal.z * this.min.z;
			max += plane.normal.z * this.max.z;
        }
        else {
			min += plane.normal.z * this.max.z;
			max += plane.normal.z * this.min.z;
		}

		return (min <= -plane.constant && max >= -plane.constant);
    }

	intersectsSphere(sphere: BoundingSphere): boolean {
        let intersects = false;

        const [clamped] = Vector3Pool.acquire(1);
		this.clampPoint(sphere.center, clamped);
		intersects = clamped.distanceSquared(sphere.center) <= (sphere.radius * sphere.radius);
		Vector3Pool.release(1);

		return intersects;
	}

    intersectsBox(box: BoundingBoxBase): boolean {
		return !(
            box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ||
            box.max.z < this.min.z || box.min.z > this.max.z
        );
    }

	getBoundingSphere(out: BoundingSphere): BoundingSphere {
		out.radius = this.getSize(out.center).length() * 0.5;
		this.getCenter(out.center);

		return out;
    }
    
    intersectsTriangle(triangle: Triangle): boolean {

		if (this.isEmpty()) {
			return false;
		}
		
		const point1 = triangle.point1,
			point2 = triangle.point2,
			point3 = triangle.point3;

		let intersects = false;
		const [center, extents, v1, v2, v3, edge1, edge2, edge3] = Vector3Pool.acquire(8);

		this.getCenter(center);
		
		extents.copyAndSub(this.max, center),
		v1.copyAndSub(point1, center),
		v2.copyAndSub(point2, center),
		v3.copyAndSub(point3, center),
		edge1.copyAndSub(point2, point1),
		edge2.copyAndSub(point3, point2),
		edge3.copyAndSub(point1, point3);

		let axes = new Float32Array([
			0, 			-edge1.z, 	edge1.y,
			0,			-edge2.z, 	edge2.y,
			0, 			-edge3.z,	edge3.y,
			edge1.z,	0,			-edge1.x,
			edge2.z,	0,			-edge2.x,
			edge3.z,	0,			-edge3.x,
			-edge1.y,	edge1.x,	0,
			-edge2.y,	edge2.x,	0,
			-edge3.y,	edge3.x,	0
		]);

		if (!this.satForAxes(axes, v1, v2, v3, extents)) {
			Vector3Pool.release(8);
			return intersects;
		}

		axes = new Float32Array([
			1, 0, 0,
			0, 1, 0,
			0, 0, 1
		]);
		if (!this.satForAxes(axes, v1, v2, v3, extents)) {
			Vector3Pool.release(8);
			return intersects;
		}

		const triangleNormal = center.copyAndCross(edge1, edge2);
		intersects = this.satForAxes(triangleNormal.values, v1, v2, v3, extents);
		Vector3Pool.release(8);

		return intersects;
	}

	private satForAxes(axes: ArrayLike<number>, v1: Vector3, v2: Vector3, v3: Vector3, extents: Vector3) {
		let sat = true;
		const [axis] = Vector3Pool.acquire(1);
		for (let i = 0, j = axes.length - 3; i <= j; i += 3) {
			axis.x = axes[i    ];
			axis.y = axes[i + 1];
			axis.z = axes[i + 2];
			const r = extents.x * Math.abs(axis.x) + extents.y * Math.abs(axis.y) + extents.z * Math.abs(axis.z);
			const p1 = v1.dot(axis);
			const p2 = v2.dot(axis);
			const p3 = v3.dot(axis);

			if (Math.max(-Math.max(p1, p2, p3), Math.min(p1, p2, p3)) > r) {
				sat = false;
			}
		}
		Vector3Pool.release(1);
		return sat;
	}
}

var BoundingBox: BoundingBoxConstructor = BoundingBoxBase;
const BoundingBoxInjector: Injector<BoundingBoxConstructor> = new Injector({
	defaultCtor: BoundingBoxBase,
	onDefaultOverride:
		(ctor: BoundingBoxConstructor) => {
			BoundingBox = ctor;
		}
});
const BoundingBoxPool: StackPool<BoundingBox> = new StackPool(BoundingBoxBase);