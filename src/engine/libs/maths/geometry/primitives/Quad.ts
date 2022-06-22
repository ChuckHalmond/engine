import { Injector } from "../../../patterns/injectors/Injector";
import { Matrix4 } from "../../algebra/matrices/Matrix4";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Triangle } from "./Triangle";
//  p1----p2
//  |\    |
//  | \   |
//  |  \  |
//  |   \ |
//  |    \|
//  p4----p3

export { Quad };
export { QuadInjector };
export { QuadBase };

interface Quad {
    point1: Vector3;
    point2: Vector3;
	point3: Vector3;
	point4: Vector3;
    set(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): Quad;
    clone(): Quad;
    copy(quad: Quad): Quad;
    translate(vec: Vector3): void;
    transform(mat: Matrix4): void;
    copyTriangles(triangle1: Triangle, triangle2: Triangle): void;
}

interface QuadConstructor {
    readonly prototype: Quad;
    new(): Quad;
    new(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): Quad;
    new(point1?: Vector3, point2?: Vector3, point3?: Vector3, point4?: Vector3): Quad;
}

class QuadBase implements Quad {

    private _point1: Vector3;
    private _point2: Vector3;
    private _point3: Vector3;
    private _point4: Vector3;
    
    constructor()
    constructor(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3)
    constructor(point1?: Vector3, point2?: Vector3, point3?: Vector3, point4?: Vector3) {
        this._point1 = point1 || new Vector3([0, 0, 0]);
        this._point2 = point2 || new Vector3([0, 0, 0]);
        this._point3 = point3 || new Vector3([0, 0, 0]);
        this._point4 = point4 || new Vector3([0, 0, 0]);
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
    
    public get point4(): Vector3 {
		return this._point4;
	}

	public set point4(point4: Vector3) {
		this._point4 = point4;
	}

    public set(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): QuadBase {
        this._point1.copy(point1);
        this._point2.copy(point2);
        this._point3.copy(point3);
        this._point4.copy(point4);

        return this;
    }

    public clone(): QuadBase {
        return new QuadBase().copy(this);
    }

    public copy(quad: QuadBase): QuadBase {
        this._point1 = quad._point1;
        this._point2 = quad._point2;
        this._point3 = quad._point3;
        this._point4 = quad._point4;
        
        return this;
    }

    public translate(vec: Vector3): void {
        this._point1.add(vec);
        this._point2.add(vec);
        this._point3.add(vec);
        this._point4.add(vec);
    }

    public transform(matrix: Matrix4): void {
        matrix.transformDirection(this._point1);
        matrix.transformDirection(this._point2);
        matrix.transformDirection(this._point3);
        matrix.transformDirection(this._point4);
    }

    public copyTriangles(triangle1: Triangle, triangle2: Triangle): void {
        triangle1.set(this._point1, this._point2, this._point3);
        triangle2.set(this._point1, this._point4, this._point3);
    }
}

var Quad: QuadConstructor = QuadBase;
const QuadInjector: Injector<QuadConstructor> = new Injector({
	defaultCtor: QuadBase,
	onDefaultOverride:
		(ctor: QuadConstructor) => {
			Quad = ctor;
		}
});