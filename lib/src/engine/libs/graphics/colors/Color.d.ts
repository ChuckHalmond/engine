export { ColorValues };
export { Color };
declare type ColorValues = [number, number, number, number];
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
    rgb(r: number, g: number, b: number): Color;
    rgba(r: number, g: number, b: number, a: number): Color;
    array(...colors: Color[]): number[];
}
interface Color extends ArrayLike<number> {
    readonly array: WritableArrayLike<number>;
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
    setValues(r: number, g: number, b: number, a: number): Color;
    lerp(color: Color, t: number): Color;
    normalize(): Color;
}
declare const Color: ColorConstructor;
