import { Injector } from "../../../patterns/injectors/Injector";
import { StackPool } from "../../../patterns/pools/StackPool";
import { Matrix4 } from "../../algebra/matrices/Matrix4";
import { Vector2 } from "../../algebra/vectors/Vector2";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Vector3Pool } from "../../extensions/pools/Vector3Pools";
import { Plane } from "./Plane";

//  p1
//  |\
//  | \
//  |  \
//  |   \
//  |    \
//  p3----p2

export { TriangleValues };
export { Triangle };
export { TriangleInjector }
export { TriangleBase };
export { TrianglePool };

type TriangleValues = Tuple<number, 9>;

interface Triangle {
	readonly point1: Vector3;
    readonly point2: Vector3;
	readonly point3: Vector3;

	set(point1: Vector3, point2: Vector3, point3: Vector3): Triangle;
	getValues(): TriangleValues;
    setValues(values: TriangleValues): Triangle;
    clone(): Triangle;
    copy(triangle: Triangle): Triangle;
    getNormal(out: Vector3): Vector3;
	getBarycentricCoordinates(point: Vector3, out: Vector3): Vector3;
	sharedPointsWith(triangle: Triangle): IterableIterator<Vector3>;
	indexOfPoint(point: Vector3): number;
	containsPoint(point: Vector3): boolean;
	getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2;
	isFrontFacing(direction: Vector3): boolean;
	getArea(): number;
	getMidpoint(out: Vector3): Vector3;
	getPlane(out: Plane): Plane;
	closestPointToPoint(point: Vector3, out: Vector3): Vector3;
	equals(triangle: Triangle): boolean;
    translate(vec: Vector3): void;
    transform(mat: Matrix4): void;
	toString(): string;
	readFromArray(arr: ArrayLike<number>, offset: number): Triangle;
	writeIntoArray(arr: WritableArrayLike<number>, offset: number): void;
}

interface TriangleConstructor {
	readonly prototype: Triangle;
	new(): Triangle;
	new(point1: Vector3, point2: Vector3, point3: Vector3): Triangle;
	new(point1?: Vector3, point2?: Vector3, point3?: Vector3): Triangle;
}

class TriangleBase implements Triangle {

	private _point1: Vector3;
	private _point2: Vector3;
	private _point3: Vector3;

	constructor()
	constructor(point1: Vector3, point2: Vector3, point3: Vector3)
	constructor(point1?: Vector3, point2?: Vector3, point3?: Vector3) {
		this._point1 = point1 || new Vector3();
		this._point2 = point2 || new Vector3();
		this._point3 = point3 || new Vector3();
	}

	public get point1(): Vector3 {
		return this._point1;
	}

	public set point1(point1: Vector3) {
		this._point1 = point1;
	}

	public get point2(): Vector3 {
		return this._point2;
	}

	public set point2(point2: Vector3) {
		this._point2 = point2;
	}

	public get point3(): Vector3 {
		return this._point3;
	}

	public set point3(point3: Vector3) {
		this._point3 = point3;
	}

	public getValues(): TriangleValues {
		const point1 = this._point1,
			point2 = this._point2,
			point3 = this._point3;
		
		return [
			point1.x, point1.y, point1.z,
			point2.x, point2.y, point2.z,
			point3.x, point3.y, point3.z
		];
	}

    public set(point1: Vector3, point2: Vector3, point3: Vector3): TriangleBase {
        this._point1.copy(point1);
        this._point2.copy(point2);
		this._point3.copy(point3);
		
		return this;
	}
	
    public setValues(values: TriangleValues): TriangleBase {
		
        this._point1.setValues([values[0], values[1], values[2]]);
        this._point2.setValues([values[3], values[4], values[5]]);
		this._point3.setValues([values[6], values[7], values[8]]);
		
		return this;
	}

    public clone(): TriangleBase {
        return new TriangleBase().copy(this);
    }

    public copy(triangle: TriangleBase): TriangleBase {
        this._point1 = triangle._point1;
        this._point2 = triangle._point2;
        this._point3 = triangle._point3;
        
        return this;
    }

    public getNormal(out: Vector3): Vector3  {
		Vector3Pool.acquireTemp(1, (temp) => {
			out.copyAndSub(this._point2, this.point1);
			temp.copyAndSub(this._point3, this.point1);
			out.cross(temp).normalize();
		});
		
        return out;
	}

	public getBarycentricCoordinates(point: Vector3, out: Vector3): Vector3 {
		Vector3Pool.acquireTemp(3, (v1, v2, vp) => {
			v1.copyAndSub(this._point2, this._point1),
			v2.copyAndSub(this._point3, this._point1),
			vp.copyAndSub(point, this._point1);

			const dotxx = v1.dot(v1);
			const dotxy = v1.dot(v2);
			const dotxz = v1.dot(vp);
			const dotyy = v2.dot(v2);
			const dotyz = v2.dot(vp);

			const denom = (dotxx * dotyy - dotxy * dotxy);
			if (denom === 0) {
				// TODO: Handle ?
				out.setValues([-2, -1, -1]);
				return;
			}

			const invDenom = 1 / denom;
			const u = (dotyy * dotxz - dotxy * dotyz) * invDenom;
			const v = (dotxx * dotyz - dotxy * dotxz) * invDenom;

			out.setValues([1 - u - v, v, u]);
		});

		return out;
	}

	public *sharedPointsWith(triangle: TriangleBase): IterableIterator<Vector3> {
		if (this._point1.equals(triangle._point1) || this._point1.equals(triangle._point2) || this._point1.equals(triangle._point3)) yield this._point1;
		if (this._point2.equals(triangle._point1) || this._point2.equals(triangle._point2) || this._point2.equals(triangle._point3)) yield this._point2;
		if (this._point3.equals(triangle._point1) || this._point3.equals(triangle._point2) || this._point3.equals(triangle._point3)) yield this._point3;
	}

