import { Injector } from "../../../patterns/injectors/Injector";
import { Matrix4 } from "../../algebra/matrices/Matrix4";
import { Vector3 } from "../../algebra/vectors/Vector3";
import { Triangle } from "./Triangle";
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
    new (): Quad;
    new (point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): Quad;
    new (point1?: Vector3, point2?: Vector3, point3?: Vector3, point4?: Vector3): Quad;
}
declare class QuadBase implements Quad {
    private _point1;
    private _point2;
    private _point3;
    private _point4;
    constructor();
    constructor(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3);
    get point1(): Vector3;
    set point1(point1: Vector3);
    get point2(): Vector3;
    set point2(point2: Vector3);
    get point3(): Vector3;
    set point3(point3: Vector3);
    get point4(): Vector3;
    set point4(point4: Vector3);
    set(point1: Vector3, point2: Vector3, point3: Vector3, point4: Vector3): QuadBase;
    clone(): QuadBase;
    copy(quad: QuadBase): QuadBase;
    translate(vec: Vector3): void;
    transform(mat: Matrix4): void;
    copyTriangles(triangle1: Triangle, triangle2: Triangle): void;
}
declare var Quad: QuadConstructor;
declare const QuadInjector: Injector<QuadConstructor>;
