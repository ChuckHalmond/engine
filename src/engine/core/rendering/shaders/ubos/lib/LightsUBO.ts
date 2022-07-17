import { Uniform } from "engine/core/rendering/webgl/WebGLUniformUtilities";
import { UBOBase } from "../UBO";

export { LightsUBO };

type LightsUBOReferences = {
    //scene: Scene;
}

class LightsUBO extends UBOBase<LightsUBOReferences> implements LightsUBO {
    
    constructor(references: LightsUBOReferences) {
        super('LightsUBO', references);
    }
    
    static getInstance(references: LightsUBOReferences): LightsUBO {
        return UBOBase.getConcreteInstance(LightsUBO, references);
    }

    subscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    unsubscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    getUniformValues(): Record<string, Uniform> {
        throw new Error("Method not implemented.");
    }

    getDeltaUniformValues(): Record<string, Uniform> | null {
        throw new Error("Method not implemented.");
    }
}