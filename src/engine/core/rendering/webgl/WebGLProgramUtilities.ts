export enum ShaderType {
    FRAGMENT_SHADER = 0x8B30,
    VERTEX_SHADER = 0x8B31,
}

export type Program = {
    internal: WebGLProgram;
    vertexShader: Shader;
    fragmentShader: Shader;
}

export type Shader = {
    internal: WebGLShader;
}

export type ProgramProperties = {
    vertexSource: string;
    fragmentSource: string;
}

export class WebGLProgramUtilities {

    private constructor() {}

    public static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): Shader | null {
        const shader = gl.createShader(type);
        
        if (shader == null) {
            console.error(`Could not create WebGLShader.`);
            return null;
        }

        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) {
            return {
                internal: shader
            };
        }

        const shaderInfoLog = gl.getShaderInfoLog(shader);
        if (shaderInfoLog !== null) {
            console.warn(shaderInfoLog);
        }

        gl.deleteShader(shader);
        return null;
    }

    public static deleteShader(gl: WebGL2RenderingContext, shader: Shader): void {
        if (gl.isShader(shader.internal)) {
            gl.deleteShader(shader.internal);
        }
    }
    
    public static createProgram(gl: WebGL2RenderingContext, vertexSource: string, fragmentSource: string): Program | null {

        const vertexShader = this.createShader(gl, ShaderType.VERTEX_SHADER, vertexSource);
        if (vertexShader == null) {
            return null;
        }

        const fragmentShader = this.createShader(gl, ShaderType.FRAGMENT_SHADER, fragmentSource);
        if (fragmentShader == null) {
            return null;
        }
        
        const program = gl.createProgram();

        if (program == null) {
            console.error("Could not create WebGLProgram.");
            return null;
        }

        gl.attachShader(program, vertexShader.internal);
        gl.attachShader(program, fragmentShader.internal);
        gl.linkProgram(program);

        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
            return {
                internal: program,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader
            };
        }

        const programInfoLog = gl.getProgramInfoLog(program);
        const vsInfoLog = gl.getProgramInfoLog(program);
        const fsInfoLog = gl.getProgramInfoLog(program);
        if (programInfoLog !== null) {
            console.warn(`Program info: ${programInfoLog}`);
            console.warn(`VS info: ${vsInfoLog}`);
            console.warn(`FS info: ${fsInfoLog}`);
        }
        
        gl.deleteProgram(program);

        return null;
    }
    
    public static deleteProgram(gl: WebGL2RenderingContext, program: Program) {
        if (gl.isShader(program.vertexShader)) {
            gl.deleteShader(program.vertexShader);
        }
        if (gl.isShader(program.fragmentShader)) {
            gl.deleteShader(program.fragmentShader);
        }
        if (gl.isProgram(program.internal)) {
            gl.deleteProgram(program.internal);
        }
    }

    public static useProgram(gl: WebGL2RenderingContext, program: Program) {
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        if (currentProgram !== program.internal) {
            gl.useProgram(program.internal);
        }
    }
}