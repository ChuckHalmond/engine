import { Shader } from "../shaders/Shader";
import { VertexArray } from "../webgl/WebGLVertexArrayUtilities";
import { UniformsList } from "../webgl/WebGLUniformUtilities";

export type TRenderPacketSetters = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<UniformsList>;
};

export type TRenderPacketArrays = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<UniformsList>;
};

export abstract class RenderPacket<S extends Shader = any> {
    readonly shader: S;
    
    readonly vertexArray: Map<string, VertexArray>;
    readonly uniforms: Map<string, UniformsList>;

    readonly setters!: TRenderPacketSetters;
    //TODO: Setters common to all instances (for example MeshPhong)
    // but arrays/values specific per instance
    
    constructor(shader: S) {
        this.shader = shader;
        this.vertexArray = new Map<string, VertexArray>();
        this.uniforms = new Map<string, UniformsList>();
    }

    abstract prepare(...args: any): void;
    abstract update(...args: any): void;
}