import { Injector } from "../../../patterns/injectors/Injector";
import { BoundingBox } from "../../../physics/collisions/BoundingBox";
import { BoundingSphere } from "../../../physics/collisions/BoundingSphere";
import { Matrix4 } from "../../algebra/matrices/Matrix4";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Vector3Pool } from "../../extensions/pools/Vector3Pools";
import { Plane } from "./Plane";
import { Quad } from "./Quad";
import { Triangle } from "./Triangle";

export { Ray };
export { RayInjector }
export { RayBase };

interface Ray {
  origin: Vector3;
  direction: Vector3;
  set(origin: Vector3, direction: Vector3): Ray;
  equals(ray: Ray): boolean;
  copy(ray: Ray): Ray;
  clone(): Ray;
  pointAt(dist: number, out: Vector3): Vector3;
  closestPointTo(point: Vector3, out: Vector3): Vector3;
  distToPoint(point: Vector3): number;
  distSqToPoint(point: Vector3): number;
  distToPlane(plane: Plane): number | null;
  intersectsWithSphere(sphere: BoundingSphere): boolean;
  intersectsWithQuad(quad: Quad): number | null;
  intersectsWithTriangle(triangle: Triangle): number | null;
  intersectsWithPlane(plane: Plane): boolean | null;
  intersectsWithBox(box: BoundingBox): boolean | null;
  intersectionWithSphere(sphere: BoundingSphere, out: Vector3): Vector3 | null;
  intersectionWithPlane(plane: Plane, out: Vector3): Vector3 | null;
  intersectionWithBox(box: BoundingBox, out: Vector3): Vector3 | null;
  transform(mat: Matrix4): void;
}

interface RayConstructor {
  readonly prototype: Ray;
  new(): Ray;
  new(origin: Vector3, direction: Vector3): Ray;
  new(origin?: Vector3, direction?: Vector3): Ray;
}

class RayBase implements Ray {

  private _origin: Vector3;
  private _direction: Vector3;

  constructor()
  constructor(origin: Vector3, direction: Vector3)
  constructor(origin?: Vector3, direction?: Vector3) {
    this._origin = origin || new Vector3([0, 0, 0]);
    this._direction = direction || new Vector3([0, 0, 0]);
  }

  public get origin(): Vector3 {
		return this._origin;
  }
    
  public set origin(origin: Vector3) {
		this._origin = origin;
	}

	public get direction(): Vector3 {
		return this._direction;
	}

	public set direction(direction: Vector3) {
		this._direction = direction;
  }
  
  public set(origin: Vector3, direction: Vector3): RayBase {
    this._origin.copy(origin);
    this._direction.copy(direction);

    return this;
  }

  public equals(ray: RayBase) {
    return ray._origin.equals(this._origin) && ray._direction.equals(this._direction);
  }

  public copy(ray: RayBase): RayBase {

    this._origin.copy(ray._origin);
    this._direction.copy(ray._direction);

    return this;
  }

  public clone(): RayBase {
    return new RayBase().set(this._origin, this._direction);
  }

  public pointAt(dist: number, out: Vector3): Vector3 {
    return out.copy(this._direction).scale(dist).add(this._origin);
  }

  public lookAt(vec: Vector3) {
    this._direction.copy(vec).sub(this._origin).normalize();

    return this;
  }

  public closestPointTo(point: Vector3, out: Vector3): Vector3 {
    out.copy(point).sub(this._origin);
    const directionDist = out.dot(this._direction);

    if (directionDist < 0) {
      return out.copy(this._origin);
    }

    return out.copy(this._direction).scale(directionDist).add(this._origin);
  }

  public distToPoint(point: Vector3): number {
    return Math.sqrt(this.distSqToPoint(point));
  }

  public distSqToPoint(point: Vector3) {
    let distSq = 0;

    const [temp] = Vector3Pool.acquire(1);
    const directionDist = temp.copy(point).sub(this._origin).dot(this._direction);

    if (directionDist < 0) {
      distSq = this._origin.distanceSquared(point);
    }
    else {
      temp.copy(this._direction).scale(directionDist).add(this._origin);
      distSq = temp.distanceSquared(point);
    }
    Vector3Pool.release(1);

    return distSq;
  }

  public distToPlane(plane: Plane): number | null {
    const denominator = plane.normal.dot(this._direction);

    if (denominator === 0) {
      if (plane.distanceToPoint(this._origin) === 0) {
        return 0;
      }
      return null;
    }

    const dist = -(this._origin.dot(plane.normal) + plane.constant) / denominator;
    return dist >= 0 ? dist : null;
  }

  public intersectsWithSphere(sphere: BoundingSphere): boolean {
    return this.distSqToPoint(sphere.center) <= (sphere.radius * sphere.radius);
  }

  public intersectsWithQuad(quad: Quad): number | null {
    let intersects = null;

    const [edge1, edge2, q, s] = Vector3Pool.acquire(4);
    edge1.copyAndSub(quad.point2, quad.point1);
    edge2.copyAndSub(quad.point3, quad.point1);
    q.copyAndCross(this._direction, edge2);

    let a, f, v, u;

    a = edge1.dot(q);

    if (!(a > -Number.EPSILON && a < Number.EPSILON)) {
      f = 1 / a;

      s.copyAndSub(this._origin, quad.point1);
      u = f * (s.dot(q));

      if (u >= 0.0) {
        q.copyAndCross(s, edge1);
        v = f * (this._direction.dot(q));

        if (!(v < -Number.EPSILON || u + v > 1.0 + Number.EPSILON)) {
          intersects = f * (edge2.dot(q));
          Vector3Pool.release(4);
          return null;
        }
      }
    }

    edge1.copyAndSub(quad.point1, quad.point4);
    edge2.copyAndSub(quad.point3, quad.point4);

    q.copyAndCross(this._direction, edge2);
    a = edge1.dot(q);

    if (!(a > -Number.EPSILON && a < Number.EPSILON)) {
      f = 1 / a;
      s.copy(this._origin).sub(quad.point4);
      u = f * (s.dot(q));

      if (u >= 0.0) {
        q.copyAndCross(s, edge1);
        v = f * (this._direction.dot(q));

        if (!(v < -Number.EPSILON || u + v > 1.0 + Number.EPSILON)) {
          intersects = f * (edge2.dot(q));
          Vector3Pool.release(4);
          return null;
        }
      }
    }
    Vector3Pool.release(4);

    return intersects;
  }

