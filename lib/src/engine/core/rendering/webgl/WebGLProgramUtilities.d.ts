export declare enum ShaderType {
    FRAGMENT_SHADER = 35632,
    VERTEX_SHADER = 35633
}
export declare type Program = {
    internalProgram: WebGLProgram;
    vertexShader: Shader;
    fragmentShader: Shader;
};
export declare type Shader = {
    internalShader: WebGLShader;
};
export declare type ProgramProperties = {
    vertexSource: string;
    vertexFlags?: string[];
    fragmentSource: string;
    fragmentFlags?: string[];
};
export declare class WebGLProgramUtilities {
    static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): Shader | null;
    static deleteShader(gl: WebGL2RenderingContext, shader: Shader): void;
    static createProgram(gl: WebGL2RenderingContext, properties: ProgramProperties): Program | null;
    static deleteProgram(gl: WebGL2RenderingContext, program: Program): void;
    static useProgram(gl: WebGL2RenderingContext, program: Program): void;
}
