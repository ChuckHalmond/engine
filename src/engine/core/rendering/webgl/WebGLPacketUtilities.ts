import { VertexArray, VertexArrayValues, VertexArrayProperties, WebGLVertexArrayUtilities, DrawMode } from "./WebGLVertexArrayUtilities"
import { Texture, TextureProperties, WebGLTextureUtilities } from "./WebGLTextureUtilities"
import { UniformBlock, UniformBlockBuffer, UniformBufferProperties, WebGLUniformBlockUtilities } from "./WebGLUniformBlockUtilities"
import { Uniform, UniformsListSetter, WebGLUniformUtilities } from "./WebGLUniformUtilities"
import { Program } from "./WebGLProgramUtilities"

export type PacketProperties = {
    vertexArray: VertexArrayProperties;
    uniforms?: Record<string, Uniform>;
    uniformBlocks?: {
        block: UniformBlock;
        buffer?: UniformBlockBuffer | UniformBufferProperties;
        uniforms?: Record<string, Uniform>;
    }[];
    options?: {
        drawMode?: DrawMode;
        instanceCount?: number;
    };
}

export type PacketValues = {
    vertexArray?: VertexArrayValues;
    uniforms?: Record<string, Uniform>;
    uniformBlocks?: {
        block: UniformBlock;
        buffer: UniformBlockBuffer;
        uniforms: Record<string, Uniform>;
    }[];
}

export type Packet = {
    vertexArray: VertexArray;
    uniforms?: UniformsListSetter;
    uniformBlocks?: Record<string, {
        block: UniformBlock;
        buffer: UniformBlockBuffer;
    }>;
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
        const {options, vertexArray: vertexArrayProperties, uniforms: uniformsProperties, uniformBlocks: uniformBlocksProperties} = packet;
        const drawMode = options?.drawMode || DrawMode.TRIANGLES;
        const instanceCount = options?.instanceCount;

        let vertexArray: VertexArray | null = null;
        vertexArray = WebGLVertexArrayUtilities.createVertexArray(gl, program, vertexArrayProperties);
        if (vertexArray === null) {
            return null;
        }
      
        let uniforms: UniformsListSetter | undefined = void 0;
        if (uniformsProperties !== void 0) {
            uniforms = WebGLUniformUtilities.getUniformsListSetter(gl, program, uniformsProperties) ?? void 0;
            if (uniforms === void 0) {
                return null;
            }
            WebGLUniformUtilities.setUniformsListValues(gl, uniforms, uniformsProperties);
        }

        let uniformBlocks: Record<string, {
            block: UniformBlock;
            buffer: UniformBlockBuffer;
        }> = {};

        if (uniformBlocksProperties !== void 0) {
            uniformBlocksProperties.forEach((uniformBlock) => {
                const {block, buffer: bufferOrBufferProperties, uniforms} = uniformBlock;
                const {blockSize, name: blockName} = block;
                let buffer: UniformBlockBuffer | null = null;
                if (bufferOrBufferProperties !== undefined) {
                    if ("internalBuffer" in bufferOrBufferProperties) {
                        buffer = bufferOrBufferProperties;
                    }
                    else {
                        const {usage} = bufferOrBufferProperties;
                        buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, usage, blockSize);
                    }
                }
                else {
                    buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, blockSize);
                }
                if (buffer === null) {
                    return null;
                }
                WebGLUniformBlockUtilities.bindUniformBuffer(gl, block, buffer);
                if (uniforms !== undefined) {
                    WebGLUniformBlockUtilities.setUniformBufferValues(gl, block, buffer, uniforms);
                }
                uniformBlocks[blockName] = {block, buffer};
            });
        }

        return {
            vertexArray,
            uniforms,
            uniformBlocks,
            drawMode,
            instanceCount
        };
    }

    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void {
        const {vertexArray: vertexArrayValues, uniforms: uniformsValues, uniformBlocks: uniformBlocksValues} = values;
        const {vertexArray, uniforms} = packet;

        if (vertexArrayValues && vertexArray) {
            WebGLVertexArrayUtilities.setVertexArrayValues(gl, vertexArray, vertexArrayValues);
        }
        if (uniformsValues && uniforms) {
            WebGLUniformUtilities.setUniformsListValues(gl, uniforms, uniformsValues);
        }
        if (uniformBlocksValues) {
            uniformBlocksValues.forEach((uniformBlock_i) => {
                const {block, buffer, uniforms} = uniformBlock_i;
                WebGLUniformBlockUtilities.setUniformBufferValues(gl, block, buffer, uniforms);
            });
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