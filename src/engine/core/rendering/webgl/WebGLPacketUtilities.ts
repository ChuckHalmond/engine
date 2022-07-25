import { VertexArray, VertexArrayValues, VertexArrayProperties, WebGLVertexArrayUtilities, DrawMode } from "./WebGLVertexArrayUtilities"
import { Texture, TextureProperties, WebGLTextureUtilities } from "./WebGLTextureUtilities"
import { UniformBlock, UniformBlockProperties, UniformBuffer, UniformBufferProperties, WebGLUniformBlockUtilities } from "./WebGLUniformBlockUtilities"
import { Uniform, UniformsListSetter, WebGLUniformUtilities } from "./WebGLUniformUtilities"
import { Program, WebGLProgramUtilities } from "./WebGLProgramUtilities"

export type PacketProperties = {
    program: Program;
    vertexArray: VertexArrayProperties;
    uniformBuffers?: (UniformBufferProperties | UniformBuffer)[];
    uniformBlocks?: Record<string, UniformBlockProperties>;
    uniforms?: Record<string, Uniform>;
    drawCommand: {
        mode: DrawMode;
        elementsCount?: number;
        instanceCount?: number;
        multiDraw?: {
            firstsList?: Iterable<number> | Int32Array;
            firstsOffset?: number;
            countsList?: Iterable<number> | Int32Array;
            countsOffset?: number;
            offsetsList?: Iterable<number> | Int32Array;
            offsetsOffset?: number;
            instanceCountsList?: Iterable<number> | Int32Array;
            instanceCountsOffset?: number;
            drawCount?: number;
        }
    }
}

export type PacketValues = {
    vertexArray?: VertexArrayValues;
    uniforms?: Record<string, Uniform>;
    uniformBlocks?: Record<string, {
        uniforms: Record<string, Uniform>;
    }>;
}

export type Packet = {
    program: Program;
    vertexArray: VertexArray;
    uniforms?: UniformsListSetter;
    uniformBlocks?: Record<string, UniformBlock>;
    drawCommand: PacketDrawCommand;
}

export interface PacketDrawCommand {
    mode: DrawMode;
    elementsCount?: number;
    instanceCount?: number;
    multiDraw?: {
        firstsList?: Iterable<number> | Int32Array;
        firstsOffset?: number;
        countsList?: Iterable<number> | Int32Array;
        countsOffset?: number;
        offsetsList?: Iterable<number> | Int32Array;
        offsetsOffset?: number;
        instanceCountsList?: Iterable<number> | Int32Array;
        instanceCountsOffset?: number;
        drawCount?: number;
    };
}

export class WebGLPacketUtilities {

    static createTextures(gl: WebGL2RenderingContext, textures: Record<string, TextureProperties>): Record<string, Texture> {
        const _textures: {
            [key: string]: Texture
        } = {};
        Object.entries(textures).forEach(([name, properties]) => {
            const texture = WebGLTextureUtilities.createTexture(gl, name, properties);
            if (texture !== null) {
                _textures[name] = texture;
            }
        });
        return _textures;
    }
    
