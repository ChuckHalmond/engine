import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { Plane } from "engine/libs/maths/geometry/primitives/Plane";
import { BoundingSphere } from "./BoundingSphere";
import { Triangle } from "engine/libs/maths/geometry/primitives/Triangle";
import { Vector3List } from "engine/libs/maths/extensions/lists/Vector3List";
import { Injector } from "engine/libs/patterns/injectors/Injector";
import { StackPool } from "engine/libs/patterns/pools/StackPool";
import { Vector3Pool } from "engine/libs/maths/extensions/pools/Vector3Pools";

export { BoundingBox };
export { BoundingBoxInjector };
export { BoundingBoxBase };
export { BoundingBoxPool };

interface BoundingBox {
	min: Vector3;
	max: Vector3;
	
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

    private _min: Vector3;
	private _max: Vector3;

    constructor() {
        this._min = new Vector3([-Infinity, -Infinity, -Infinity]);
        this._max = new Vector3([+Infinity, +Infinity, +Infinity]);
    }
	
	public get min(): Vector3 {
		return this._min;
	}

	public set min(min: Vector3) {
		this._min = min;
	}

	public get max(): Vector3 {
		return this._max;
	}

	public set max(max: Vector3) {
		this._max = max;
	}

	public set(min: Vector3, max: Vector3): void {
        this._min.copy(min);
        this._max.copy(max);
    }

    public copy(box: BoundingBoxBase): BoundingBoxBase {
        this._min = box._min;
        this._max = box._max;

        return this;
    }

    public clone(box: BoundingBoxBase): BoundingBoxBase {
        return new BoundingBoxBase().copy(box);
    }

    public makeEmpty(): void {
        this._min.setValues([Infinity, Infinity, Infinity]);
        this._max.setValues([+Infinity, +Infinity, +Infinity]);
    }

    public isEmpty(): boolean {
        return (this._max.x < this._min.x) || (this._max.y < this._min.y) || (this._max.z < this._min.z);
    }

	public getCenter(out: Vector3): Vector3 {
		this.isEmpty() ? out.setValues([0, 0, 0]) : out.copy(this._min).add(this._max).multScalar(0.5);
		return out;
	}
    
	public getSize(out: Vector3): Vector3 {
		this.isEmpty() ? out.setValues([0, 0, 0]) : out.copy(this._max).sub(this._min);
		return out;
	}

    public setFromLengths(center: Vector3, length: number, width: number, height: number): BoundingBoxBase {
        this._min.setValues([center.x - length / 2, center.y - width / 2, center.z - height / 2]);
        this._max.setValues([center.x + length / 2, center.y + width / 2, center.z + height / 2]);

        return this;
    }

	public setFromPoints(points: Vector3List): BoundingBoxBase {
        this.makeEmpty();
		
        points.forEach((vec: Vector3) => {
            this.expandByPoint(vec);
        });
        
        return this;
    }
    
	public expandByPoint(point: Vector3): BoundingBoxBase {
		this._min.min(point);
        this._max.min(point);
        
        return this;
    }

	public expandByVector(vector: Vector3): BoundingBoxBase {
		this._min.sub(vector);
        this._max.add(vector);
        
		return this;
	}

	public expandByScalar(k: number) {
		this._min.addScalar(-k);
		this._max.addScalar(k);

		return this;
    }
    
	public clampPoint(point: Vector3, out: Vector3): Vector3 {
		return out.copy(point).clamp(this._min, this._max);
	}

	public distanceToPoint(point: Vector3): number {

		let dist = 0;

		Vector3Pool.acquireTemp(1, (temp) => {
			const clampedPoint = temp.copy(point).clamp(this._min, this._max);
			dist = clampedPoint.sub(point).len();
		});

        return dist;
	}

	public intersectsPlane(plane: Plane): boolean {
		let min = 0, max = 0;

		if (plane.normal.x > 0) {
			min = plane.normal.x * this._min.x;
			max = plane.normal.x * this._max.x;
        }
        else {
			min = plane.normal.x * this._max.x;
			max = plane.normal.x * this._min.x;
		}

		if (plane.normal.y > 0) {
			min += plane.normal.y * this._min.y;
			max += plane.normal.y * this._max.y;
        }
        else {
			min += plane.normal.y * this._max.y;
			max += plane.normal.y * this._min.y;
		}

		if (plane.normal.z > 0) {
			min += plane.normal.z * this._min.z;
			max += plane.normal.z * this._max.z;
        }
        else {
			min += plane.normal.z * this._max.z;
			max += plane.normal.z * this._min.z;
		}

		return (min <= -plane.constant && max >= -plane.constant);
    }

	public intersectsSphere(sphere: BoundingSphere): boolean {
        let intersects = false;

        Vector3Pool.acquireTemp(1, (clamped) => {
			this.clampPoint(sphere.center, clamped);
			intersects = clamped.distSq(sphere.center) <= (sphere.radius * sphere.radius);
		});

		return intersects;
	}

    public intersectsBox(box: BoundingBoxBase): boolean {
		return !(
            box._max.x < this._min.x || box._min.x > this._max.x ||
			box._max.y < this._min.y || box._min.y > this._max.y ||
            box._max.z < this._min.z || box._min.z > this._max.z
        );
    }

	public getBoundingSphere(out: BoundingSphere): BoundingSphere {
		out.radius = this.getSize(out.center).len() * 0.5;
		this.getCenter(out.center);

		return out;
    }
    
    public intersectsTriangle(triangle: Triangle): boolean {

		if (this.isEmpty()) {
			return false;
		}
		
		const point1 = triangle.point1,
			point2 = triangle.point2,
			point3 = triangle.point3;

		let intersects = false;

		Vector3Pool.acquireTemp(8,
			(center, extents, v1, v2, v3, edge1, edge2, edge3) => {
			
			this.getCenter(center);
			
			extents.copyAndSub(this._max, center),
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
				intersects = false;
				return;
			}

			axes = new Float32Array([
				1, 0, 0,
				0, 1, 0,
				0, 0, 1
			]);
			if (!this.satForAxes(axes, v1, v2, v3, extents)) {
				intersects = false;
				return;
			}

			const triangleNormal = center.copyAndCross(edge1, edge2);
			intersects = this.satForAxes(triangleNormal.values, v1, v2, v3, extents);
		});

		return intersects;
	}

	private satForAxes(axes: ArrayLike<number>, v1: Vector3, v2: Vector3, v3: Vector3, extents: Vector3) {

		let sat = true;
	
		Vector3Pool.acquireTemp(1, (axis) => {
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
		});
	
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