import { Injector } from "../../../patterns/injectors/Injector";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Vector3Pool } from "../../extensions/pools/Vector3Pools";

export { Plane };
export { PlaneInjector };
export { PlaneBase };

interface Plane {
    readonly normal: Vector3;
    constant: number;
    copy(plane: Plane): Plane;
    set(x: number, y: number, z: number, constant: number): Plane;
    setFromNormalAndConstant(normal: Vector3, constant: number): Plane;
	setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
	setFromCoplanarPoints(point1: Vector3, point2: Vector3, point3: Vector3): Plane;
	distanceToPoint(point: Vector3): number;
    normalized(): Plane;
}

interface PlaneConstructor {
    readonly prototype: Plane;
    new(): Plane;
    new(normal: Vector3, constant: number): Plane;
    new(normal?: Vector3, constant?: number): Plane;
    fromNormalAndConstant(normal: Vector3, constant: number): Plane;
    fromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane;
    fromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane;
    intersection(a: Plane, b: Plane, c: Plane, result: Vector3): Vector3;
}

class PlaneBase implements Plane {

    readonly normal: Vector3;
    constant: number;

    constructor()
    constructor(normal: Vector3, constant: number)
    constructor(normal?: Vector3, constant?: number) {
        this.normal = normal ?? new Vector3();
        this.constant = constant ?? 0;
    }

    static fromNormalAndConstant(normal: Vector3, constant: number): Plane {
        return new PlaneBase().setFromNormalAndConstant(normal, constant);
    }

	static fromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane {
		return new PlaneBase().setFromNormalAndCoplanarPoint(normal, point);
	}

	static fromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane {
        return new PlaneBase().setFromCoplanarPoints(a, b, c);
    }

    copy(plane: PlaneBase): PlaneBase {
        this.normal.copy(plane.normal);
        this.constant = plane.constant;
        return this;
    }

    set(x: number, y: number, z: number, constant: number): PlaneBase {
        this.normal.setValues(x, y, z);
        this.constant = constant;

        return this;
    }

    setFromNormalAndConstant(normal: Vector3, constant: number): PlaneBase {
        this.normal.copy(normal);
        this.constant = constant;

        return this;
    }

	setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): PlaneBase {
		this.normal.copy(normal);
        this.constant = -point.dot(this.normal);
        
        return this;
	}

	setFromCoplanarPoints(point1: Vector3, point2: Vector3, point3: Vector3): PlaneBase {
        const normal = point3.clone();
        const [temp] = Vector3Pool.acquire(1);
        temp.copy(point1);
        normal.sub(point2).cross(temp.sub(point2)).normalize();
        this.setFromNormalAndCoplanarPoint(normal, point1);
        Vector3Pool.release(1);
		return this;
    }

	distanceToPoint(point: Vector3): number {
		return this.normal.dot(point) + this.constant;
	}
    
    normalized(): PlaneBase {
        const inverseNormalLength = 1.0 / this.normal.length();
        this.normal.scale(inverseNormalLength);
		this.constant *= inverseNormalLength;
		return this;
	}

    static intersection(a: Plane, b: Plane, c: Plane, result: Vector3): Vector3 {
        const {normal: aNormal, constant: aConstant} = a;
        const {normal: bNormal, constant: bConstant} = b;
        const {normal: cNormal, constant: cConstant} = c;
        result.copy(bNormal).cross(cNormal);
        const f = -aNormal.dot(result);
        const [v1x, v1y, v1z] = result.scale(aConstant).array;
        result.copy(cNormal).cross(aNormal);
        const [v2x, v2y, v2z] = result.scale(bConstant).array;
        result.copy(aNormal).cross(bNormal);
        const [v3x, v3y, v3z] = result.scale(cConstant).array;
        result.setValues(
          (v1x + v2x + v3x) / f,
          (v1y + v2y + v3y) / f,
          (v1z + v2z + v3z) / f
        );
        return result;
    }
}

var Plane: PlaneConstructor = PlaneBase;
const PlaneInjector: Injector<PlaneConstructor> = new Injector({
	defaultCtor: PlaneBase,
	onDefaultOverride:
		(ctor: PlaneConstructor) => {
			Plane = ctor;
		}
});