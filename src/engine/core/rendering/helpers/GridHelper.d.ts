import { Color } from "../../../libs/graphics/colors/Color";
import { Mesh } from "../hl/Mesh";
export { GridHelper };
interface GridHelperConstructor {
    prototype: GridHelper;
    new (properties?: {
        size?: number;
        divisions?: number;
        color1?: Color;
        color2?: Color;
    }): GridHelper;
}
interface GridHelper extends Mesh {
    readonly size: number;
    readonly divisions: number;
    readonly color1: Color;
    readonly color2: Color;
}
declare var GridHelper: GridHelperConstructor;
