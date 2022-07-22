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
    type: ShaderType;
    source: string;
};
export declare type ProgramProperties = {
    vertexSource: string;
    vertexFlags?: string[];
    fragmentSource: string;
    fragmentFlags?: string[];
};
export declare class WebGLProgramUtilities {
    static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): Shader | null;
    static createProgram(gl: WebGL2RenderingContext, properties: ProgramProperties): Program | null;
    static recompileProgram(gl: WebGL2RenderingContext, program: Program, properties: Partial<ProgramProperties>): Program;
    static deleteProgram(gl: WebGL2RenderingContext, program: Program): void;
    static useProgram(gl: WebGL2RenderingContext, program: Program): void;
}
