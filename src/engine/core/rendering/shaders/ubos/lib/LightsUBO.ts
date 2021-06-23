import { Scene } from "engine/core/general/Scene";
import { UniformsList } from "engine/core/rendering/webgl/WebGLUniformUtilities";
import { UBOBase } from "../UBO";

export { LightsUBO };

type LightsUBOReferences = {
    scene: Scene;
}

class LightsUBO extends UBOBase<LightsUBOReferences> implements LightsUBO {
    
    constructor(references: LightsUBOReferences) {
        super('LightsUBO', references);
    }
    
    public static getInstance(references: LightsUBOReferences): LightsUBO {
        return UBOBase.getConcreteInstance(LightsUBO, references);
    }

    public subscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    public unsubscribeReferences(): void {
        throw new Error("Method not implemented.");
    }

    public getUniformValues(): UniformsList {
        throw new Error("Method not implemented.");
    }

    public getDeltaUniformValues(): UniformsList | null {
        throw new Error("Method not implemented.");
    }
}