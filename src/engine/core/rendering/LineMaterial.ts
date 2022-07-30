import { Color } from "../../libs/graphics/colors/Color";

export { LineMaterial };

interface LineMaterialProperties {
    color?: Color;
}

interface LineMaterialConstructor {
    prototype: LineMaterial;
    new(properties?: LineMaterialProperties): LineMaterial;
}

interface LineMaterial {
    color: Color;
}

class LineMaterialBase implements LineMaterial {
    color: Color;

    constructor(properties?: LineMaterialProperties) {
        const DEFAULT_COLOR = Color.RED;
        if (properties !== undefined) {
            this.color = properties.color ?? DEFAULT_COLOR;
        }
        this.color = DEFAULT_COLOR;
    }
}

var LineMaterial: LineMaterialConstructor = LineMaterialBase;