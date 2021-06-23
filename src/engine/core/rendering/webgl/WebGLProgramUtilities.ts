import { ShaderType } from "./WebGLConstants";
import { WebGLShaderUtilities } from "./WebGLShaderUtilities";

export { WebGLProgramUtilties };

class WebGLProgramUtilties {

    private constructor() {}

    public static createProgramFromSources(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): WebGLProgram | null {
        const vertexShader = WebGLShaderUtilities.createShader(gl, ShaderType.VERTEX_SHADER, vertexSource);
        if (vertexShader == null) {
            return null;
        }

        const fragmentShader = WebGLShaderUtilities.createShader(gl, ShaderType.FRAGMENT_SHADER, fragmentSource);
        if (fragmentShader == null) {
            return null;
        }
        
        return this.createProgram(gl, vertexShader, fragmentShader);
    }

    public static createProgram(gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram | null {
        const glProg = gl.createProgram();

        if (glProg == null) {
            return null;
        }

        gl.attachShader(glProg, vertexShader);
        gl.attachShader(glProg, fragmentShader);
        gl.linkProgram(glProg);

        const success = gl.getProgramParameter(glProg, gl.LINK_STATUS);
        if (success) {
            return glProg;
        }

        const programInfoLog = gl.getProgramInfoLog(glProg);
        if (programInfoLog !== null) {
            console.warn(programInfoLog);
        }
        
        gl.deleteProgram(glProg);
        return null;
    }
    
    public static deleteProgram(gl: WebGL2RenderingContext, glProg: WebGLProgram) {
        gl.deleteProgram(glProg);
    }

    public static useProgram(gl: WebGL2RenderingContext, glProg: WebGLProgram) {
        gl.useProgram(glProg);
    }
}