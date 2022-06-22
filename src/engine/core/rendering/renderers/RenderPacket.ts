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
    public readonly shader: S;
    
    public readonly vertexArray: Map<string, VertexArray>;
    public readonly uniforms: Map<string, UniformsList>;

    public readonly setters!: TRenderPacketSetters;
    //TODO: Setters common to all instances (for example MeshPhong)
    // but arrays/values specific per instance
    
    constructor(shader: S) {
        this.shader = shader;
        this.vertexArray = new Map<string, VertexArray>();
        this.uniforms = new Map<string, UniformsList>();
    }

    public abstract prepare(...args: any): void;
    public abstract update(...args: any): void;
}