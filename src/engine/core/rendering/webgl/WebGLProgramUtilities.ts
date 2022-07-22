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
    type: ShaderType;
    source: string;
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
                type,
                internalShader,
                source
            };
        }

        const shaderInfoLog = gl.getShaderInfoLog(internalShader);
        if (shaderInfoLog !== null) {
            console.warn(shaderInfoLog);
        }

        gl.deleteShader(internalShader);
        return null;
    }
    
    static createProgram(gl: WebGL2RenderingContext, properties: ProgramProperties): Program | null {
        const {vertexSource, fragmentSource} = properties;

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

        const program: Program = {
            internalProgram,
            vertexShader,
            fragmentShader
        };
        
        gl.attachShader(internalProgram, vertexShader.internalShader);
        gl.attachShader(internalProgram, fragmentShader.internalShader);
        gl.linkProgram(internalProgram);

        const success = gl.getProgramParameter(internalProgram, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        const programInfoLog = gl.getProgramInfoLog(internalProgram);
        if (programInfoLog !== null) {
            const vertexInfoLog = gl.getShaderInfoLog(vertexShader.internalShader);
            const fragmentInfoLog = gl.getShaderInfoLog(fragmentShader.internalShader);
            console.warn(programInfoLog);
            console.warn(vertexInfoLog);
            console.warn(fragmentInfoLog);
        }
        this.deleteProgram(gl, program);

        return null;
    }

    static recompileProgram(gl: WebGL2RenderingContext, program: Program, properties: Partial<ProgramProperties>) {
        const {internalProgram, vertexShader, fragmentShader} = program;
        let {vertexSource, fragmentSource} = properties;
        if (typeof vertexSource === "string") {
            const {internalShader} = vertexShader;
            gl.shaderSource(internalShader, vertexSource);
            gl.compileShader(internalShader);
            vertexShader.source = vertexSource;
        }
        if (typeof fragmentSource === "string") {
            const {internalShader} = fragmentShader;
            gl.shaderSource(internalShader, fragmentSource);
            gl.compileShader(internalShader);
            fragmentShader.source = fragmentSource;
        }
        gl.linkProgram(internalProgram);

        const success = gl.getProgramParameter(internalProgram, gl.LINK_STATUS);
        if (success) {
            return program;
        }

        const programInfoLog = gl.getProgramInfoLog(internalProgram);
        if (programInfoLog !== null) {
            const vertexInfoLog = gl.getShaderInfoLog(vertexShader.internalShader);
            const fragmentInfoLog = gl.getShaderInfoLog(fragmentShader.internalShader);
            console.warn(programInfoLog);
            console.warn(vertexInfoLog);
            console.warn(fragmentInfoLog);
        }
        return program;
    }
    
    static deleteProgram(gl: WebGL2RenderingContext, program: Program) {
        const {vertexShader, fragmentShader, internalProgram} = program;
        gl.deleteShader(vertexShader.internalShader);
        gl.deleteShader(fragmentShader.internalShader);
        gl.deleteProgram(internalProgram);
    }

    static useProgram(gl: WebGL2RenderingContext, program: Program) {
        const {internalProgram} = program;
        const currentProgram = gl.getParameter(gl.CURRENT_PROGRAM);
        if (currentProgram !== internalProgram) {
            gl.useProgram(internalProgram);
        }
    }
}