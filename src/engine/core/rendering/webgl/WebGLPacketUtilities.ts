import { VertexArray, VertexArrayValues, VertexArrayProperties, WebGLVertexArrayUtilities } from "./WebGLVertexArrayUtilities"
import { Texture, TextureProperties, WebGLTextureUtilities } from "./WebGLTextureUtilities"
import { UniformBlock, UniformBlockProperties, UniformBuffer, UniformBufferProperties, WebGLUniformBlockUtilities } from "./WebGLUniformBlockUtilities"
import { Uniform, UniformsListSetter, WebGLUniformUtilities } from "./WebGLUniformUtilities"
import { Program } from "./WebGLProgramUtilities"

export type PacketProperties = {
    program: Program;
    vertexArray: VertexArrayProperties;
    uniformBuffers?: (UniformBufferProperties | UniformBuffer)[];
    uniformBlocks?: Record<string, UniformBlockProperties>;
    uniforms?: Record<string, Uniform>;
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
            uniformBlocks
        };
    }

    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void {
        const {vertexArray: vertexArrayValues, uniforms: uniformsValues, uniformBlocks: uniformsBlocksValues} = values;
        const {vertexArray, uniforms, uniformBlocks} = packet;

        if (vertexArrayValues && vertexArray) {
            WebGLVertexArrayUtilities.setVertexArrayValues(gl, vertexArray, vertexArrayValues);
        }
        if (uniforms && uniformsValues) {
            WebGLUniformUtilities.setUniformsListValues(gl, uniforms, uniformsValues);
        }
        if (uniformBlocks && uniformsBlocksValues) {
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

    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void {
        const {vertexArray} = packet;
        if (vertexArray) {
            WebGLVertexArrayUtilities.drawVertexArray(gl, vertexArray);
        }
        //@TODO: getError ?
    }
}