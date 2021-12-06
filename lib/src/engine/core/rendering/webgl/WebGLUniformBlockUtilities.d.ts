import { UniformsList } from "./WebGLUniformUtilities";
import { BufferDataUsage } from "./WebGLConstants";
export { UniformBlockProperties };
export { UniformBlockReference };
export { UniformBlockBinding };
export { UniformBlock };
export { UniformBlockSetter };
export { UniformBlocksBindingsContext };
export { WebGLUniformBlockUtilities };
declare type UniformBlockProperties = {
    name: string;
    usage?: BufferDataUsage;
};
declare type UniformBlockReference = {
    glBuffer: WebGLBuffer;
};
declare type UniformBlockBinding = {
    bindingPoint: number;
};
declare type UniformBlock = UniformBlockProperties & UniformBlockReference & UniformBlockBinding;
declare type UniformBlockSetter = UniformBlock & {
    index: number;
    uniforms: {
        [name: string]: {
            offset: number;
        };
    };
    bufferByteLength: number;
    glProg: WebGLProgram;
};
declare type UniformBlocksBindingsContext = {
    maxBindingPoints: number;
    registeredBindingPoints: Array<boolean>;
};
declare class WebGLUniformBlockUtilities {
    private constructor();
    static createBindingsContext(gl: WebGL2RenderingContext): UniformBlocksBindingsContext;
    static createUniformBlock(gl: WebGL2RenderingContext, ctx: UniformBlocksBindingsContext, name: string): UniformBlock | null;
    static getUniformBlockSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, block: UniformBlock): UniformBlockSetter | null;
    static setUniformBlockValues(gl: WebGL2RenderingContext, setter: UniformBlockSetter, uniforms: UniformsList): void;
    static bindUniformBlock(gl: WebGL2RenderingContext, setter: UniformBlockSetter): void;
    private static _allocateBindingPoint;
    private static _freeBindingPoint;
}
