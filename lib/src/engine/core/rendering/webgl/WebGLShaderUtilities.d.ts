import { ShaderType } from "./WebGLConstants";
export { WebGLShaderUtilities };
declare class WebGLShaderUtilities {
    private constructor();
    static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): WebGLShader | null;
    static deleteShader(gl: WebGL2RenderingContext, glShader: WebGLShader): void;
}
