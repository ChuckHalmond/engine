import { Shader } from "../shaders/Shader";
import { AttributesList, AttributesSettersList } from "../webgl/WebGLAttributeUtilities";
import { UniformsList, UniformsSettersList } from "../webgl/WebGLUniformUtilities";
export declare type TRenderPacketSetters = {
    attributes: Array<AttributesSettersList>;
    uniforms: Array<UniformsSettersList>;
};
export declare type TRenderPacketArrays = {
    attributes: Array<AttributesList>;
    uniforms: Array<UniformsList>;
};
export declare abstract class RenderPacket<S extends Shader = any> {
    readonly shader: S;
    readonly attributes: Map<string, AttributesList>;
    readonly uniforms: Map<string, UniformsList>;
    readonly setters: TRenderPacketSetters;
    constructor(shader: S);
    abstract prepare(...args: any): void;
    abstract update(...args: any): void;
}
