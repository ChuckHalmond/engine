import { UniformType } from "./WebGLConstants";
import { Texture } from "./WebGLTextureUtilities";
export { UniformValue };
export { UniformProperties };
export { Uniform };
export { UniformsList };
export { UniformSetter };
export { UniformsSettersList };
export { WebGLUniformUtilities };
declare type UniformValue = number | Float32List | Uint32List | Int32List | Texture;
declare type UniformProperties = {
    srcOffset?: number;
    srcLength?: number;
    transpose?: boolean;
};
declare type Uniform<V extends UniformValue = UniformValue> = {
    value: V;
    props?: UniformProperties;
};
declare type UniformsList = List<Uniform>;
declare type UniformSetter = {
    type: UniformType;
    func: (value: any) => void;
};
declare type UniformsSettersList = {
    setters: List<UniformSetter | null>;
    glProg: WebGLProgram;
};
declare class WebGLUniformUtilities {
    private constructor();
    static getUniformValueArrayBufferView(uniformValue: UniformValue): ArrayBufferView;
    static getUniformsListSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, list: UniformsList): UniformsSettersList;
    static setUniformsListValues(gl: WebGL2RenderingContext, settersList: UniformsSettersList, list: UniformsList): void;
    static isTexture(uniformValue: UniformValue): boolean;
    static getUniformSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, uniformName: string, uniform: Uniform): UniformSetter | null;
}
