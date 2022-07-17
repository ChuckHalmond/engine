import { Uniform } from "engine/core/rendering/webgl/WebGLUniformUtilities";
import { Transform } from "../../../../general/Transform";
import { Camera } from "../../../scenes/cameras/Camera";
import { UBOBase } from "../UBO";
export { WorldViewUBO };
declare type WorldViewUBOReferences = {
    meshTransform: Transform;
    camera: Camera;
};
declare class WorldViewUBO extends UBOBase<WorldViewUBOReferences> implements WorldViewUBO {
    constructor(references: WorldViewUBOReferences);
    static getInstance(references: WorldViewUBOReferences): WorldViewUBO;
    subscribeReferences(): void;
    unsubscribeReferences(): void;
    getUniformValues(): Record<string, Uniform>;
    getDeltaUniformValues(): Partial<Record<string, Uniform>> | null;
}
