import { Transform } from "../../../../general/Transform";
import { Camera } from "../../../scenes/cameras/Camera";
import { UniformsList } from "../../../webgl/WebGLUniformUtilities";
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
    getUniformValues(): UniformsList;
    getDeltaUniformValues(): Partial<UniformsList> | null;
}
