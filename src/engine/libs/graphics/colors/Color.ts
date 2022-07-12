export { ColorValues };
export { Color };
export { ColorBase };

type ColorValues = [number, number, number, number];

interface ColorConstructor {
    readonly prototype: Color;
    new(): Color;
    new(values: ColorValues): Color;
    new(values?: ColorValues): Color;
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
    setValues(
        r: number,
        g: number,
        b: number,
        a: number
    ): Color;
    lerp(color: Color, t: number): Color;
    valuesNormalized(): ColorValues;
}

class ColorBase implements Color {
    private _array: TypedArray;

	constructor()
	constructor(type: new(length: number) => TypedArray)
	constructor(type?: new(length: number) => TypedArray) {
		this._array = new (type || Uint8Array)(9);
    }
    
    static readonly BLACK = ColorBase.rgb(0, 0, 0);
    static readonly RED = ColorBase.rgb(255, 0, 0);
    static readonly GREEN = ColorBase.rgb(0, 255, 0);
    static readonly BLUE = ColorBase.rgb(0, 0, 255);
    static readonly WHITE = ColorBase.rgb(255, 255, 255);

    static rgb(r: number, g: number, b: number): ColorBase {
        const color =  new ColorBase()
        color.setValues(r, g, b, 255);
        return color;
    }

    static rgba(r: number, g: number, b: number, a: number): ColorBase {
        const color =  new ColorBase()
        color.setValues(r, g, b, a);
        return color;
    }

    static array(...colors: ColorBase[]): number[] {
        const a = new Array<number>(colors.length * 4);
        let c;
        let i = 0;
        for (const color of colors) {
            c = color._array;
            a[i + 0] = c[0];
            a[i + 1] = c[1];
            a[i + 2] = c[2];
            a[i + 3] = c[3];
            i += 4;
        }
        return a;
    }

    get array(): WritableArrayLike<number> {
        return this._array;
    }

    get r(): number {
        return this._array[0];
    }

    set r(r: number) {
        this._array[0] = r;
    }

    get g(): number {
        return this._array[1];
    }

    set g(g: number) {
        this._array[1] = g;
    }

    get b(): number {
        return this._array[2];
    }

    set b(b: number) {
        this._array[2] = b;
    }

    get a(): number {
        return this._array[3];
    }

    set a(a: number) {
        this._array[3] = a;
    }

    setValues(r: number, g: number, b: number, a: number): ColorBase {
		const o = this._array;

		o[0] = r;
		o[1] = g;
		o[2] = b;
		o[3] = a;

		return this;
    }
    
    getValues(): ColorValues {
		const c = this._array;
		
		return [
			c[0], c[1], c[2], c[3]
		];
	}
    
    copy(color: ColorBase): ColorBase {
        const o = this._array;

        o[0] = color.r;
        o[1] = color.g;
        o[2] = color.b;
        o[3] = color.a;

        return this;
	}

	clone(): ColorBase {
		return new ColorBase().copy(this);
    }
    
    lerp(color: ColorBase, t: number): ColorBase {
		const o = this._array;
		const c = color._array;

		o[0] = t * (c[0] - o[0]);
		o[1] = t * (c[1] - o[1]);
		o[2] = t * (c[2] - o[2]);
		o[3] = t * (c[3] - o[3]);

		return this;
	}
    
    valuesNormalized(): ColorValues {
        return [this.r / 255, this.g / 255, this.b / 255, this.a / 255];
    }
}

const Color: ColorConstructor = ColorBase;