  /**
   * Möller–Trumbore intersection algorithm
   */
  public intersectsWithTriangle(triangle: Triangle): number | null {
    let intersects = null;

    const [edge1, edge2, q, s] = Vector3Pool.acquire(4);
    edge1.copyAndSub(triangle.point2, triangle.point1);
    edge2.copyAndSub(triangle.point3, triangle.point1);
    q.copyAndCross(this._direction, edge2);

    let a, f, u, v;

    a = edge2.dot(q);
  
    if (a > -Number.EPSILON && a < Number.EPSILON) {
      Vector3Pool.release(4);
      return null;
    }
  
    f = 1 / a;
    s.copyAndSub(this._origin, triangle.point1);
    u = f * (s.dot(q));
  
    if (u < 0) {
      Vector3Pool.release(4);
      return null;
    }
  
    q.copyAndCross(s, edge1);
    v = f * (this._direction.dot(q));
  
    if (v < -Number.EPSILON || u + v > 1.0 + Number.EPSILON) {
      Vector3Pool.release(4);
      return null;
    }
    intersects = f * (edge2.dot(q));
    Vector3Pool.release(4);

    return intersects;
  }

  public intersectsWithPlane(plane: Plane): boolean {
    const distToPoint = plane.distanceToPoint(this._origin);

    if (distToPoint === 0) {
      return true;
    }

    const denominator = plane.normal.dot(this._direction);
    if (denominator * distToPoint < 0) {
      return true;
    }
    return false;
  }

  public intersectsWithBox(box: BoundingBox): boolean {
    let intersects = false;
    
    const [temp] = Vector3Pool.acquire(1);
    intersects = this.intersectionWithBox(box, temp) !== null;
    Vector3Pool.release(1);

    return intersects;
  }

  public intersectionWithSphere(sphere: BoundingSphere, out: Vector3): Vector3 | null {

    out.copyAndSub(sphere.center, this._origin);
    
    const tca = out.dot(this._direction);
    const d2 = out.dot(out) - tca * tca;
    const radius2 = sphere.radius * sphere.radius;

    if (d2 > radius2) {
      return null;
    }
    
    const thc = Math.sqrt(radius2 - d2);
    const t0 = tca - thc;
    const t1 = tca + thc;

    if (t0 < 0 && t1 < 0) {
      return null;
    }

    if (t0 < 0) return this.pointAt(t1, out);

    return this.pointAt(t0, out);
  }

  public intersectionWithPlane(plane: Plane, out: Vector3): Vector3 | null {

    const dist = this.distToPlane(plane);
    if (dist === null) {
      return null;
    }

    return this.pointAt(dist, out);
  }

  public intersectionWithBox(box: BoundingBox, out: Vector3): Vector3 | null {

    let distMinX, distMaxX, distMinY, distMaxY, distMinZ, distMaxZ;

    const invDirX = 1 / this._direction.x,
      invDirY = 1 / this._direction.y,
      invDirZ = 1 / this._direction.z;

    const origin = this._origin;

    if (invDirX >= 0) {
      distMinX = (box.min.x - origin.x) * invDirX;
      distMaxX = (box.max.x - origin.x) * invDirX;

    } else {

      distMinX = (box.max.x - origin.x) * invDirX;
      distMaxX = (box.min.x - origin.x) * invDirX;

    }

    if (invDirY >= 0) {
      distMinY = (box.min.y - origin.y) * invDirY;
      distMaxY = (box.max.y - origin.y) * invDirY;
    }
    else {
      distMinY = (box.max.y - origin.y) * invDirY;
      distMaxY = (box.min.y - origin.y) * invDirY;
    }

    if ((distMinX > distMaxY) || (distMinY > distMaxX)) return null;


    if (distMinY > distMinX || distMinX !== distMinX) distMinX = distMinY;
    if (distMaxY < distMaxX || distMaxX !== distMaxX) distMaxX = distMaxY;

    if (invDirZ >= 0) {
      distMinZ = (box.min.z - origin.z) * invDirZ;
      distMaxZ = (box.max.z - origin.z) * invDirZ;

    }
    else {
      distMinZ = (box.max.z - origin.z) * invDirZ;
      distMaxZ = (box.min.z - origin.z) * invDirZ;
    }

    if ((distMinX > distMaxZ ) || (distMinZ > distMaxX)) return null;
    if (distMinX > distMinX || distMinX !== distMinX) distMinX = distMinZ;
    if (distMaxX < distMaxX || distMaxX !== distMaxX) distMaxX = distMaxZ;

    if (distMaxX < 0) return null;

    return this.pointAt(distMinX >= 0 ? distMinX : distMaxX, out);
  }

  public transform(matrix: Matrix4): void {
    matrix.transformPoint(this._origin);
    matrix.transformDirection(this._direction);
  }
}

var Ray: RayConstructor = RayBase;
const RayInjector: Injector<RayConstructor> = new Injector({
	defaultCtor: RayBase,
	onDefaultOverride:
		(ctor: RayConstructor) => {
			Ray = ctor;
		}
});