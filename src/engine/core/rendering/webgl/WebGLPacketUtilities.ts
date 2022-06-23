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

    static createBindings(gl: WebGL2RenderingContext, props: PacketBindingsProperties): PacketBindings {
        const textures: {
            [key: string]: Texture
        } = {};
        const uniformBlocks: {
            [key: string]: UniformBlock
        } = {};

        const {textures: texturesProps, uniformBlocks: uniformBlocksProps, program} = props;
        
        if (typeof texturesProps !== "undefined") {
            Object.entries(texturesProps).forEach(([textureName, textureProps]) => {
                const texture = WebGLTextureUtilities.createTexture(gl, textureProps);
                if (texture !== null) {
                    textures[textureName] = texture;
                }
            });
        }

        if (typeof uniformBlocksProps !== "undefined") {
            uniformBlocksProps.forEach((blockName) => {
                const uniformBlock = WebGLUniformBlockUtilities.createUniformBlock(
                    gl, program, blockName
                );
                if (uniformBlock !== null) {
                    uniformBlocks[blockName] = uniformBlock;
                }
            });
        }

        return {
            textures: textures,
            uniformBlocks: uniformBlocks
        };
    }

    static createPacket(gl: WebGL2RenderingContext, program: Program, packet: PacketProperties): Packet | null {
        const {options, vertexArray: vertexArrayProps, uniforms: uniformsProps, uniformBlocks: uniformBlocksProps, textures: texturesProps} = packet;
        const drawMode = options?.drawMode || DrawMode.TRIANGLES;
        const instanceCount = options?.instanceCount;

        let vertexArray: VertexArray | null | undefined = void 0;
        if (typeof vertexArrayProps !== "undefined") {
            vertexArray = WebGLVertexArrayUtilities.createVertexArray(gl, program, vertexArrayProps);
            if (vertexArray == null) {
                return null;
            }
        }
      
        let uniformsSetter: UniformsListSetter | null | undefined = void 0;
        if (typeof uniformsProps !== "undefined") {
            uniformsSetter = WebGLUniformUtilities.getUniformsListSetter(gl, program, uniformsProps);
            if (uniformsSetter == null) {
                return null;
            }
            WebGLUniformUtilities.setUniformsListValues(gl, uniformsSetter, uniformsProps);
        }

        let uniformBlocks: {
            [name: string]: {
                block: UniformBlock;
                buffer: UniformBuffer;
            }
        } | null | undefined = void 0;

        if (typeof uniformBlocksProps !== "undefined") {
            uniformBlocks = {};
            uniformBlocksProps.forEach((uniformBlock) => {
                const {block, buffer: bufferProps, uniforms} = uniformBlock;
                const {name: blockName} = block;
                let buffer: UniformBuffer | null = null;
                if (typeof bufferProps === "undefined") {
                    buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, program, blockName);
                }
                else if (!("internal" in bufferProps)) {
                    const {usage, byteLength, rangeOffset, rangeSize} = bufferProps;
                    buffer = WebGLUniformBlockUtilities.createUniformBuffer(gl, program, blockName,
                        usage, byteLength, rangeOffset, rangeSize
                    );
                }
                else {
                    buffer = bufferProps;
                }
                if (buffer === null) {
                    return null;
                }
                if (typeof uniforms !== "undefined") {
                    const {layout} = block;
                    WebGLUniformBlockUtilities.setUniformBufferValues(gl, layout, buffer, uniforms);
                }
                WebGLUniformBlockUtilities.bindUniformBuffer(gl, block, buffer);
                uniformBlocks![block.name] = {
                    block: block,
                    buffer: buffer
                };
            });
        }

        if (typeof texturesProps !== "undefined") {
            texturesProps.forEach((textureProps) => {
                const {props, params, texture} = textureProps;
                if (typeof props !== "undefined") {
                    WebGLTextureUtilities.setTextureProperties(gl, texture, props);
                }
                if (typeof params !== "undefined") {
                    WebGLTextureUtilities.setTextureParameters(gl, texture, params);
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

    static setPacketValues(gl: WebGL2RenderingContext, packet: Packet, values: PacketValues): void {
        const {vertexArray: vertexArrayValues, uniforms: uniformsValues, uniformBlocks: uniformBlocksValues, textures: texturesValues} = values;
        const {vertexArray, uniformsSetter} = packet;

        if (typeof vertexArrayValues !== "undefined" && typeof vertexArray !== "undefined") {
            WebGLVertexArrayUtilities.setVertexArrayValues(gl, vertexArray, vertexArrayValues);
        }

        if (typeof uniformsValues !== "undefined" && typeof uniformsSetter !== "undefined") {
            WebGLUniformUtilities.setUniformsListValues(gl, uniformsSetter, uniformsValues);
        }

        if (typeof uniformBlocksValues !== "undefined") {
            uniformBlocksValues.forEach((uniformBlock_i) => {
                const {block, buffer, uniforms} = uniformBlock_i;
                const {layout} = block;
                WebGLUniformBlockUtilities.setUniformBufferValues(gl, layout, buffer, uniforms);
            });
        }

        if (typeof texturesValues !== "undefined") {
            texturesValues.forEach((texture_i) => {
                const {props, params, texture} = texture_i;
                if (typeof props !== "undefined") {
                    WebGLTextureUtilities.setTextureProperties(gl, texture, props);
                }
                if (typeof params !== "undefined") {
                    WebGLTextureUtilities.setTextureParameters(gl, texture, params);
                }
            });
        }
    }

    static drawPacket(gl: WebGL2RenderingContext, packet: Packet): void {
        const {vertexArray, uniformBlocks} = packet;

        if (typeof uniformBlocks !== "undefined") {
            Object.values(uniformBlocks).forEach((uniformBlock) => {
                const {block, buffer} = uniformBlock;
                WebGLUniformBlockUtilities.bindUniformBuffer(gl, block, buffer);
            });
        }

        if (typeof vertexArray !== "undefined") {
            const {drawMode, instanceCount} = packet;
            WebGLVertexArrayUtilities.drawVertexArray(gl, vertexArray, drawMode, instanceCount);
        }
        else {
            console.error("No vertex array to draw.");
        }
    }
}