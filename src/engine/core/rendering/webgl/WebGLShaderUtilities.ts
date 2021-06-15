import { ShaderType } from "./WebGLConstants";

export { WebGLShaderUtilities };

class WebGLShaderUtilities {

    private constructor() {}

    public static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): WebGLShader | null {
        const glShader = gl.createShader(type as number);
        
        if (glShader == null) {
            return null;
        }

        gl.shaderSource(glShader, source);
        gl.compileShader(glShader);
        
        const success = gl.getShaderParameter(glShader, gl.COMPILE_STATUS);
        if (success) {
            return glShader;
        }

        const shaderInfoLog = gl.getShaderInfoLog(glShader);
        if (shaderInfoLog !== null) {
            console.warn(shaderInfoLog);
        }

        gl.deleteShader(glShader);
        return null;
    }

    public static deleteShader(gl: WebGL2RenderingContext, glShader: WebGLShader): void {
        gl.deleteShader(glShader);
    }
}