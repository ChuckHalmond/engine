import { Uniform, WebGLUniformUtilities } from "./WebGLUniformUtilities";
import { Buffer, BufferDataUsage } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";

export type UniformBlock = {
    name: string;
    blockIndex: number;
    program: Program;
    layout: Record<string, {
        byteOffset: number;
    }>;
    blockSize: number;
    bindingPoint?: number;
    buffer?: UniformBuffer;
}

export type UniformBlockProperties = {
    buffer?: number;
    uniforms?: Record<string, Uniform>;
}

export type UniformBuffer = Buffer & {
    bindingPoint?: number;
    rangeOffset?: number;
    rangeSize?: number;
}

export type UniformBufferProperties = {
    usage: BufferDataUsage;
    data?: ArrayBuffer;
}

export type UniformBlocksProperties = {
    buffers: (UniformBuffer | UniformBufferProperties)[];
    blocks: Record<string, {
        buffer: number;
        uniforms: Record<string, Uniform>;
    }>;
}

export class WebGLUniformBlockUtilities {

    static #bindingPoints: Map<string, number> = new Map();

    static getBindingPointsEntries(): IterableIterator<[string, number]> {
        const bindingPoints = this.#bindingPoints;
        return bindingPoints.entries();
    }

    static createUniformBlock(gl: WebGL2RenderingContext, program: Program, name: string): UniformBlock | null {
        const {internalProgram} = program;

        const blockIndex = gl.getUniformBlockIndex(internalProgram, name);
        if (blockIndex === gl.INVALID_INDEX) {
            console.error(`Block '${name}' does not identify a valid uniform block.`);
            return null;
        }

        const blockSize = gl.getActiveUniformBlockParameter(internalProgram, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
        const layout: UniformBlock["layout"] = {};
        const blockUniformsIndices = gl.getActiveUniformBlockParameter(internalProgram, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
        const activeUniformsOffsets = gl.getActiveUniforms(internalProgram, blockUniformsIndices, gl.UNIFORM_OFFSET);
        activeUniformsOffsets.forEach((uniformOffset_i: number, i: number) => {
            const uniformIndex = blockUniformsIndices[i];
            const uniformInfo = gl.getActiveUniform(internalProgram, uniformIndex);
            if (uniformInfo !== null) {
                const {name} = uniformInfo;
                layout[name] = {
                    byteOffset: uniformOffset_i
                };
            }
        });

        return {
            name,
            blockIndex,
            blockSize,
            layout,
            program
        };
    }

    static createUniformBuffer(gl: WebGL2RenderingContext, byteLength: number, bind?: boolean, usage?: BufferDataUsage): UniformBuffer | null {
        const internalBuffer = gl.createBuffer();
        if (internalBuffer === null) {
            return null;
        }
        
        const target = gl.UNIFORM_BUFFER;
        gl.bindBuffer(target, internalBuffer);

        usage = usage ?? BufferDataUsage.STATIC_READ;
        bind = bind ?? false;

        const bindingPoint = bind ? this.lastBindingPoint++ : undefined;
        
        gl.bufferData(target, byteLength, usage);
        
        return {
            internalBuffer,
            byteLength,
            bindingPoint,
            target,
            usage
        };
    }

    static createRangedUniformBuffers(gl: WebGL2RenderingContext, blocks: UniformBlock[], bind?: boolean, usage?: BufferDataUsage): UniformBuffer[] | null {

        const offsetAlignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
        const bufferByteLength = blocks.reduce(
            (size, block) => size + Math.max(Math.ceil(block.blockSize / offsetAlignment), 1) * offsetAlignment, 0
        );
        
        const buffer = this.createUniformBuffer(gl, bufferByteLength, false, usage);
        if (buffer === null) {
            return null;
        }
        
        bind = bind ?? false;

        let rangeOffset = 0;
        const rangedUniformBuffers = blocks.map((block) => {
            const {blockSize: rangeSize} = block;
            const bindingPoint = bind ? this.lastBindingPoint++ : undefined;
            const rangedUniformBuffer = {
                ...buffer,
                bindingPoint,
                rangeOffset,
                rangeSize
            };
            rangeOffset += Math.max(Math.ceil(rangeSize / offsetAlignment), 1) * offsetAlignment;
            return rangedUniformBuffer;
        });

        return rangedUniformBuffers;
    }

    static setUniformBufferValues(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer, uniforms: Record<string, Uniform>): void {
        const {internalBuffer, target} = buffer;
        const currentUniformBuffer = gl.getParameter(gl.UNIFORM_BUFFER_BINDING);
        if (currentUniformBuffer !== internalBuffer) {
            gl.bindBuffer(target, internalBuffer);
        }
        
        const {layout, name} = block;
        const {rangeOffset} = buffer;
        Object.entries(uniforms).forEach(([uniformName, uniform]) => {
            const {value} = uniform;
            if (!(uniformName in layout)) {
                console.warn(`${uniformName} does not exist in block ${name}.`);
            }
            const {byteOffset} = layout[uniformName];
            gl.bufferSubData(target, byteOffset + (rangeOffset ?? 0), WebGLUniformUtilities.asArrayBufferView(value));
        });
    }

    static setUniformBufferData(gl: WebGL2RenderingContext, buffer: UniformBuffer, data: ArrayBuffer | ArrayBufferView, dstByteOffset?: number, srcOffset?: number, length?: number): void {
        const {internalBuffer, target} = buffer;
        let {rangeOffset} = buffer;
        gl.bindBuffer(target, internalBuffer);
        const byteOffset = (rangeOffset ?? 0) + (dstByteOffset ?? 0);
        if (data instanceof ArrayBuffer) {
            gl.bufferSubData(target, byteOffset, data);
        }
        else {
            srcOffset = srcOffset ?? 0;
            gl.bufferSubData(target, byteOffset, data, srcOffset, length);
        }
    }

    static lastBindingPoint = 0;

    static bindUniformBuffer(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer): void {
        const {internalBuffer, target} = buffer;
        let {rangeOffset, rangeSize} = buffer;
        const {bindingPoint} = buffer;
        const {program, blockIndex} = block;
        const {internalProgram} = program;

        if (bindingPoint !== undefined) {
            block.buffer = buffer;
            gl.uniformBlockBinding(internalProgram, blockIndex, bindingPoint);
            
            if (bindingPoint !== undefined) {
                if (rangeOffset !== undefined && rangeSize !== undefined) {
                    gl.bindBufferRange(target, bindingPoint, internalBuffer, rangeOffset, rangeSize);
                }
                else {
                    gl.bindBufferBase(target, bindingPoint, internalBuffer);
                }
            }
        }
    }
}