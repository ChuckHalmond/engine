export { ColorValues };
export { Color };

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
    setValues(
        r: number,
        g: number,
        b: number,
        a: number
    ): Color;
    lerp(color: Color, t: number): Color;
    normalize(): Color;
}

class ColorBase implements Color {
    [index: number]: number;
    readonly array: TypedArray;

	constructor()
	constructor(type: new(length: number) => TypedArray)
	constructor(type?: new(length: number) => TypedArray) {
		this.array = new (type || Uint8Array)(9);
    }
    
    static readonly BLACK = ColorBase.rgb(0, 0, 0);
    static readonly RED = ColorBase.rgb(255, 0, 0);
    static readonly GREEN = ColorBase.rgb(0, 255, 0);
    static readonly BLUE = ColorBase.rgb(0, 0, 255);
    static readonly WHITE = ColorBase.rgb(255, 255, 255);

    static rgb(r: number, g: number, b: number): Color {
        const color = new ColorBase()
        color.setValues(r, g, b, 255);
        return color;
    }

    static rgba(r: number, g: number, b: number, a: number): Color {
        const color = new ColorBase()
        color.setValues(r, g, b, a);
        return color;
    }

    static array(...colors: ColorBase[]): number[] {
        const a = new Array<number>(colors.length * 4);
        let c;
        let i = 0;
        for (const color of colors) {
            c = color.array;
            a[i + 0] = c[0];
            a[i + 1] = c[1];
            a[i + 2] = c[2];
            a[i + 3] = c[3];
            i += 4;
        }
        return a;
    }

    get length(): number {
        return 4;
    }

    get r(): number {
        return this.array[0];
    }

    set r(r: number) {
        this.array[0] = r;
    }

    get g(): number {
        return this.array[1];
    }

    set g(g: number) {
        this.array[1] = g;
    }

    get b(): number {
        return this.array[2];
    }

    set b(b: number) {
        this.array[2] = b;
    }

    get a(): number {
        return this.array[3];
    }

    set a(a: number) {
        this.array[3] = a;
    }

    get 0(): number {
        return this.array[0];
    }

    set 0(r: number) {
        this.array[0] = r;
    }

    get 1(): number {
        return this.array[1];
    }

    set 1(g: number) {
        this.array[1] = g;
    }

    get 2(): number {
        return this.array[2];
    }

    set 2(b: number) {
        this.array[2] = b;
    }

    get 3(): number {
        return this.array[3];
    }

    set 3(a: number) {
        this.array[3] = a;
    }

    setValues(r: number, g: number, b: number, a: number): this {
		const o = this.array;

		o[0] = r;
		o[1] = g;
		o[2] = b;
		o[3] = a;

		return this;
    }
    
    getValues(): ColorValues {
		const c = this.array;
		
		return [
			c[0], c[1], c[2], c[3]
		];
	}
    
    copy(color: Color): this {
        const o = this.array;

        o[0] = color.r;
        o[1] = color.g;
        o[2] = color.b;
        o[3] = color.a;

        return this;
	}

	clone(): this {
		return <this>(new ColorBase()).copy(this);
    }
    
    lerp(color: Color, t: number): this {
		const o = this.array;
		const c = color.array;

		o[0] = t * (c[0] - o[0]);
		o[1] = t * (c[1] - o[1]);
		o[2] = t * (c[2] - o[2]);
		o[3] = t * (c[3] - o[3]);

		return this;
	}
    
	normalize(): this {
		const {array} = this;
		const length = 255;
        array[0] /= length;
        array[1] /= length;
        array[2] /= length;
		return this;
	}

    [Symbol.iterator] (): Iterator<number> {
		const {array} = this;
		const {length} = array;
		let i = 0;
		return {
			next() {
				if (i < length) {
					return {
						value: array[i++], done: false
					};
				}
				return {
					value: undefined, done: true
				}
			}
		}
	}
}

const Color: ColorConstructor = ColorBase;