import { Shader } from "../shaders/Shader";
import { Uniform } from "../webgl/WebGLUniformUtilities";
import { VertexArray } from "../webgl/WebGLVertexArrayUtilities";
export declare type TRenderPacketSetters = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<Record<string, Uniform>>;
};
export declare type TRenderPacketArrays = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<Record<string, Uniform>>;
};
export declare abstract class RenderPacket<S extends Shader = any> {
    readonly shader: S;
    readonly vertexArray: Map<string, VertexArray>;
    readonly uniforms: Map<string, Record<string, Uniform>>;
    readonly setters: TRenderPacketSetters;
    constructor(shader: S);
    abstract prepare(...args: any): void;
    abstract update(...args: any): void;
}
