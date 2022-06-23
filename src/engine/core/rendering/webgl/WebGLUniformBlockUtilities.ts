import { UniformsList, WebGLUniformUtilities } from "./WebGLUniformUtilities";
import { BufferProperties, Buffer, BufferDataUsage } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";

export type UniformBlock = {
    name: string;
    program: Program;
    layout: UniformBlockLayout;
    blockSize: number;
    bindingPoint: number;
}

export type UniformBlockLayout = {
    [name: string]: {
        offset: number;
    }
};

export type UniformBuffer = Buffer & {
    rangeOffset?: number;
    rangeSize?: number;
}

export type UniformBufferProperties = Omit<BufferProperties, "target"> & {
    rangeOffset?: number;
    rangeSize?: number;
}

export type UniformBlocksBindingsContext = {
    maxBindingPoints: number;
    registeredBindingPoints: Array<boolean>;
}

export class WebGLUniformBlockUtilities {
    
    static createUniformBuffer(gl: WebGL2RenderingContext, program: Program, blockName: string, usage?: BufferDataUsage, byteLength?: number, rangeOffset?: number, rangeSize?: number): UniformBuffer | null {
        const buffer = gl.createBuffer();
        if (buffer == null) {
            console.error("Could not create WebGLBuffer.");
            return null;
        }
        
        const target = gl.UNIFORM_BUFFER;
        gl.bindBuffer(target, buffer);

        const blockIndex = gl.getUniformBlockIndex(program.internal, blockName);
        if (blockIndex === gl.INVALID_INDEX) {
            console.error(`Block '${blockName}' does not identify a valid uniform block.`);
            return null;
        }

        const blockSize = gl.getActiveUniformBlockParameter(program.internal, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE) as number;
        byteLength = Math.min(byteLength ?? 0, 0) || blockSize;

        usage = usage ?? gl.DYNAMIC_DRAW;
        rangeOffset = rangeOffset ?? 0;
        rangeSize = rangeSize ?? blockSize - rangeOffset;

        gl.bufferData(target, byteLength, usage);

        return {
            internal: buffer,
            target: target,
            usage: usage,
            byteLength: byteLength,
            rangeOffset: rangeOffset,
            rangeSize: rangeSize
        };
    }

    static setUniformBufferValues(gl: WebGL2RenderingContext, layout: UniformBlockLayout, buffer: UniformBuffer, uniforms: UniformsList): void {
        const currentUniformBuffer = gl.getParameter(gl.UNIFORM_BUFFER_BINDING);
        if (currentUniformBuffer !== buffer.internal) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, buffer.internal);
        }
        
        Object.keys(uniforms).forEach((uniformName) => {
            const uniformLayout = layout[uniformName];
            const newValue = WebGLUniformUtilities.getUniformValueArrayBufferView(uniforms[uniformName].value);
            gl.bufferSubData(gl.UNIFORM_BUFFER, uniformLayout.offset, newValue);
        });
    }

    static bindUniformBuffer(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer): void {
        const rangeOffset = buffer.rangeOffset || 0;
        const rangeSize = buffer.rangeSize || (buffer.byteLength - (rangeOffset || 0));
        
        if (typeof buffer.rangeOffset !== "undefined" || typeof buffer.rangeSize !== "undefined") {
            gl.bindBufferRange(gl.UNIFORM_BUFFER, block.bindingPoint, buffer.internal, rangeOffset, rangeSize);
        }
        else {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, block.bindingPoint, buffer.internal);
        }
    }

    static createUniformBlock(gl: WebGL2RenderingContext, program: Program, name: string): UniformBlock | null {
        const bindingPoint = this._allocateBindingPoint(gl);
        if (bindingPoint === null) {
            console.error(`Could not bind another uniform buffer object. Max (${gl.MAX_UNIFORM_BUFFER_BINDINGS}) was reached.`);
            return null;
        }

        const blockIndex = gl.getUniformBlockIndex(program.internal, name);
        if (blockIndex === gl.INVALID_INDEX) {
            console.error(`Block '${name}' does not identify a valid uniform block.`);
            return null;
        }

        gl.uniformBlockBinding(program.internal, blockIndex, bindingPoint);

        const blockSize = gl.getActiveUniformBlockParameter(program.internal, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);

        const layout: UniformBlockLayout = {};
        const blockUniformsIndices = gl.getActiveUniformBlockParameter(program.internal, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
        gl.getActiveUniforms(program.internal, blockUniformsIndices, gl.UNIFORM_OFFSET).forEach(
            (uniformOffset: number, idx: number) => {
                const uniformIndex = blockUniformsIndices[idx];
                const uniformInfo = gl.getActiveUniform(program.internal, uniformIndex);

                if (uniformInfo !== null) {
                    const uniformFullName = uniformInfo.name;
                    const bracketIndex = uniformFullName.indexOf("[");
                    if (bracketIndex > -1) {
                        const uniformName = uniformFullName.substring(0, bracketIndex);
                        if (typeof layout[uniformName] === "undefined") {
                            layout[uniformName] = {
                                offset: uniformOffset
                            };
                        }
                    }
                    else {
                        layout[uniformFullName] = {
                            offset: uniformOffset
                        };
                    }
                }
            }
        );

        return {
            name: name,
            bindingPoint: bindingPoint,
            blockSize: blockSize,
            layout: layout,
            program: program
        };
    }

    private static _bindingPoints: Map<WebGL2RenderingContext, boolean[]> = new Map();

    private static _freeBindingPoint(gl: WebGL2RenderingContext, bindingPoint: number): number | null {
        const maxBindings = this._bindingPoints.get(gl);
        if (typeof maxBindings !== "undefined") {
            if (maxBindings.length < 0) {
                maxBindings[bindingPoint] = false;
            }
        }
        return null;
    }

    private static _allocateBindingPoint(gl: WebGL2RenderingContext): number {
        const maxBindings = gl.MAX_UNIFORM_BUFFER_BINDINGS;
        let bindingPoints = this._bindingPoints.get(gl);
        if (typeof bindingPoints === "undefined") {
            bindingPoints = new Array(maxBindings);
            this._bindingPoints.set(gl, bindingPoints);
        }
        for (let i = 1; i < maxBindings; i++) {
            if (!bindingPoints[i]) {
                bindingPoints[i] = true;
                return i;
            }
        }
        return -1;
    }
}