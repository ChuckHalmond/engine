import { Shader } from "../shaders/Shader";
import { Uniform } from "../webgl/WebGLUniformUtilities";
import { VertexArray } from "../webgl/WebGLVertexArrayUtilities";

export type TRenderPacketSetters = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<Record<string, Uniform>>;
};

export type TRenderPacketArrays = {
    vertexArray: Array<VertexArray>;
    uniforms: Array<Record<string, Uniform>>;
};

export abstract class RenderPacket<S extends Shader = any> {
    readonly shader: S;
    
    readonly vertexArray: Map<string, VertexArray>;
    readonly uniforms: Map<string, Record<string, Uniform>>;

    readonly setters!: TRenderPacketSetters;
    //TODO: Setters common to all instances (for example MeshPhong)
    // but arrays/values specific per instance
    
    constructor(shader: S) {
        this.shader = shader;
        this.vertexArray = new Map<string, VertexArray>();
        this.uniforms = new Map<string, Record<string, Uniform>>();
    }

    abstract prepare(...args: any): void;
    abstract update(...args: any): void;
}