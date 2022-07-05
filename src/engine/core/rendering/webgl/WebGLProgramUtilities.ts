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
    vertexFlags?: string[];
    fragmentSource: string;
    fragmentFlags?: string[];
}

export class WebGLProgramUtilities {

    static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): Shader | null {
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

    static deleteShader(gl: WebGL2RenderingContext, shader: Shader): void {
        const {internal} = shader;
        if (gl.isShader(internal)) {
            gl.deleteShader(internal);
        }
    }
    
    static createProgram(gl: WebGL2RenderingContext, properties: ProgramProperties): Program | null {
        const {vertexSource, fragmentSource} = properties;

        //@TODO: bindAttribLocation ?
        //@TODO: definitions ?

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
    
    static deleteProgram(gl: WebGL2RenderingContext, program: Program) {
        const {vertexShader, fragmentShader, internal} = program;
        if (gl.isShader(vertexShader)) {
            gl.deleteShader(vertexShader);
        }
        if (gl.isShader(fragmentShader)) {
            gl.deleteShader(fragmentShader);
        }
        if (gl.isProgram(internal)) {
            gl.deleteProgram(internal);
        }
    }

    static useProgram(gl: WebGL2RenderingContext, program: Program) {
        const {internal} = program;
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        if (currentProgram !== internal) {
            gl.useProgram(internal);
        }
    }
}