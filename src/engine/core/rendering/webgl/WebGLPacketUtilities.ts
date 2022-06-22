import { VertexArray, VertexArrayValues, VertexArrayProperties, WebGLVertexArrayUtilities, DrawMode } from "./WebGLVertexArrayUtilities"
import { Texture, TextureParameters, TextureProperties, WebGLTextureUtilities } from "./WebGLTextureUtilities"
import { UniformBlock, UniformBuffer, UniformBufferProperties, WebGLUniformBlockUtilities } from "./WebGLUniformBlockUtilities"
import { UniformsList, UniformsListSetter, WebGLUniformUtilities } from "./WebGLUniformUtilities"
import { Program } from "./WebGLProgramUtilities"

export type PacketProperties = {
    vertexArray?: VertexArrayProperties;
    uniforms?: UniformsList;
    textures?: {
        texture: Texture;
        props?: TextureProperties;
        params?: TextureParameters;
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
    textures?: {
        texture: Texture;
        props?: TextureProperties;
        params?: TextureParameters;
    }[];
    uniformBlocks?: {
        block: UniformBlock;
        buffer: UniformBuffer;
        uniforms: UniformsList;
    }[];
}

export type PacketBindingsProperties = {
    program: Program;
    textures?: {
        [name: string]: TextureProperties & TextureParameters;
    };
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

    private constructor() {}

    public static createBindings(gl: WebGL2RenderingContext, props: PacketBindingsProperties): PacketBindings | null {
        const textures: {
            [key: string]: Texture
        } = {};
        const uniformBlocks: {
            [key: string]: UniformBlock
        } = {};

        const texturesInfo = props.textures;
        const uniformBlocksInfo = props.uniformBlocks;
        
        if (typeof texturesInfo !== "undefined") {
            Object.entries(texturesInfo).forEach(([textureName, textureInfo]) => {
                const texture = WebGLTextureUtilities.createTexture(gl, textureInfo);
                if (texture == null) {
                    return null;
                }
                textures[textureName] = texture;
            });
        }

        if (typeof uniformBlocksInfo !== "undefined") {
            uniformBlocksInfo.forEach((blockName) => {
                const uniformBlock = WebGLUniformBlockUtilities.createUniformBlock(
                    gl, props.program, blockName
                );
                if (uniformBlock == null) {
                    return null;
                }
                uniformBlocks[blockName] = uniformBlock;
            });
        }

        return {
            textures: textures,
            uniformBlocks: uniformBlocks
        };
    }

    public static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null {
        const drawMode = packet.options?.drawMode || DrawMode.TRIANGLES;
        const instanceCount = packet.options?.instanceCount;

        let vertexArray: VertexArray | null | undefined = void 0;
        if (typeof packet.vertexArray !== "undefined") {
            vertexArray = WebGLVertexArrayUtilities.createVertexArray(gl, program, packet.vertexArray);
            if (vertexArray == null) {
                return null;
            }
        }
      
        let uniformsSetter: UniformsListSetter | null | undefined = void 0;
        if (typeof packet.uniforms !== "undefined") {
            uniformsSetter = WebGLUniformUtilities.getUniformsListSetter(gl, program, packet.uniforms);
            if (uniformsSetter == null) {
                return null;
            }
            WebGLUniformUtilities.setUniformsListValues(gl, uniformsSetter, packet.uniforms);
        }

        let uniformBlocks: {
            [name: string]: {
                block: UniformBlock;
                buffer: UniformBuffer;
            }
        } | null | undefined = void 0;

        if (typeof packet.uniformBlocks !== "undefined") {
            uniformBlocks = {};
            packet.uniformBlocks.forEach((uniformBlock) => {
                const block = uniformBlock.block;
                let buffer: UniformBuffer | null = null;
                if (typeof uniformBlock.buffer === "undefined") {
                    buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, program, block.name);
                }
                else if (!("internal" in uniformBlock.buffer)) {
                    const bufferProps = uniformBlock.buffer;
                    buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, program, block.name,
                        bufferProps.usage, bufferProps.byteLength, bufferProps.rangeOffset, bufferProps.rangeSize
                    );
                }
                else {
                    buffer = uniformBlock.buffer;
                }
                if (buffer === null) {
                    return null;
                }
                if (typeof uniformBlock.uniforms !== "undefined") {
                    WebGLUniformBlockUtilities.setUniformBufferValues(gl, block.layout, buffer, uniformBlock.uniforms);
                }
                WebGLUniformBlockUtilities.bindUniformBuffer(gl, block, buffer);
                uniformBlocks![block.name] = {
                    block: block,
                    buffer: buffer
                };
            });
        }

        if (typeof packet.textures !== "undefined") {
            packet.textures.forEach((texture) => {
                if (typeof texture.props !== "undefined") {
                    WebGLTextureUtilities.setTextureProperties(gl, texture.texture, texture.props);
                }
                if (typeof texture.params !== "undefined") {
                    WebGLTextureUtilities.setTextureParameters(gl, texture.texture, texture.params);
                }
            });
        }

        return {
            vertexArray: vertexArray,
            uniformsSetter: uniformsSetter,
            uniformBlocks: uniformBlocks,
            drawMode: drawMode,
            instanceCount: instanceCount
        };
    }

    public static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void {

        if (typeof values.vertexArray !== "undefined" && typeof packet.vertexArray !== "undefined") {
            WebGLVertexArrayUtilities.setVertexArrayValues(gl, packet.vertexArray, values.vertexArray);
        }

        if (typeof values.uniforms !== "undefined" && typeof packet.uniformsSetter !== "undefined") {
            WebGLUniformUtilities.setUniformsListValues(gl, packet.uniformsSetter, values.uniforms);
        }

        if (typeof values.uniformBlocks !== "undefined") {
            values.uniformBlocks.forEach((uniformBlock) => {
                WebGLUniformBlockUtilities.setUniformBufferValues(gl, uniformBlock.block.layout, uniformBlock.buffer, uniformBlock.uniforms);
            });
        }

        if (typeof values.textures !== "undefined") {
            values.textures.forEach((texture) => {
                if (typeof texture.props !== "undefined") {
                    WebGLTextureUtilities.setTextureProperties(gl, texture.texture, texture.props);
                }
                if (typeof texture.params !== "undefined") {
                    WebGLTextureUtilities.setTextureParameters(gl, texture.texture, texture.params);
                }
            });
        }
    }

    public static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void {
        const vertexArray = packet.vertexArray;
        const uniformBlocks = packet.uniformBlocks;

        if (typeof uniformBlocks !== "undefined") {
            Object.values(uniformBlocks).forEach((uniformBlock) => {
                WebGLUniformBlockUtilities.bindUniformBuffer(gl, uniformBlock.block, uniformBlock.buffer);
            });
        }

        if (typeof vertexArray !== "undefined") {
            WebGLVertexArrayUtilities.drawVertexArray(gl, vertexArray, packet.drawMode, packet.instanceCount);
        }
        else {
            console.error("No vertex array to draw.");
        }
    }
}