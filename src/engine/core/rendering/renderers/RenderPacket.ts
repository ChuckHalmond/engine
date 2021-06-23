import { Shader } from "../shaders/Shader";
import { Attribute, AttributesList, AttributesSettersList } from "../webgl/WebGLAttributeUtilities";
import { Uniform, UniformsList, UniformsSettersList } from "../webgl/WebGLUniformUtilities";

export type TRenderPacketSetters = {
    attributes: Array<AttributesSettersList>;
    uniforms: Array<UniformsSettersList>;
};

export type TRenderPacketArrays = {
    attributes: Array<AttributesList>;
    uniforms: Array<UniformsList>;
};

export abstract class RenderPacket<S extends Shader = any> {
    public readonly shader: S;
    
    public readonly attributes: Map<string, AttributesList>;
    public readonly uniforms: Map<string, UniformsList>;

    public readonly setters!: TRenderPacketSetters;
    //TODO: Setters common to all instances (for example MeshPhong)
    // but arrays/values specific per instance
    
    constructor(shader: S) {
        this.shader = shader;
        this.attributes = new Map<string, AttributesList>();
        this.uniforms = new Map<string, UniformsList>();
    }

    public abstract prepare(...args: any): void;
    public abstract update(...args: any): void;
}