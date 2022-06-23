export declare enum ShaderType {
    FRAGMENT_SHADER = 35632,
    VERTEX_SHADER = 35633
}
export declare type Program = {
    internal: WebGLProgram;
    vertexShader: Shader;
    fragmentShader: Shader;
};
export declare type Shader = {
    internal: WebGLShader;
};
export declare type ProgramProperties = {
    vertexSource: string;
    fragmentSource: string;
};
export declare class WebGLProgramUtilities {
    static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): Shader | null;
    static deleteShader(gl: WebGL2RenderingContext, shader: Shader): void;
    static createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): Program | null;
    static deleteProgram(gl: WebGL2RenderingContext, program: Program): void;
    static useProgram(gl: WebGL2RenderingContext, program: Program): void;
}
