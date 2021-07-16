import { GeometryPropertyKeys } from "engine/core/rendering/scenes/geometries/Geometry";
import { PhongGeometry } from "engine/core/rendering/scenes/geometries/PhongGeometry";
import { VAOBase } from "engine/core/rendering/shaders/vaos/VAO";
import { Attribute, AttributeProperties } from "engine/core/rendering/webgl/WebGLAttributeUtilities";
import { ArraySections, ArraySectionValues } from "engine/libs/structures/arrays/ArraySection";

export { PhongVAOReferences };
export { PhongVAOAttributesList };
export { PhongVAOValues };
export { PhongVAO };

type PhongVAOReferences = {
    geometry: PhongGeometry,
}

type PhongVAOValues = {
    list: PhongVAOAttributesList,
    indices: Uint8Array | Uint16Array | Uint32Array,
}

type PartialPhongVAOValues = {
    list: RecursivePartial<PhongVAOAttributesList>,
    indices?: Uint8Array | Uint16Array | Uint32Array,
}

type PhongVAOAttributesList = {
    a_position: Attribute,
    a_normal: Attribute,
    a_tangent: Attribute,
    a_bitangent: Attribute,
    a_uv: Attribute,
}

enum PhongVAOBufferSections {
    a_position,
    a_normal,
    a_tangent,
    a_bitangent,
    a_uv
}

type BufferAttributesInfo = [keyof PhongVAOAttributesList, ArrayLike<number>, AttributeProperties];

class PhongVAO extends VAOBase<PhongVAOReferences, PhongVAOValues> implements PhongVAO {
    
    public readonly buffersAttributes: BufferAttributesInfo[];
    
    constructor(references: PhongVAOReferences) {
        super('PhongVAO', references);
        
        const geometry = this._references.geometry;

        this.buffersAttributes = [
            ['a_position', geometry.vertices.array, { numComponents: 3 }],
            ['a_normal', geometry.verticesNormals.array, { numComponents: 3 }],
            ['a_tangent', geometry.tangents.array, { numComponents: 3 }],
            ['a_bitangent', geometry.bitangents.array, { numComponents: 3 }],
            ['a_uv', geometry.uvs.array, { numComponents: 3 }]
        ];
    }

    public static getInstance(references: PhongVAOReferences): PhongVAO {
        return VAOBase.getConcreteInstance(PhongVAO, references);
    }
    
    public getAttributeValues(): PhongVAOValues {
        const geometry = this._references.geometry;
        
        this._values = {
            list: 
                this.buffersAttributes.reduce((result, item) => {
                return {
                  ...result,
                  [item[0]]: { array: item[1], props: item[2] },
                }
            }, {} as PhongVAOAttributesList),
            indices: new Uint8Array(geometry.indices.buffer),
        };
        
        return this._values;
    }

    public enableDeltaSubscriptions(): void {

        const geometry = this._references.geometry;
        const subscriptions = this._deltaSubscriptions = new Array<(message: any) => void>(1);
        const sections = this._deltaSections = new ArraySections(
            6, Math.max(...this.buffersAttributes.map(([_, buffer, ___]: BufferAttributesInfo) => { return buffer.length; }))
        );
        
        subscriptions[0] = geometry.changes.subscribe((message: {prop: GeometryPropertyKeys, section: ArraySectionValues})  => {
            switch (message.prop) {
                case GeometryPropertyKeys.vertices:
                    sections.extend(GeometryPropertyKeys.vertices, message.section);
                case GeometryPropertyKeys.uvs:
                    sections.extend(GeometryPropertyKeys.uvs, message.section);
            }
        });
    }

    public disableDeltaSubscriptions(): void {
        const geometry = this._references.geometry;
        if (typeof this._deltaSubscriptions !== 'undefined') {
            geometry.changes.unsubscribe(this._deltaSubscriptions[0]);
        }
    }
    
    public getDeltaAttributeValues(): RecursivePartial<PhongVAOValues> | null {

        let hasValues: boolean = false;
        let deltaValues: PartialPhongVAOValues = {
            list: {}
        };

        const sections = this._deltaSections;
        if (typeof sections !== 'undefined') {
            if (!sections.isEmpty(PhongVAOBufferSections.a_position)) {
                const section = sections.getThenSetEmpty(PhongVAOBufferSections.a_position);
                
                deltaValues.list.a_position = {
                    array: this._values.list.a_position.array,
                    props: {
                        numComponents: 3,
                        srcOffset: section[0],
                        srcLength: section[1] - section[0]
                    }
                };
                
                if (!hasValues) hasValues = true;
            }
        }

        return (hasValues) ? deltaValues : null;
    }
}