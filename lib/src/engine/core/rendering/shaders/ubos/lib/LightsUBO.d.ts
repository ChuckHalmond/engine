import { Uniform } from "engine/core/rendering/webgl/WebGLUniformUtilities";
import { UBOBase } from "../UBO";
export { LightsUBO };
declare type LightsUBOReferences = {};
declare class LightsUBO extends UBOBase<LightsUBOReferences> implements LightsUBO {
    constructor(references: LightsUBOReferences);
    static getInstance(references: LightsUBOReferences): LightsUBO;
    subscribeReferences(): void;
    unsubscribeReferences(): void;
    getUniformValues(): Record<string, Uniform>;
    getDeltaUniformValues(): Record<string, Uniform> | null;
}
