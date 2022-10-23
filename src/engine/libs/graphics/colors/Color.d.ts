export { ColorValues };
export { Color };
declare type ColorValues = [number, number, number];
interface ColorConstructor {
    readonly prototype: Color;
    new (): Color;
    new (r: number, g: number, b: number): Color;
    new (r: number, g: number, b: number, a: number): Color;
    readonly YELLOW: Color;
    readonly BLACK: Color;
    readonly RED: Color;
    readonly GREEN: Color;
    readonly BLUE: Color;
    readonly WHITE: Color;
    array(...colors: Color[]): number[];
    lerp(a: Color, b: Color, t: number): Color;
    rgb(r: number, g: number, b: number): Color;
    rgba(rgb: Color): Color;
    rgba(rgb: Color, a: number): Color;
    rgba(r: number, g: number, b: number, a: number): Color;
}
interface Color extends ArrayLike<number>, Iterable<number> {
    readonly array: Float32Array;
    readonly length: number;
    0: number;
    1: number;
    2: number;
    3: number;
    r: number;
    g: number;
    b: number;
    a: number;
    copy(color: Color): Color;
    clone(): Color;
    getValues(): ColorValues;
    setValues(r: number, g: number, b: number, a?: number): Color;
    lerp(color: Color, t: number): Color;
    normalize(): Color;
}
declare const Color: ColorConstructor;
