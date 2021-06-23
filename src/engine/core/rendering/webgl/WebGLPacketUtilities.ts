import { AttributesList, AttributesSettersList, WebGLAttributeUtilities } from "./WebGLAttributeUtilities"
import { Texture, TextureProperties, TexturesUnitsContext, WebGLTextureUtilities } from "./WebGLTextureUtilities"
import { UniformBlock, UniformBlockProperties, UniformBlocksBindingsContext, UniformBlockSetter, WebGLUniformBlockUtilities } from "./WebGLUniformBlockUtilities"
import { UniformsList, UniformsSettersList, WebGLUniformUtilities } from "./WebGLUniformUtilities"
import { DrawMode } from "./WebGLConstants"
import { WebGLDrawUtilities } from "./WebGLDrawUtilities"

export { Packet };
export { PacketBindingsProperties };
export { PacketBindings };
export { PacketOptions };
export { PacketSetter };
export { WebGLPacketUtilities };

type Packet = {
    attributes?: AttributesList;
    uniforms?: UniformsList;
    uniformBlocks?: List<{
        block: UniformBlock;
        list: UniformsList;
    }>,
    props?: PacketOptions
}

type PacketBindingsProperties = {
    texturesProps?: List<TextureProperties>;
    blocksProps?: List<UniformBlockProperties>;
    texturesCtx?: TexturesUnitsContext;
    blocksCtx?: UniformBlocksBindingsContext;
}

type PacketBindings = {
    textures: List<Texture>;
    blocks: List<UniformBlock>;
    texturesCtx?: TexturesUnitsContext;
    blocksCtx?: UniformBlocksBindingsContext;
}

type PacketOptions = {
    drawMode?: DrawMode;
    instanced?: boolean;
    instanceCount?: number;
}

type PacketSetter = {
    attributesSetter?: AttributesSettersList;
    uniformsSetter?: UniformsSettersList;
    uniformBlockSetters?: List<UniformBlockSetter>;
    drawMode: DrawMode;
    instanced: boolean;
    instanceCount: number;
}

class WebGLPacketUtilities {

    private constructor() {}

    public static createPacketBindings(gl: WebGL2RenderingContext, props: PacketBindingsProperties): PacketBindings | null {
        let textures = {} as List<Texture>;
        let blocks = {} as List<UniformBlock>;

        let texturesCtx = props.texturesCtx;
        let blocksCtx = props.blocksCtx;

        const texturesProps = props.texturesProps;
        const blocksProps = props.blocksProps;
        
        if (typeof texturesProps !== 'undefined') {
            texturesCtx = texturesCtx || WebGLTextureUtilities.createBindingsContext(gl);
            const texturesNames = Object.keys(texturesProps);
            for (const textureName of texturesNames) {
                const textureProps = texturesProps[textureName];
                const texture = WebGLTextureUtilities.createTexture(
                    gl, texturesCtx, 
                    textureProps
                );
                if (texture == null) {
                    return null;
                }
                textures[textureName] = texture;
            }
        }

        if (typeof blocksProps !== 'undefined') {
            blocksCtx = blocksCtx || WebGLUniformBlockUtilities.createBindingsContext(gl);
            const blockNames = Object.keys(blocksProps);
            for (const blockName of blockNames) {
                const blockProp = blocksProps[blockName];
                const block = WebGLUniformBlockUtilities.createUniformBlock(
                    gl, blocksCtx, 
                    blockProp.name
                );
                if (block == null) {
                    return null;
                }
                blocks[blockName] = block;
            };
        }

        return {
            textures: textures,
            blocks: blocks,
            texturesCtx: texturesCtx,
            blocksCtx: blocksCtx
        }
    }

