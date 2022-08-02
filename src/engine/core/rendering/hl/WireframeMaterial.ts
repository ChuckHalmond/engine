import { Color } from "../../../libs/graphics/colors/Color";

export { WireframeMaterial };

declare global {
    interface Materials {
        "wireframe": WireframeMaterial;
    }
}

interface WireframeMaterialProperties {
    color?: Color;
}

interface WireframeMaterialConstructor {
    prototype: WireframeMaterial;
    new(properties?: WireframeMaterialProperties): WireframeMaterial;
}

interface WireframeMaterial {
    color: Color;
}

class WireframeMaterialBase implements WireframeMaterial {
    color: Color;

    constructor(properties?: WireframeMaterialProperties) {
        const DEFAULT_COLOR = Color.RED;
        if (properties !== undefined) {
            this.color = properties.color ?? DEFAULT_COLOR;
        }
        this.color = DEFAULT_COLOR;
    }
}

var WireframeMaterial: WireframeMaterialConstructor = WireframeMaterialBase;