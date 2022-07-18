import { Uniform, WebGLUniformUtilities } from "./WebGLUniformUtilities";
import { Buffer, BufferDataUsage } from "./WebGLBufferUtilities";
import { Program } from "./WebGLProgramUtilities";

export type UniformBlock = {
    name: string;
    blockIndex: number;
    program: Program;
    layout: UniformBlockLayout;
    blockSize: number;
    bindingPoint: number;
}

export type UniformBlockLayout = Record<string, {
    offset: number;
}>;

export type UniformBlockBuffer = Buffer & {
    rangeOffset?: number;
    rangeSize?: number;
}

export type RangedUniformBlockBuffer = UniformBlockBuffer & {
    rangeOffset: number;
    rangeSize: number;
}

export type UniformBufferProperties = {
    usage: BufferDataUsage;
}


//

export type UniformBlocks = {
    buffers: UniformBlockBuffer[];
    blocks: Record<string, UniformBlock>;
}

export type UniformBlocksProperties = {
    buffers: (UniformBlockBuffer | UniformBufferProperties)[];
    blocks: Record<string, {
        buffer: number;
        uniforms: Record<string, Uniform>;
    }>;
}

//

export class WebGLUniformBlockUtilities {

    static #bindingPoints: Map<string, number> = new Map();

    static getBindingPointsEntries(): IterableIterator<[string, number]> {
        const bindingPoints = this.#bindingPoints;
        return bindingPoints.entries();
    }

    static createUniformBlock(gl: WebGL2RenderingContext, program: Program, name: string): UniformBlock | null {
        const {internalProgram} = program;

        const bindingPoints = this.#bindingPoints;
        let bindingPoint = bindingPoints.get(name);
        if (bindingPoint == undefined) {
            bindingPoint = Math.max(-1, ...bindingPoints.values()) + 1;
            bindingPoints.set(name, bindingPoint);
        }

        const blockIndex = gl.getUniformBlockIndex(internalProgram, name);
        if (blockIndex === gl.INVALID_INDEX) {
            console.error(`Block '${name}' does not identify a valid uniform block.`);
            return null;
        }

        gl.uniformBlockBinding(internalProgram, blockIndex, bindingPoint);

        const blockSize = gl.getActiveUniformBlockParameter(internalProgram, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
        const layout: UniformBlockLayout = {};
        const blockUniformsIndices = gl.getActiveUniformBlockParameter(internalProgram, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
        const activeUniformsOffsets = gl.getActiveUniforms(internalProgram, blockUniformsIndices, gl.UNIFORM_OFFSET);
        activeUniformsOffsets.forEach((uniformOffset_i: number, i: number) => {
            const uniformIndex = blockUniformsIndices[i];
            const uniformInfo = gl.getActiveUniform(internalProgram, uniformIndex);
            if (uniformInfo !== null) {
                const {name} = uniformInfo;
                layout[name] = {
                    offset: uniformOffset_i
                };
            }
        });

        return {
            name,
            blockIndex,
            bindingPoint,
            blockSize,
            layout,
            program
        };
    }

    static createUniformBuffer(gl: WebGL2RenderingContext, byteLength: number, usage?: BufferDataUsage): UniformBlockBuffer | null {
        const internalBuffer = gl.createBuffer();
        if (internalBuffer === null) {
            return null;
        }
        
        const target = gl.UNIFORM_BUFFER;
        gl.bindBuffer(target, internalBuffer);

        const DEFAULT_USAGE = BufferDataUsage.STATIC_READ;
        usage = usage ?? DEFAULT_USAGE;

        gl.bufferData(target, byteLength, usage);
        
        return {
            internalBuffer,
            target,
            usage
        };
    }

    static createRangedUniformBuffers(gl: WebGL2RenderingContext, blocks: UniformBlock[], usage?: BufferDataUsage): Record<string, RangedUniformBlockBuffer> | null {

        const offsetAlignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
        const bufferByteLength = blocks.reduce(
            (size, block) => size + Math.max(Math.ceil(block.blockSize / offsetAlignment), 1) * offsetAlignment, 0
        );
        
        const maxUniformBlockSize = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
        if (bufferByteLength > maxUniformBlockSize) {
            console.error(`Uniform block size is beyond MAX_UNIFORM_BLOCK_SIZE.`);
        }

        const buffer = this.createUniformBuffer(gl, bufferByteLength, usage);
        if (buffer === null) {
            return null;
        }

        let rangedUniformBuffers: Record<string, RangedUniformBlockBuffer> = {};
        let rangeOffset = 0;
        blocks.forEach((block) => {
            const {blockSize: rangeSize, name} = block;
            rangedUniformBuffers[name] = {
                ...buffer,
                rangeOffset,
                rangeSize
            };
            rangeOffset += Math.max(Math.ceil(rangeSize / offsetAlignment), 1) * offsetAlignment;
        });

        return rangedUniformBuffers;
    }

    static setUniformBufferValues(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBlockBuffer, uniforms: Record<string, Uniform>): void {
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
            const {offset} = layout[uniformName];
            gl.bufferSubData(target, offset + (rangeOffset ?? 0), WebGLUniformUtilities.asArrayBufferView(value));
        });
    }

    static setUniformBufferData(gl: WebGL2RenderingContext, buffer: UniformBlockBuffer, data: ArrayBufferView, dstByteOffset?: number, srcOffset?: number, length?: number): void {
        const {internalBuffer, target} = buffer;
        gl.bindBuffer(target, internalBuffer);
        dstByteOffset = dstByteOffset ?? 0;
        srcOffset = srcOffset ?? 0;
        gl.bufferSubData(target, dstByteOffset, data, srcOffset, length);
    }

    static bindUniformBuffer(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBlockBuffer): void {
        const {internalBuffer, target} = buffer;
        const {bindingPoint} = block;
        let {rangeOffset, rangeSize} = buffer;

        if (rangeOffset !== undefined && rangeSize !== undefined) {
            gl.bindBufferRange(target, bindingPoint, internalBuffer, rangeOffset, rangeSize);
        }
        else {
            gl.bindBufferBase(target, bindingPoint, internalBuffer);
        }
    }
}