    static createPacket(gl: WebGL2RenderingContext, packet: PacketProperties): Packet | null {
        const {program, vertexArray: vertexArrayProperties, uniforms: uniformsProperties, uniformBlocks: uniformBlocksProperties, uniformBuffers: uniformBuffersProperties} = packet;
        const {drawCommand} = packet;

        let vertexArray: VertexArray | null = null;
        vertexArray = WebGLVertexArrayUtilities.createVertexArray(gl, program, vertexArrayProperties);
        if (vertexArray === null) {
            return null;
        }
      
        let uniforms: UniformsListSetter | null | undefined = undefined;
        if (uniformsProperties !== undefined) {
            uniforms = WebGLUniformUtilities.getUniformsListSetter(gl, program, uniformsProperties);
            if (uniforms === null) {
                return null;
            }
            WebGLUniformUtilities.setUniformsListValues(gl, uniforms, uniformsProperties);
        }

        let uniformBlocks: Record<string, UniformBlock> = {};
        const uniformBlocksPropertiesEntries = uniformBlocksProperties ? Object.entries(uniformBlocksProperties) : [];
        const uniformBuffersMaxIndex = (uniformBuffersProperties?.length ?? 0) - 1;
        uniformBlocksPropertiesEntries.forEach(([_, uniformBlockProperty]) => {
            const {buffer} = uniformBlockProperty;
            if (buffer !== undefined && buffer > uniformBuffersMaxIndex) {
                console.error(`Uniform buffer with index ${buffer} does not exist.`);
            }
        });
        if (uniformBuffersProperties) {
            uniformBuffersProperties.forEach(
                (uniformBuffersProperty_i, i) => {
                    const relatedBlockProperties = uniformBlocksPropertiesEntries.filter(
                        ([_, uniformBlockProperty]) => uniformBlockProperty.buffer === i
                    );
                    const relatedBlocks = <UniformBlock[]>relatedBlockProperties.map(
                        ([blockName, _]) => WebGLUniformBlockUtilities.createUniformBlock(gl, program, blockName)
                    );
                    const {length: relatedBlocksCount} = relatedBlocks;
                    
                    if ("internalBuffer" in uniformBuffersProperty_i) {
                        relatedBlocks.forEach((block_i) => {
                            const {name} = block_i!;
                            WebGLUniformBlockUtilities.bindUniformBuffer(gl, block_i!, uniformBuffersProperty_i);
                            uniformBlocks[name] = block_i!;
                        });
                    }
                    else {
                        if (relatedBlocksCount > 0) {
                            const {usage} = uniformBuffersProperty_i;
                            if (relatedBlocksCount > 1) {
                                const rangedBuffers = WebGLUniformBlockUtilities.createRangedUniformBuffers(gl, <UniformBlock[]>relatedBlocks, true, usage)!;
                                relatedBlocks.forEach((block_i, i) => {
                                    const {name} = block_i!;
                                    const rangedBuffer = rangedBuffers[i];
                                    WebGLUniformBlockUtilities.bindUniformBuffer(gl, block_i!, rangedBuffer);
                                    const {uniforms} = relatedBlockProperties[i][1];
                                    if (uniforms) {
                                        WebGLUniformBlockUtilities.setUniformBufferValues(gl, block_i, rangedBuffer, uniforms);
                                    }
                                    uniformBlocks[name] = block_i!;
                                });
                            }
                            else {
                                const relatedBlock = relatedBlocks[0];
                                const {blockSize, name} = relatedBlock;
                                const buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, blockSize, true, usage);
                                if (buffer === null) {
                                    return null;
                                }
                                WebGLUniformBlockUtilities.bindUniformBuffer(gl, relatedBlock!, buffer!);
                                const {uniforms} = relatedBlockProperties[0][1];
                                if (uniforms) {
                                    WebGLUniformBlockUtilities.setUniformBufferValues(gl, relatedBlock, buffer, uniforms);
                                }
                                uniformBlocks[name] = relatedBlock!;
                            }
                        }
                    }
                }
            );
        }
        const remainingBlockProperties = uniformBlocksPropertiesEntries.filter(
            ([_, uniformBlockProperty]) => uniformBlockProperty.buffer === undefined
        );
        remainingBlockProperties.forEach(([blockName, uniformBlockProperties]) => {
            const {uniforms} = uniformBlockProperties;
            const block = WebGLUniformBlockUtilities.createUniformBlock(gl, program, blockName);
            if (block === null) {
                return null;
            }
            const {blockSize} = block;
            const buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, blockSize, true);
            if (buffer === null) {
                return null;
            }
            WebGLUniformBlockUtilities.bindUniformBuffer(gl, block, buffer);
            if (uniforms !== undefined) {
                WebGLUniformBlockUtilities.setUniformBufferValues(gl, block, buffer, uniforms);
            }
            uniformBlocks[blockName] = block;
        });

        return {
            program,
            vertexArray,
            uniforms,
            uniformBlocks,
            drawCommand
        };
    }

    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void {
        const {vertexArray: vertexArrayValues, uniforms: uniformsValues, uniformBlocks: uniformsBlocksValues} = values;
        const {vertexArray, uniforms, uniformBlocks} = packet;

        if (vertexArrayValues !== undefined) {
            WebGLVertexArrayUtilities.setVertexArrayValues(gl, vertexArray, vertexArrayValues);
        }
        if (uniforms !== undefined && uniformsValues !== undefined) {
            WebGLUniformUtilities.setUniformsListValues(gl, uniforms, uniformsValues);
        }
        if (uniformBlocks !== undefined && uniformsBlocksValues !== undefined) {
            const uniformBlocksValuesEntries = uniformsBlocksValues ? Object.entries(uniformsBlocksValues) : [];
            uniformBlocksValuesEntries.forEach(([blockName, uniformBlock]) => {
                const {uniforms} = uniformBlock;
                const block = uniformBlocks[blockName];
                const {buffer} = block;
                if (buffer) {
                    WebGLUniformBlockUtilities.setUniformBufferValues(gl, block, buffer, uniforms);
                }
            });
        }
    }

    static #multiDrawExtension: WEBGL_multi_draw | null = null;

    static enableMultidrawExtension(gl: WebGL2RenderingContext) {
        this.#multiDrawExtension = gl.getExtension("WEBGL_multi_draw");
    }

    static drawPacket(gl: WebGL2RenderingContext, packet: Packet, drawCommand: PacketDrawCommand = packet.drawCommand): void {
        const {vertexArray} = packet;
        const {program, internalVertexArray, elementBuffer} = vertexArray;
        const {mode, elementsCount, instanceCount, multiDraw} = drawCommand;

        WebGLProgramUtilities.useProgram(gl, program);
        
        const currentVertexArray = gl.getParameter(gl.VERTEX_ARRAY_BINDING);
        if (currentVertexArray !== internalVertexArray) {
            gl.bindVertexArray(internalVertexArray);
        }
        
        if (elementBuffer) {
            const {indexType} = elementBuffer;
            if (instanceCount !== undefined && elementsCount !== undefined) {
                gl.drawElementsInstanced(mode, elementsCount, indexType, 0, instanceCount);
            }
            else if (multiDraw) {
                const multiDrawExtension = this.#multiDrawExtension!;
                const {countsList, countsOffset, offsetsList, offsetsOffset, drawCount, instanceCountsList, instanceCountsOffset} = multiDraw;
                if (instanceCountsList !== undefined && instanceCountsOffset !== undefined) {
                    multiDrawExtension.multiDrawElementsInstancedWEBGL(
                        mode, countsList!, countsOffset!, indexType!,
                        offsetsList!, offsetsOffset!, instanceCountsList, instanceCountsOffset, drawCount!
                    );
                }
                else {
                    multiDrawExtension.multiDrawElementsWEBGL(
                        mode, countsList!, countsOffset!, indexType!,
                        offsetsList!, offsetsOffset!, drawCount!
                    );
                }
            }
            else if (elementsCount !== undefined) {
                gl.drawElements(mode, elementsCount, indexType, 0);
            }
        }
        else {
            if (instanceCount !== undefined && elementsCount !== undefined) {
                gl.drawArraysInstanced(mode, 0, elementsCount, instanceCount);
            }
            else if (multiDraw) {
                const multiDrawExtension = this.#multiDrawExtension!;
                const {countsList, countsOffset, firstsList, firstsOffset, drawCount, instanceCountsList, instanceCountsOffset} = multiDraw;
                if (instanceCountsList !== undefined && instanceCountsOffset !== undefined) {
                    multiDrawExtension.multiDrawArraysInstancedWEBGL(
                        mode, countsList!, countsOffset!,
                        firstsList!, firstsOffset!, instanceCountsList, instanceCountsOffset, drawCount!
                    );
                }
                else {
                    multiDrawExtension.multiDrawArraysWEBGL(
                        mode, countsList!, countsOffset!,
                        firstsList!, firstsOffset!, drawCount!
                    );
                }
            }
            else if (elementsCount !== undefined) {
                gl.drawArrays(mode, 0, elementsCount);
            }
        }
    }
}