	public indexOfPoint(point: Vector3): number {
		return (point.equals(this._point1)) ? 0 :
			(point.equals(this._point2)) ? 1 :
			(point.equals(this._point3)) ? 2 : -1;
	}

	public containsPoint(point: Vector3): boolean {

		let contains = false;
		Vector3Pool.acquireTemp(1, (pointCoords) => {
			this.getBarycentricCoordinates(point, pointCoords);
			contains = (pointCoords.x >= 0) && (pointCoords.y >= 0) && ((pointCoords.x + pointCoords.y) <= 1);
		});
        
		return contains;
	}

	public getUV(point: Vector3, uv1: Vector2, uv2: Vector2, uv3: Vector2, out: Vector2): Vector2 {
		Vector3Pool.acquireTemp(1, (pointCoords) => {
			this.getBarycentricCoordinates(point, pointCoords);

			out.setZeros();
			out.addScaled(uv1, pointCoords.x);
			out.addScaled(uv2, pointCoords.y);
			out.addScaled(uv3, pointCoords.z);
		});

		return out;
	}

	public isFrontFacing(direction: Vector3): boolean {
		let result = false;

		Vector3Pool.acquireTemp(2, (v1, v2) => {
			v1.copyAndSub(this._point2, this._point1),
			v2.copyAndSub(this._point3, this._point1);
			result = (v1.cross(v2).dot(direction) < 0);
		});

		return result;
	}

	public getArea(): number {
		let area = 0;
		
		Vector3Pool.acquireTemp(2, (v1, v2) => {
			v1.copyAndSub(this._point2, this._point1),
			v2.copyAndSub(this._point3, this._point1);
			area = v1.cross(v2).len() * 0.5;
		});

		return area;
	}

	public getMidpoint(out: Vector3): Vector3 {
		return out.copy(this._point1).add(this._point2).add(this._point3).multScalar(1 / 3);
	}

	public getPlane(out: Plane): Plane {
		throw Error('Not implemented yet.');
	}

	public closestPointToPoint(point: Vector3, out: Vector3): Vector3 {
        const point1 = this._point1,
            point2 = this._point2,
            point3 = this._point3;

        let v, w;
		
		Vector3Pool.acquireTemp(4, (vb, vc, vp, vbp) => {
			vb.copyAndSub(point2, point1),
			vc.copyAndSub(point3, point1),
			vp.copyAndSub(point, point1);

			const d1 = vb.dot(vp);
			const d2 = vc.dot(vp);
			
			if (d1 <= 0 && d2 <= 0) {
				return out.copy(point1);
			}

			vbp.copyAndSub(point, point2);
			
			const d3 = point1.dot(vbp);
			const d4 = vc.dot(vbp);
			
			if (d3 >= 0 && d4 <= d3) {
				return out.copy(point2);
			}

			const dc = d1 * d4 - d3 * d2;
			if (dc <= 0 && d1 >= 0 && d3 <= 0) {
				v = d1 / ( d1 - d3 );
				return out.copy(point1).addScaled(vb, v);
			}

			vp.copyAndSub(point, point3);
			const d5 = vb.dot(vp);
			const d6 = vc.dot(vp);
			if (d6 >= 0 && d5 <= d6) {
				return out.copy(point3);
			}

			const db = d5 * d2 - d1 * d6;
			if (db <= 0 && d2 >= 0 && d6 <= 0) {
				w = d2 / (d2 - d6);
				return out.copy(point1).addScaled(vc, w);
			}

			const da = d3 * d6 - d5 * d4;
			if (da <= 0 && (d4 - d3) >= 0 && (d5 - d6) >= 0) {
				vc.copyAndSub(point3, point2);
				w = ( d4 - d3 ) / ( ( d4 - d3 ) + ( d5 - d6 ) );
				return out.copy(point2).addScaled(vc, w);
			}

			const denom = 1 / (da + db + dc );
			v = db * denom;
			w = dc * denom;
			
			out.copy(point1).addScaled(vb, v).addScaled(vc, w);
		});

		return out;
	}
	
	public equals(triangle: TriangleBase): boolean {
        return triangle._point1.equals(this._point1)
            && triangle._point2.equals(this._point2)
            && triangle._point3.equals(this._point3);
	}

    public translate(vec: Vector3): void {
        this._point1.add(vec);
        this._point2.add(vec);
        this._point3.add(vec);
    }

    public transform(mat: Matrix4): void {
        this._point1.setValues(mat.transformDirection(this._point1));
        this._point2.setValues(mat.transformDirection(this._point2));
        this._point3.setValues(mat.transformDirection(this._point3));
	}

	public readFromArray(arr: ArrayLike<number>, offset: number): TriangleBase {
		this.point1.readFromArray(arr, offset);
		this.point2.readFromArray(arr, offset + 3);
		this.point3.readFromArray(arr, offset + 6);
		return this;
	}

	public writeIntoArray(arr: WritableArrayLike<number>, offset: number): void {
		this.point1.writeIntoArray(arr, offset);
		this.point2.writeIntoArray(arr, offset + 3);
		this.point3.writeIntoArray(arr, offset + 6);
	}
}

var Triangle: TriangleConstructor = TriangleBase;
const TriangleInjector: Injector<TriangleConstructor> = new Injector({
	defaultCtor: TriangleBase,
	onDefaultOverride:
		(ctor: TriangleConstructor) => {
			Triangle = ctor;
		}
});
const TrianglePool: StackPool<Triangle> = new StackPool(TriangleBase);