    public static getPacketSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, packet: Packet): PacketSetter | null {
        const attributes = packet.attributes;
        const uniforms = packet.uniforms;
        const uniformBlocks = packet.uniformBlocks;

        const props = packet.props;
        const drawMode = (typeof props === 'undefined' || typeof props.drawMode === 'undefined') ? DrawMode.TRIANGLES : props.drawMode;
        const instanced = (typeof props === 'undefined' || typeof props.instanced === 'undefined') ? false : props.instanced;
        const instanceCount = (typeof props === 'undefined' || typeof props.instanceCount === 'undefined') ? 0 : props.instanceCount;

        let attributesSetter: any;
        if (typeof attributes !== 'undefined') {
            attributesSetter = WebGLAttributeUtilities.getAttributesListSetter(gl, glProg, attributes);
            
            if (attributesSetter == null) {
                return null;
            }
        }

        let uniformBlockSetters: any;
        if (typeof uniformBlocks !== 'undefined') {
            const blockNames = Object.keys(uniformBlocks);
            uniformBlockSetters = {} as List<UniformBlockSetter>;
            
            for (const blockName of blockNames) {
                const uniformBlock = uniformBlocks[blockName];
                const uniformBlockSetter = WebGLUniformBlockUtilities.getUniformBlockSetter(gl, glProg, uniformBlock.block);

                if (uniformBlockSetter == null) {
                    return null;
                }

                uniformBlockSetters[blockName] = uniformBlockSetter;
            }
        }
      
        let uniformsSetter: any;
        if (typeof uniforms !== 'undefined') {
            uniformsSetter = WebGLUniformUtilities.getUniformsListSetter(gl, glProg, uniforms);

            if (uniformsSetter == null) {
                return null;
            }
        }

        return {
            attributesSetter: attributesSetter,
            uniformsSetter: uniformsSetter,
            uniformBlockSetters: uniformBlockSetters,
            drawMode: drawMode,
            instanced: instanced,
            instanceCount: instanceCount
        };
    }

    public static setPacketValues(gl: WebGL2RenderingContext, setter: PacketSetter, packet: Packet): void {
        const attributes = packet.attributes;
        const uniforms = packet.uniforms;
        const uniformBlocks = packet.uniformBlocks;

        const attributeSetter = setter.attributesSetter;
        const uniformsSetter = setter.uniformsSetter;
        const uniformBlockSetters = setter.uniformBlockSetters;

        if (typeof attributes !== 'undefined' && attributeSetter) {
            WebGLAttributeUtilities.setAttributesListValues(gl, attributeSetter, attributes);
        }

        if (typeof uniforms !== 'undefined' && uniformsSetter) {
            WebGLUniformUtilities.setUniformsListValues(gl, uniformsSetter, uniforms);
        }

        if (typeof uniformBlocks !== 'undefined') {
            if (typeof uniformBlockSetters !== 'undefined') {
                const blockNames = Object.keys(uniformBlocks);
                for (const blockName of blockNames) {
                    const uniformBlockSetter = uniformBlockSetters[blockName];
                    const uniformBlock = uniformBlocks[blockName];
                    
                    if (uniformBlockSetter) {
                        WebGLUniformBlockUtilities.setUniformBlockValues(gl, uniformBlockSetter, uniformBlock.list);
                    }
                }
            }
        }
    }

    public static drawPacket(gl: WebGL2RenderingContext, setter: PacketSetter): void {
        const attributeSetter = setter.attributesSetter;

        if (typeof attributeSetter !== 'undefined') {

            WebGLAttributeUtilities.bindAttributesList(gl, attributeSetter);
            
            if (attributeSetter.hasIndices) {
                if (setter.instanced) {
                    WebGLDrawUtilities.drawElementsInstanced(
                        gl,
                        setter.drawMode,
                        attributeSetter.indexType,
                        attributeSetter.numElements,
                        0,
                        setter.instanceCount
                    );
                }
                else {
                    WebGLDrawUtilities.drawElements(
                        gl,
                        setter.drawMode,
                        attributeSetter.indexType,
                        attributeSetter.numElements,
                        0
                    );
                }
            }
            else {
                if (setter.instanced) {
                    WebGLDrawUtilities.drawArraysInstanced(
                        gl,
                        setter.drawMode,
                        0,
                        attributeSetter.numElements,
                        setter.instanceCount
                    );
                }
                else {
                    WebGLDrawUtilities.drawArrays(
                        gl,
                        setter.drawMode,
                        0,
                        attributeSetter.numElements
                    );
                }
            }

            WebGLAttributeUtilities.unbindAttributesList(gl);
        }
        else {
            console.error(`No attributes to draw.`);
        }
    }
}