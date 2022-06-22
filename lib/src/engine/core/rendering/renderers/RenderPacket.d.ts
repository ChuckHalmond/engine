import { Shader } from "../shaders/Shader";
import { VertexArray } from "../webgl/WebGLVertexArrayUtilities";
import { UniformsList } from "../webgl/WebGLUniformUtilities";
export declare type TRenderPacketSetters = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<UniformsList>;
};
export declare type TRenderPacketArrays = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<UniformsList>;
};
export declare abstract class RenderPacket<S extends Shader = any> {
    readonly shader: S;
    readonly vertexArray: Map<string, VertexArray>;
    readonly uniforms: Map<string, UniformsList>;
    readonly setters: TRenderPacketSetters;
    constructor(shader: S);
    abstract prepare(...args: any): void;
    abstract update(...args: any): void;
}
