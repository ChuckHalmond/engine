export { ColorValues };
export { Color };

type ColorValues = [number, number, number];

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
    array(...colors: Color[]): number[];
    lerp(a: Color, b: Color, t: number): Color;
}

interface Color extends ArrayLike<number>, Iterable<number> {
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
    setValues(
        r: number,
        g: number,
        b: number
    ): Color;
    lerp(color: Color, t: number): Color;
    normalize(): Color;
}

class ColorBase implements Color {
    [index: number]: number;
    readonly array: Float32Array;

	constructor()
    constructor(r: number, g: number, b: number)
    constructor(r?: number, g?: number, b?: number) {
		this.array = new Float32Array([
            r ?? 0, g ?? 0, b ?? 0
        ]);
    }
    
    static readonly BLACK = new ColorBase(0, 0, 0);
    static readonly RED = new ColorBase(1, 0, 0);
    static readonly GREEN = new ColorBase(0, 1, 0);
    static readonly BLUE = new ColorBase(0, 0, 1);
    static readonly WHITE = new ColorBase(1, 1, 1);

    static array(...colors: Color[]): number[] {
        const a = new Array<number>(colors.length * 4);
        let c;
        let i = 0;
        for (const color of colors) {
            c = color.array;
            a[i + 0] = c[0];
            a[i + 1] = c[1];
            a[i + 2] = c[2];
            i += 3;
        }
        return a;
    }

    get length(): number {
        return 3;
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

    setValues(r: number, g: number, b: number): this {
		const {array} = this;

		array[0] = r;
		array[1] = g;
		array[2] = b;

		return this;
    }
    
    getValues(): ColorValues {
		const {array} = this;
		
		return [
			array[0], array[1], array[2]
		];
	}
    
    copy(color: Color): this {
        const {array} = this;
        const {r, g, b} = color;

        array[0] = r;
        array[1] = g;
        array[2] = b;

        return this;
	}

	clone(): this {
		return <this>(new ColorBase()).copy(this);
    }

    static lerp(a: Color, b: Color, t: number): Color {
		return a.lerp(b, t);
	}
    
    lerp(color: Color, t: number): this {
        const {array} = this;
        const {r, g, b} = color;

		array[0] = t * (r - array[0]);
		array[1] = t * (g - array[1]);
		array[2] = t * (b - array[2]);

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