
import { Flags } from "../../../../../libs/patterns/flags/Flags";
import { PhongMaterial, PhongMaterialPropertyKeys } from "../../../scenes/materials/lib/PhongMaterial";
import { Uniform } from "../../../webgl/WebGLUniformUtilities";
import { UBOBase } from "../UBO";

export { PhongUBOReferences };
export { PhongUBOValues };
export { PhongUBOIndices };
export { PhongUBO };

type PhongUBOReferences = {
    material: PhongMaterial;
}

type PhongUBOValues = {
    u_shininess: Uniform,
    u_specular: Uniform,
    u_specularFactor: Uniform
}

enum PhongUBOIndices {
    shininess,
    specular,
    specularFactor
}

class PhongUBO extends UBOBase<PhongUBOReferences, PhongUBOValues> {
    
    constructor(references: PhongUBOReferences) {
        super('PhongUBO', references);
    }

    static getInstance(references: PhongUBOReferences): PhongUBO {
        return UBOBase.getConcreteInstance(PhongUBO, references);
    }
    
    subscribeReferences(): void {

        const deltaFlags = this._deltaFlags = new Flags();
        const subscriptions = this._subscriptions = new Array<(message: any) => void>(1);

        subscriptions[0] = this._references.material.changes.subscribe((message: PhongMaterialPropertyKeys) => {
            switch (message) {
                case PhongMaterialPropertyKeys.shininess:
                    return deltaFlags.set(PhongUBOIndices.shininess);
                case PhongMaterialPropertyKeys.specular:
                    return deltaFlags.set(PhongUBOIndices.specular);
                case PhongMaterialPropertyKeys.specularFactor:
                    return deltaFlags.set(PhongUBOIndices.specularFactor);
                default:
                    return;
            }
        });
    }

    unsubscribeReferences(): void {
        if (typeof this._subscriptions !== 'undefined') {
            this._references.material.changes.unsubscribe(this._subscriptions[0]);
        }
    }
    
    getUniformValues(): PhongUBOValues {
        const material = this._references.material;

        let values = {} as PhongUBOValues;
        
        if (typeof material.shininess !== 'undefined') {
            values.u_shininess = { value: material.shininess };
        }
        
        if (typeof material.specular !== 'undefined') {
            values.u_specular = { value: new Uint32Array(material.specular.array) };
        }

        if (typeof material.specularFactor !== 'undefined') {
            values.u_specularFactor = { value: material.specularFactor };
        }

        return values;
    }

    getDeltaUniformValues(): Partial<PhongUBOValues> | null {
        let hasValues = false;
        const material = this._references.material;

        let uniforms: Partial<PhongUBOValues> = {};
        
        const deltaFlags = this._deltaFlags;

        if (typeof deltaFlags !== 'undefined') {
            if (typeof material.shininess !== 'undefined') {
                if (deltaFlags.getThenUnset(PhongUBOIndices.shininess)) {
                    uniforms.u_shininess = { value: material.shininess };
                    if (!hasValues) hasValues = true;
                }
            }

            if (typeof material.specular !== 'undefined') {
                if (deltaFlags.getThenUnset(PhongUBOIndices.specular)) {
                    uniforms.u_specular = { value: new Uint32Array(material.specular.array) };
                    if (!hasValues) hasValues = true;
                }
            }

            if (typeof material.specularFactor !== 'undefined') {
                if (deltaFlags.getThenUnset(PhongUBOIndices.specularFactor)) {
                    uniforms.u_specularFactor = { value: material.specularFactor };
                    if (!hasValues) hasValues = true;
                }
            }
        }

        return (hasValues) ? uniforms : null;
    }
}