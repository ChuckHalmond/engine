import { PhongMaterial } from "../../../scenes/materials/lib/PhongMaterial";
import { Uniform } from "../../../webgl/WebGLUniformUtilities";
import { UBOBase } from "../UBO";
export { PhongUBOReferences };
export { PhongUBOValues };
export { PhongUBOIndices };
export { PhongUBO };
declare type PhongUBOReferences = {
    material: PhongMaterial;
};
declare type PhongUBOValues = {
    u_shininess: Uniform;
    u_specular: Uniform;
    u_specularFactor: Uniform;
};
declare enum PhongUBOIndices {
    shininess = 0,
    specular = 1,
    specularFactor = 2
}
declare class PhongUBO extends UBOBase<PhongUBOReferences, PhongUBOValues> {
    constructor(references: PhongUBOReferences);
    static getInstance(references: PhongUBOReferences): PhongUBO;
    subscribeReferences(): void;
    unsubscribeReferences(): void;
    getUniformValues(): PhongUBOValues;
    getDeltaUniformValues(): Partial<PhongUBOValues> | null;
}
