export { ColorValues };
export { Color };
export { ColorBase };
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
interface Color {
    array: WritableArrayLike<number>;
    r: number;
    g: number;
    b: number;
    a: number;
    copy(color: Color): Color;
    clone(): Color;
    getValues(): ColorValues;
    setValues(r: number, g: number, b: number, a: number): Color;
    lerp(color: Color, t: number): Color;
    valuesNormalized(): ColorValues;
}
declare class ColorBase implements Color {
    private _array;
    constructor();
    constructor(type: new (length: number) => TypedArray);
    static readonly BLACK: ColorBase;
    static readonly RED: ColorBase;
    static readonly GREEN: ColorBase;
    static readonly BLUE: ColorBase;
    static readonly WHITE: ColorBase;
    static rgb(r: number, g: number, b: number): ColorBase;
    static rgba(r: number, g: number, b: number, a: number): ColorBase;
    static array(...colors: ColorBase[]): number[];
    get array(): WritableArrayLike<number>;
    get r(): number;
    set r(r: number);
    get g(): number;
    set g(g: number);
    get b(): number;
    set b(b: number);
    get a(): number;
    set a(a: number);
    setValues(r: number, g: number, b: number, a: number): ColorBase;
    getValues(): ColorValues;
    copy(color: ColorBase): ColorBase;
    clone(): ColorBase;
    lerp(color: ColorBase, t: number): ColorBase;
    valuesNormalized(): ColorValues;
}
declare const Color: ColorConstructor;
