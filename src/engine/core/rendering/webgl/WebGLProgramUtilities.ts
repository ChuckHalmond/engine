export enum ShaderType {
    FRAGMENT_SHADER = 0x8B30,
    VERTEX_SHADER = 0x8B31,
}

export type Program = {
    internalProgram: WebGLProgram;
    vertexShader: Shader;
    fragmentShader: Shader;
}

export type Shader = {
    internalShader: WebGLShader;
}

export type ProgramProperties = {
    vertexSource: string;
    vertexFlags?: string[];
    fragmentSource: string;
    fragmentFlags?: string[];
}

export class WebGLProgramUtilities {

    static createShader(gl: WebGL2RenderingContext, type: ShaderType, source: string): Shader | null {
        const internalShader = gl.createShader(type);
        if (internalShader === null) {
            return null;
        }
        gl.shaderSource(internalShader, source);
        gl.compileShader(internalShader);
        
        const success = gl.getShaderParameter(internalShader, gl.COMPILE_STATUS);
        if (success) {
            return {
                internalShader
            };
        }

        const shaderInfoLog = gl.getShaderInfoLog(internalShader);
        if (shaderInfoLog !== null) {
            console.warn(shaderInfoLog);
        }

        gl.deleteShader(internalShader);
        return null;
    }

    static deleteShader(gl: WebGL2RenderingContext, shader: Shader): void {
        const {internalShader} = shader;
        if (gl.isShader(internalShader)) {
            gl.deleteShader(internalShader);
        }
    }
    
    static createProgram(gl: WebGL2RenderingContext, properties: ProgramProperties): Program | null {
        const {vertexSource, fragmentSource} = properties;

        //@TODO: bindAttribLocation ?
        //@TODO: definitions ?

        const vertexShader = this.createShader(gl, ShaderType.VERTEX_SHADER, vertexSource);
        if (vertexShader === null) {
            return null;
        }

        const fragmentShader = this.createShader(gl, ShaderType.FRAGMENT_SHADER, fragmentSource);
        if (fragmentShader === null) {
            return null;
        }
        
        const internalProgram = gl.createProgram();

        if (internalProgram === null) {
            return null;
        }
        
        gl.attachShader(internalProgram, vertexShader.internalShader);
        gl.attachShader(internalProgram, fragmentShader.internalShader);
        gl.linkProgram(internalProgram);

        const success = gl.getProgramParameter(internalProgram, gl.LINK_STATUS);
        if (success) {
            return {
                internalProgram,
                vertexShader,
                fragmentShader
            };
        }

        const programInfoLog = gl.getProgramInfoLog(internalProgram);
        const vsInfoLog = gl.getProgramInfoLog(internalProgram);
        const fsInfoLog = gl.getProgramInfoLog(internalProgram);
        if (programInfoLog !== null) {
            console.warn(`Program info: ${programInfoLog}`);
            console.warn(`VS info: ${vsInfoLog}`);
            console.warn(`FS info: ${fsInfoLog}`);
        }
        
        gl.deleteProgram(internalProgram);

        return null;
    }
    
    static deleteProgram(gl: WebGL2RenderingContext, program: Program) {
        const {vertexShader, fragmentShader, internalProgram} = program;
        if (gl.isShader(vertexShader)) {
            gl.deleteShader(vertexShader);
        }
        if (gl.isShader(fragmentShader)) {
            gl.deleteShader(fragmentShader);
        }
        if (gl.isProgram(internalProgram)) {
            gl.deleteProgram(internalProgram);
        }
    }

    static useProgram(gl: WebGL2RenderingContext, program: Program) {
        const {internalProgram} = program;
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        if (currentProgram !== internalProgram) {
            gl.useProgram(internalProgram);
        }
    }
}