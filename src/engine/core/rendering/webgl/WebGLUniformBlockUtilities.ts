import { UniformsList, WebGLUniformUtilities } from "./WebGLUniformUtilities";
import { Buffer, BufferDataUsage } from "./WebGLBufferUtilities";
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
}

export type UniformBuffer = Buffer & {
    rangeOffset?: number;
    rangeSize?: number;
}

export type RangedUniformBuffer = UniformBuffer & {
    rangeOffset: number;
    rangeSize: number;
}

export type UniformBufferProperties = {
    usage: BufferDataUsage;
}

export class WebGLUniformBlockUtilities {
    
    static createUniformBlock(gl: WebGL2RenderingContext, program: Program, name: string): UniformBlock | null {
        const {internal} = program;

        const bindingPoint = this.#allocateBindingPoint(gl);
        if (bindingPoint === null) {
            console.error(`Could not bind another uniform buffer object. Max (${gl.MAX_UNIFORM_BUFFER_BINDINGS}) was reached.`);
            return null;
        }

        const blockIndex = gl.getUniformBlockIndex(internal, name);
        if (blockIndex === gl.INVALID_INDEX) {
            console.error(`Block '${name}' does not identify a valid uniform block.`);
            return null;
        }

        gl.uniformBlockBinding(internal, blockIndex, bindingPoint);

        const blockSize = gl.getActiveUniformBlockParameter(internal, blockIndex, gl.UNIFORM_BLOCK_DATA_SIZE);
        const layout: UniformBlockLayout = {};
        const blockUniformsIndices = gl.getActiveUniformBlockParameter(internal, blockIndex, gl.UNIFORM_BLOCK_ACTIVE_UNIFORM_INDICES);
        const activeUniformsOffsets = gl.getActiveUniforms(internal, blockUniformsIndices, gl.UNIFORM_OFFSET);
        activeUniformsOffsets.forEach((uniformOffset_i: number, i: number) => {
            const uniformIndex = blockUniformsIndices[i];
            const uniformInfo = gl.getActiveUniform(internal, uniformIndex);
            if (uniformInfo !== null) {
                const {name} = uniformInfo;
                layout[name] = {
                    offset: uniformOffset_i
                };
            }
        });

        return {
            name: name,
            bindingPoint: bindingPoint,
            blockSize: blockSize,
            layout: layout,
            program: program
        };
    }

    static createUniformBuffer(gl: WebGL2RenderingContext, byteLength: number, usage?: BufferDataUsage): UniformBuffer | null {
        const internal = gl.createBuffer();
        if (internal == null) {
            console.error("Could not create WebGLBuffer.");
            return null;
        }
        
        const target = gl.UNIFORM_BUFFER;
        gl.bindBuffer(target, internal);

        usage = usage ?? BufferDataUsage.DYNAMIC_DRAW;

        const data = new ArrayBuffer(byteLength);
        gl.bufferData(target, data, usage);
        
        return {
            internal: internal,
            target: target,
            usage: usage,
            data: data
        };
    }

    static createRangedUniformBuffers(gl: WebGL2RenderingContext, blocks: UniformBlock[], usage?: BufferDataUsage): {[name: string]: RangedUniformBuffer} | null {
        const offsetAlignment = gl.getParameter(gl.UNIFORM_BUFFER_OFFSET_ALIGNMENT);
        const bufferByteLength = blocks.reduce(
            (size, block) => size + Math.max(Math.ceil(block.blockSize / offsetAlignment), 1) * offsetAlignment, 0
        );
        
        const maxUniformBlockSize = gl.getParameter(gl.MAX_UNIFORM_BLOCK_SIZE);
        if (bufferByteLength > maxUniformBlockSize) {
            console.error(`Uniform block size is beyond MAX_UNIFORM_BLOCK_SIZE.`);
        }

        const buffer = this.createUniformBuffer(gl, bufferByteLength, usage);
        if (buffer == null) {
            return null;
        }

        let rangedUniformBuffers: {[name: string]: RangedUniformBuffer} = {};
        let rangeOffset = 0;
        blocks.forEach((block) => {
            const {blockSize: rangeSize, name} = block;
            rangedUniformBuffers[name] = {
                ...buffer,
                rangeOffset: rangeOffset,
                rangeSize: rangeSize
            };
            rangeOffset += Math.max(Math.ceil(rangeSize / offsetAlignment), 1) * offsetAlignment;
        });

        return rangedUniformBuffers;
    }

    static setUniformBufferValues(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer, uniforms: UniformsList): void {
        const {internal} = buffer;
        const currentUniformBuffer = gl.getParameter(gl.UNIFORM_BUFFER_BINDING);
        if (currentUniformBuffer !== internal) {
            gl.bindBuffer(gl.UNIFORM_BUFFER, internal);
        }
        
        const {layout, name} = block;
        Object.entries(uniforms).forEach(([uniformName, uniform]) => {
            const {value} = uniform;
            if (!(uniformName in layout)) {
                console.warn(`${uniformName} does not exist in block ${name}.`);
            }
            const {offset} = layout[uniformName];
            gl.bufferSubData(gl.UNIFORM_BUFFER, offset + (buffer.rangeOffset ?? 0), WebGLUniformUtilities.asArrayBufferView(value));
        });
    }

    static bindUniformBuffer(gl: WebGL2RenderingContext, block: UniformBlock, buffer: UniformBuffer): void {
        const {data, internal} = buffer;
        const {bindingPoint} = block;
        const {byteLength} = data;
        let {rangeOffset, rangeSize} = buffer;

        if (rangeOffset) {
            rangeSize = rangeSize ?? (byteLength - rangeOffset);
            gl.bindBufferRange(gl.UNIFORM_BUFFER, bindingPoint, internal, rangeOffset, rangeSize);
        }
        else {
            gl.bindBufferBase(gl.UNIFORM_BUFFER, bindingPoint, internal);
        }
    }

    static #bindingPoints: Map<WebGL2RenderingContext, boolean[]> = new Map();

    static #freeBindingPoint(gl: WebGL2RenderingContext, bindingPoint: number): number | null {
        const maxBindings = this.#bindingPoints.get(gl);
        if (typeof maxBindings !== "undefined") {
            if (maxBindings.length < 0) {
                maxBindings[bindingPoint] = false;
            }
        }
        return null;
    }

    static #allocateBindingPoint(gl: WebGL2RenderingContext): number {
        const maxBindings = gl.MAX_UNIFORM_BUFFER_BINDINGS;
        let bindingPoints = this.#bindingPoints.get(gl);
        if (typeof bindingPoints === "undefined") {
            bindingPoints = new Array(maxBindings);
            this.#bindingPoints.set(gl, bindingPoints);
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