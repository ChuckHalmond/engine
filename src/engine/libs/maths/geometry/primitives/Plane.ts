import { Injector } from "../../../patterns/injectors/Injector";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Vector3Pool } from "../../extensions/pools/Vector3Pools";

export { Plane };
export { PlaneInjector };
export { PlaneBase };

interface Plane {
    normal: Vector3;
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
}

class PlaneBase implements Plane {

    private _normal: Vector3;
    private _constant: number;

    constructor()
    constructor(normal: Vector3, constant: number)
    constructor(normal?: Vector3, constant?: number) {
        this._normal = normal || new Vector3([0, 0, 0]);
        this._constant = constant || 0;
    }

    public static fromNormalAndConstant(normal: Vector3, constant: number): Plane {
        return new PlaneBase().setFromNormalAndConstant(normal, constant);
    }

	public static fromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): Plane {
		return new PlaneBase().setFromNormalAndCoplanarPoint(normal, point);
	}

	public static fromCoplanarPoints(a: Vector3, b: Vector3, c: Vector3): Plane {
        return new PlaneBase().setFromCoplanarPoints(a, b, c);
    }

    public get normal(): Vector3 {
		return this._normal;
	}

	public set normal(normal: Vector3) {
		this._normal = normal;
	}

	public get constant(): number {
		return this._constant;
	}

	public set constant(constant: number) {
		this._constant = constant;
	}

    public copy(plane: PlaneBase): PlaneBase {
        this._normal = plane._normal.clone();
        this._constant = plane._constant;

        return this;
    }

    public set(x: number, y: number, z: number, constant: number): PlaneBase {
        this._normal.setValues([x, y, z]);
        this._constant = constant;

        return this;
    }

    public setFromNormalAndConstant(normal: Vector3, constant: number): PlaneBase {
        this._normal.copy(normal);
        this._constant = constant;

        return this;
    }

	public setFromNormalAndCoplanarPoint(normal: Vector3, point: Vector3): PlaneBase {
		this._normal.copy(normal);
        this._constant = -point.dot(this._normal);
        
        return this;
	}

	public setFromCoplanarPoints(point1: Vector3, point2: Vector3, point3: Vector3): PlaneBase {
        const normal = point3.clone();
        Vector3Pool.acquireTemp(1, (temp) => {
            temp.copy(point1);
            normal.sub(point2).cross(temp.sub(point2)).normalize();
            this.setFromNormalAndCoplanarPoint(normal, point1);
        });
		return this;
    }

	public distanceToPoint(point: Vector3): number {
		return this._normal.dot(point) + this._constant;
	}
    
    public normalized(): PlaneBase {
        const inverseNormalLength = 1.0 / this._normal.len();
        
        this._normal.multScalar(inverseNormalLength);
		this._constant *= inverseNormalLength;

		return this;
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