import { UniformsList } from "../../../webgl/WebGLUniformUtilities";
import { UBOBase } from "../UBO";
export { LightsUBO };
declare type LightsUBOReferences = {};
declare class LightsUBO extends UBOBase<LightsUBOReferences> implements LightsUBO {
    constructor(references: LightsUBOReferences);
    static getInstance(references: LightsUBOReferences): LightsUBO;
    subscribeReferences(): void;
    unsubscribeReferences(): void;
    getUniformValues(): UniformsList;
    getDeltaUniformValues(): UniformsList | null;
}
