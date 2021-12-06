export { WebGLProgramUtilties };
declare class WebGLProgramUtilties {
    private constructor();
    static createProgramFromSources(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram | null;
    static createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null;
    static deleteProgram(gl: WebGL2RenderingContext, glProg: WebGLProgram): void;
    static useProgram(gl: WebGL2RenderingContext, glProg: WebGLProgram): void;
}
