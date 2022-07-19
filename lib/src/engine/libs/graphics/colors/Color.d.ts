export { ColorValues };
export { Color };
declare type ColorValues = [number, number, number];
interface ColorConstructor {
    readonly prototype: Color;
    new (): Color;
    new (values: ColorValues): Color;
    new (values?: ColorValues): Color;
    readonly BLACK: Color;
    readonly RED: Color;
    readonly GREEN: Color;
    readonly BLUE: Color;
    readonly WHITE: Color;
    array(...colors: Color[]): number[];
    lerp(a: Color, b: Color, t: number): Color;
}
interface Color extends ArrayLike<number> {
    readonly array: Float32Array;
    readonly length: number;
    0: number;
    1: number;
    2: number;
    r: number;
    g: number;
    b: number;
    copy(color: Color): Color;
    clone(): Color;
    getValues(): ColorValues;
    setValues(r: number, g: number, b: number): Color;
    lerp(color: Color, t: number): Color;
    normalize(): Color;
}
declare const Color: ColorConstructor;
