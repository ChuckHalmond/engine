import { PhongGeometry } from "../../../scenes/geometries/PhongGeometry";
import { Attribute, AttributeProperties } from "../../../webgl/WebGLAttributeUtilities";
import { VAOBase } from "../VAO";
export { PhongVAOReferences };
export { PhongVAOAttributesList };
export { PhongVAOValues };
export { PhongVAO };
declare type PhongVAOReferences = {
    geometry: PhongGeometry;
};
declare type PhongVAOValues = {
    list: PhongVAOAttributesList;
    indices: Uint8Array | Uint16Array | Uint32Array;
};
declare type PhongVAOAttributesList = {
    a_position: Attribute;
    a_normal: Attribute;
    a_tangent: Attribute;
    a_bitangent: Attribute;
    a_uv: Attribute;
};
declare type BufferAttributesInfo = [keyof PhongVAOAttributesList, ArrayLike<number>, AttributeProperties];
declare class PhongVAO extends VAOBase<PhongVAOReferences, PhongVAOValues> implements PhongVAO {
    readonly buffersAttributes: BufferAttributesInfo[];
    constructor(references: PhongVAOReferences);
    static getInstance(references: PhongVAOReferences): PhongVAO;
    getAttributeValues(): PhongVAOValues;
    enableDeltaSubscriptions(): void;
    disableDeltaSubscriptions(): void;
    getDeltaAttributeValues(): RecursivePartial<PhongVAOValues> | null;
}
