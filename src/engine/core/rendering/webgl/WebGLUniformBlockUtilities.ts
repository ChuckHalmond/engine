import { WebGLBufferUtilities } from "./WebGLBufferUtilities";
import { UniformsList, WebGLUniformUtilities } from "./WebGLUniformUtilities";
import { BufferDataUsage, BufferTarget } from "./WebGLConstants";

export { UniformBlockProperties };
export { UniformBlockReference };
export { UniformBlockBinding };
export { UniformBlock };
export { UniformBlockSetter };
export { UniformBlocksBindingsContext };
export { WebGLUniformBlockUtilities };

type UniformBlockProperties = {
    name: string;
    usage?: BufferDataUsage;
}

type UniformBlockReference = {
    glBuffer: WebGLBuffer;
}

type UniformBlockBinding = {
    bindingPoint: number;
}

type UniformBlock = UniformBlockProperties & UniformBlockReference & UniformBlockBinding;

type UniformBlockSetter = UniformBlock & {
    index: number;
    uniforms: {
        [name: string]: {
            offset: number;
        }
    };
    bufferByteLength: number;
    glProg: WebGLProgram;
}

type UniformBlocksBindingsContext = {
    maxBindingPoints: number;
    registeredBindingPoints: Array<boolean>;
}

class WebGLUniformBlockUtilities {


    private constructor() {}

    public static createBindingsContext(gl: WebGL2RenderingContext): UniformBlocksBindingsContext {
        const maxBindingPoints = gl.MAX_UNIFORM_BUFFER_BINDINGS;
        const registeredBindingPoints = new Array<boolean>(maxBindingPoints);
        
        return {
            maxBindingPoints: maxBindingPoints,
            registeredBindingPoints: registeredBindingPoints
        }
    }

    public static createUniformBlock(gl: WebGL2RenderingContext, ctx: UniformBlocksBindingsContext, name: string): UniformBlock | null {
        
        const glBuffer = WebGLBufferUtilities.createBuffer(gl);
        if (glBuffer === null) {
            return null;
        }

        const bindingPoint = this._allocateBindingPoint(ctx);
        if (bindingPoint === null) {
            console.error(`Could not allocate another binding point.`);
            return null;
        }
        
        return {
            name: name,
            bindingPoint: bindingPoint,
            glBuffer: glBuffer,
        }
    }

    public static getUniformBlockSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, block: UniformBlock): UniformBlockSetter | null {
        gl.bindBuffer(BufferTarget.UNIFORM_BUFFER, block.glBuffer);
        
        const blockIndex = gl.getUniformBlockIndex(glProg, block.name);
        if (blockIndex === gl.INVALID_INDEX) {
            console.error(`Block '${block.name}' does not identify a valid uniform block.`);
            return null;
        }

        const usage = (typeof block.usage === 'undefined') ? gl.DYNAMIC_DRAW : block.usage;
        
        const bindingPoint = block.bindingPoint;
        gl.uniformBlockBinding(glProg, blockIndex, bindingPoint);

        const blockSize = gl.getActiveUniformBlockParameter(glProg, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
        gl.bufferData(gl.UNIFORM_BUFFER, blockSize, usage);

        const uniforms: {
            [name: string]: {
                offset: number
            }
        } = {};

        const blockUniformsIndices = gl.getActiveUniformBlockParameter(glProg, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
        gl.getActiveUniforms(glProg, blockUniformsIndices, gl.UNIFORM_OFFSET).forEach(
            (uniformOffset: number, idx: number) => {
                const uniformIndex = blockUniformsIndices[idx];
                const uniformInfo = gl.getActiveUniform(glProg, uniformIndex);

                if (uniformInfo !== null) {
                    const uniformName = uniformInfo.name;
                    uniforms[uniformName] = {
                        offset: uniformOffset
                    };
                }
            }
        );
        
        return {
            name: block.name,
            usage: usage,
            bindingPoint: bindingPoint,
            index: blockIndex,
            uniforms: uniforms,
            bufferByteLength: blockSize,
            glBuffer: block.glBuffer,
            glProg: glProg
        }
    }

    public static setUniformBlockValues(gl: WebGL2RenderingContext, setter: UniformBlockSetter, uniforms: UniformsList): void {
        
        const blockUniformsNames = Object.keys(setter.uniforms);
        const matchingUniformsNames = Object.keys(uniforms).filter(
            (name: string) => {
                return blockUniformsNames.includes(name);
            }
        );

        gl.bindBuffer(gl.UNIFORM_BUFFER, setter.glBuffer);
        gl.bindBufferRange(gl.UNIFORM_BUFFER, setter.bindingPoint, setter.glBuffer, 0, setter.bufferByteLength);
        
        for (const uniformName of matchingUniformsNames) {
            const uniform = setter.uniforms[uniformName];
            const newUniformValue = WebGLUniformUtilities.getUniformValueArrayBufferView(uniforms[uniformName].value);

            gl.bufferSubData(gl.UNIFORM_BUFFER, uniform.offset, newUniformValue);
        }
    }

    public static bindUniformBlock(gl: WebGL2RenderingContext, setter: UniformBlockSetter): void {
        gl.bindBufferBase(BufferTarget.UNIFORM_BUFFER, setter.bindingPoint, setter.glBuffer);
    }
    
    private static _allocateBindingPoint(ctx: UniformBlocksBindingsContext): number | null {
        for (let unit = 0; unit < ctx.maxBindingPoints; unit++) {
            if (!ctx.registeredBindingPoints[unit]) {
                ctx.registeredBindingPoints[unit] = true;
                return unit;
            }
        }
        return null;
    }

    private static _freeBindingPoint(ctx: UniformBlocksBindingsContext, bindingPoint: number): void {
        ctx.registeredBindingPoints[bindingPoint] = false;
    }
}