import { Color } from "../../../libs/graphics/colors/Color";
import { Mesh } from "../hl/Mesh";
import { WireframeMaterial } from "../hl/WireframeMaterial";
import { GeometryBuffer } from "../scenes/geometries/GeometryBuffer";
import { AttributeDataType } from "../webgl/WebGLVertexArrayUtilities";

export { GridHelper };

interface GridHelperConstructor {
    prototype: GridHelper;
    new(properties?: {
        size?: number, divisions?: number, color1?: Color, color2?: Color
    }): GridHelper; 
}

interface GridHelper extends Mesh {
    readonly size: number;
    readonly divisions: number;
    readonly color1: Color;
    readonly color2: Color;
}

class GridHelperBase extends Mesh implements GridHelper {
    readonly size: number;
    readonly divisions: number;
    readonly color1: Color;
    readonly color2: Color;

    constructor(properties?: {
        size?: number, divisions?: number, color1?: Color, color2?: Color
    }) {
        properties = properties ?? {};
        let {size, divisions, color1, color2} = properties;

		color1 = color1 ? color1 : Color.rgba(Color.RED);
		color2 = color2 ? color2 : Color.rgba(Color.GREEN);

        divisions = divisions ?? 10;
        size = size ?? 10;

		const center = divisions / 2;
		const step = size / divisions;
		const halfSize = size / 2;

		const vertices = [];
        const colors: number[] = [];

		for (let i = 0, k = -halfSize; i <= divisions; i++, k += step) {
			vertices.push(-halfSize, 0, k, halfSize, 0, k);
			vertices.push(k, 0, -halfSize, k, 0, halfSize);
			const color = i % 4 == 0 || i === center ? color1 : color2;
            colors.push(...[...color, ...color, ...color, ...color]);
		}  

		const geometry = new GeometryBuffer({
            "a_position": {
                array: new Float32Array(vertices),
                type: AttributeDataType.VEC3
            },
            "a_color": {
                array: new Float32Array(colors),
                type: AttributeDataType.VEC4
            }
        });

		const material = new WireframeMaterial();
        super({geometry, material});

        this.color1 = color1;
        this.color2 = color2;
        this.divisions = divisions;
        this.size = size;
    }
}

var GridHelper: GridHelperConstructor = GridHelperBase;