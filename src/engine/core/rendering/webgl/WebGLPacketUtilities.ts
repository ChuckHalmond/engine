import { VertexArray, VertexArrayValues, VertexArrayProperties, WebGLVertexArrayUtilities, DrawMode } from "./WebGLVertexArrayUtilities"
import { Texture, TextureProperties, WebGLTextureUtilities } from "./WebGLTextureUtilities"
import { UniformBlock, UniformBuffer, UniformBufferProperties, WebGLUniformBlockUtilities } from "./WebGLUniformBlockUtilities"
import { UniformsList, UniformsListSetter, WebGLUniformUtilities } from "./WebGLUniformUtilities"
import { Program } from "./WebGLProgramUtilities"

export type PacketProperties = {
    vertexArray: VertexArrayProperties;
    uniforms?: UniformsList;
    textures?: {
        texture: Texture;
        properties: TextureProperties;
    }[];
    uniformBlocks?: {
        block: UniformBlock;
        buffer?: UniformBuffer | UniformBufferProperties;
        uniforms?: UniformsList;
    }[];
    options?: {
        drawMode?: DrawMode;
        instanceCount?: number;
    };
}

export type PacketValues = {
    vertexArray?: VertexArrayValues;
    uniforms?: UniformsList;
    uniformBlocks?: {
        block: UniformBlock;
        buffer: UniformBuffer;
        uniforms: UniformsList;
    }[];
}

export type PacketBindingsProperties = {
    program: Program;
    textures?: string[];
    uniformBlocks?: string[];
}

export type PacketBindings = {
    textures: {
        [name: string]: Texture;
    };
    uniformBlocks: {
        [name: string]: UniformBlock;
    };
}

export type Packet = {
    vertexArray?: VertexArray;
    uniformsSetter?: UniformsListSetter;
    uniformBlocks?: {
        [name: string]: {
            block: UniformBlock;
            buffer: UniformBuffer;
        }
    };
    bindings?: PacketBindings;
    drawMode: DrawMode;
    instanceCount?: number;
}

export class WebGLPacketUtilities {

    static createBindings(gl: WebGL2RenderingContext, properties: PacketBindingsProperties): PacketBindings {
        const textures: {
            [key: string]: Texture
        } = {};
        const uniformBlocks: {
            [key: string]: UniformBlock
        } = {};

        const {textures: texturesNames, uniformBlocks: uniformBlocksNames, program} = properties;
        
        if (texturesNames !== void 0) {
            texturesNames.forEach((textureName) => {
                const texture = WebGLTextureUtilities.createTexture(gl, textureName);
                if (texture !== null) {
                    textures[textureName] = texture;
                }
            });
        }

        if (uniformBlocksNames !== void 0) {
            uniformBlocksNames.forEach((blockName) => {
                const uniformBlock = WebGLUniformBlockUtilities.createUniformBlock(
                    gl, program, blockName
                );
                if (uniformBlock !== null) {
                    uniformBlocks[blockName] = uniformBlock;
                }
            });
        }

        return {textures, uniformBlocks};
    }

    static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null {
        const {options, vertexArray: vertexArrayProperties, uniforms: uniformsProperties, uniformBlocks: uniformBlocksProperties, textures: texturesProperties} = packet;
        const drawMode = options?.drawMode || DrawMode.TRIANGLES;
        const instanceCount = options?.instanceCount;

        let vertexArray: VertexArray | undefined = void 0;
        if (vertexArrayProperties !== void 0) {
            vertexArray = WebGLVertexArrayUtilities.createVertexArray(gl, program, vertexArrayProperties) ?? void 0;
            if (vertexArray == void 0) {
                return null;
            }
        }
      
        let uniformsSetter: UniformsListSetter | undefined = void 0;
        if (uniformsProperties !== void 0) {
            uniformsSetter = WebGLUniformUtilities.getUniformsListSetter(gl, program, uniformsProperties) ?? void 0;
            if (uniformsSetter == void 0) {
                return null;
            }
            WebGLUniformUtilities.setUniformsListValues(gl, uniformsSetter, uniformsProperties);
        }

        let uniformBlocks: {
            [name: string]: {
                block: UniformBlock;
                buffer: UniformBuffer;
            }
        } = {};

        if (uniformBlocksProperties !== void 0) {
            uniformBlocksProperties.forEach((uniformBlock) => {
                const {block, buffer: bufferProperties, uniforms} = uniformBlock;
                const {blockSize, name: blockName} = block;
                let buffer: UniformBuffer | null = null;
                if (bufferProperties) {
                    const {usage} = bufferProperties;
                    buffer = "internal" in bufferProperties ? bufferProperties :
                        WebGLUniformBlockUtilities.createUniformBuffer(gl, usage, blockSize);
                }
                else {
                    buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, blockSize);
                }
                if (buffer == null) {
                    return null;
                }
                if (uniforms !== void 0) {
                    WebGLUniformBlockUtilities.setUniformBufferValues(gl, block, buffer, uniforms);
                }
                WebGLUniformBlockUtilities.bindUniformBuffer(gl, block, buffer);
                uniformBlocks[blockName] = {block, buffer};
            });
        }
        if (texturesProperties !== void 0) {
            texturesProperties.forEach((textureProperties) => {
                const {properties, texture} = textureProperties;
                if (properties !== void 0) {
                    WebGLTextureUtilities.setTextureProperties(gl, texture, properties);
                }
            });
        }

        return {
            vertexArray,
            uniformsSetter,
            uniformBlocks,
            drawMode,
            instanceCount
        };
    }

    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void {
        const {vertexArray: vertexArrayValues, uniforms: uniformsValues, uniformBlocks: uniformBlocksValues} = values;
        const {vertexArray, uniformsSetter} = packet;

        if (vertexArrayValues && vertexArray) {
            WebGLVertexArrayUtilities.setVertexArrayValues(gl, vertexArray, vertexArrayValues);
        }
        if (uniformsValues && uniformsSetter) {
            WebGLUniformUtilities.setUniformsListValues(gl, uniformsSetter, uniformsValues);
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