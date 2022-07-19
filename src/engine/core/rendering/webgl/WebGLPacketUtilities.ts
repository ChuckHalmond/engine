import { VertexArray, VertexArrayValues, VertexArrayProperties, WebGLVertexArrayUtilities, DrawMode } from "./WebGLVertexArrayUtilities"
import { Texture, TextureProperties, WebGLTextureUtilities } from "./WebGLTextureUtilities"
import { UniformBlock, UniformBlockProperties, UniformBuffer, UniformBufferProperties, WebGLUniformBlockUtilities } from "./WebGLUniformBlockUtilities"
import { Uniform, UniformsListSetter, WebGLUniformUtilities } from "./WebGLUniformUtilities"
import { Program } from "./WebGLProgramUtilities"

export type PacketProperties = {
    vertexArray: VertexArrayProperties;
    uniforms?: {
        uniformBuffers?: (UniformBufferProperties | UniformBuffer)[];
        uniformBlocks?: Record<string, UniformBlockProperties>;
        uniformVariables?: Record<string, Uniform>;
    }
    options?: {
        drawMode?: DrawMode;
        instanceCount?: number;
    };
}

export type PacketValues = {
    vertexArray?: VertexArrayValues;
    uniforms?: {
        uniformVariables?: Record<string, Uniform>;
        uniformBlocks?: Record<string, {
            uniforms: Record<string, Uniform>;
        }>;
    }
}

export type Packet = {
    vertexArray: VertexArray;
    uniforms?: {
        uniformSetters: UniformsListSetter;
        uniformBlocks?: Record<string, UniformBlock>;
    },
    drawMode: DrawMode;
    instanceCount?: number;
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

    static createUniformBlocks(gl: WebGL2RenderingContext, program: Program, uniformBlocks: string[]): Record<string, UniformBlock> {
        const _uniformBlocks: Record<string, UniformBlock> = {};
        uniformBlocks.forEach((blockName) => {
            const uniformBlock = WebGLUniformBlockUtilities.createUniformBlock(
                gl, program, blockName
            );
            if (uniformBlock !== null) {
                _uniformBlocks[blockName] = uniformBlock;
            }
        });
        return _uniformBlocks;
    }

    static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null {
        const {options, vertexArray: vertexArrayProperties, uniforms: uniformsProperties} = packet;
        const drawMode = options?.drawMode || DrawMode.TRIANGLES;
        const instanceCount = options?.instanceCount;

        let vertexArray: VertexArray | null = null;
        vertexArray = WebGLVertexArrayUtilities.createVertexArray(gl, program, vertexArrayProperties);
        if (vertexArray === null) {
            return null;
        }
      
        let uniforms = <NonNullable<Packet["uniforms"]>>{};
        if (uniformsProperties !== void 0) {
            const {uniformVariables, uniformBlocks: uniformBlocksProperties, uniformBuffers: uniformBuffersProperties} = uniformsProperties;
            if (uniformVariables) {
                const setter = WebGLUniformUtilities.getUniformsListSetter(gl, program, uniformVariables) ?? void 0;
                if (setter === void 0) {
                    return null;
                }
                uniforms.uniformSetters = setter;
                WebGLUniformUtilities.setUniformsListValues(gl, setter, uniformVariables);
            }

            let uniformBlocks: Record<string, UniformBlock> = {};
            const uniformBlocksPropertiesEntries = uniformBlocksProperties ? Object.entries(uniformBlocksProperties) : [];
            if (uniformBuffersProperties && uniformBuffersProperties.length > 0) {
                uniformBuffersProperties.forEach(
                    (uniformBuffersProperty_i, i) => {
                        const relatedBlockProperties = uniformBlocksPropertiesEntries.filter(
                            ([_, uniformBlockProperty]) => uniformBlockProperty.buffer === i
                        );
                        const relatedBlocks = relatedBlockProperties.map(
                            ([blockName, _]) => WebGLUniformBlockUtilities.createUniformBlock(gl, program, blockName)
                        );

                        if (relatedBlocks.some(block => block == null)) {return null;}

                        if ("internalBuffer" in uniformBuffersProperty_i) {
                            relatedBlocks.forEach((block_i, i) => {
                                WebGLUniformBlockUtilities.bindUniformBuffer(gl, block_i!, uniformBuffersProperty_i);
                            });
                        }
                        else {
                            const {usage} = uniformBuffersProperty_i;
                            if (relatedBlocks.length > 1) {
                                const rangedBuffers = WebGLUniformBlockUtilities.createRangedUniformBuffers(gl, <UniformBlock[]>relatedBlocks, usage)!;
                                relatedBlocks.forEach((block_i, i) => {
                                    const rangedBuffer = rangedBuffers[i];
                                    WebGLUniformBlockUtilities.bindUniformBuffer(gl, block_i!, rangedBuffer);
                                });
                            }
                            else if (relatedBlocks.length > 0) {
                                const relatedBlock = relatedBlocks[0];
                                const {blockSize, name} = relatedBlock!;
                                const buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, blockSize, true, usage);
                                WebGLUniformBlockUtilities.bindUniformBuffer(gl, relatedBlock!, buffer!);
                                uniformBlocks[name] = relatedBlock!;
                            }
                        }
                    }
                );
            }
            const remainingBlockProperties = uniformBlocksPropertiesEntries.filter(
                ([_, uniformBlockProperty]) => uniformBlockProperty.buffer === undefined
            );
            console.log(remainingBlockProperties);
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
            uniforms.uniformBlocks = uniformBlocks;
        }

        return {
            vertexArray,
            uniforms,
            drawMode,
            instanceCount
        };
    }

    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void {
        const {vertexArray: vertexArrayValues, uniforms: uniformsValues} = values;
        const {vertexArray, uniforms} = packet;

        if (vertexArrayValues && vertexArray) {
            WebGLVertexArrayUtilities.setVertexArrayValues(gl, vertexArray, vertexArrayValues);
        }
        if (uniforms && uniformsValues) {
            const {uniformBlocks, uniformSetters} = uniforms;
            const {uniformBlocks: uniformsBlocksValues, uniformVariables} = uniformsValues;
            if (uniformSetters && uniformVariables) {
                WebGLUniformUtilities.setUniformsListValues(gl, uniformSetters, uniformVariables);
            }
            if (uniformBlocks && uniformsBlocksValues) {
                const uniformBlocksValuesEntries = uniformsBlocksValues ? Object.entries(uniformsBlocksValues) : [];
                uniformBlocksValuesEntries.forEach(([blockName, uniformBlock]) => {
                    const {uniforms} = uniformBlock;
                    const block = uniformBlocks[blockName];
                    const buffer = block.buffer!;
                    WebGLUniformBlockUtilities.setUniformBufferValues(gl, block, buffer, uniforms);
                });
            }
        }
    }

    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void {
        const {vertexArray} = packet;

        if (vertexArray) {
            const {drawMode, instanceCount} = packet;
            WebGLVertexArrayUtilities.drawVertexArray(gl, vertexArray, drawMode, instanceCount);
        }
        else {
            console.error("No vertex array to draw.");
        }

        //@TODO: getError ?
    }
}