import { Program } from "./WebGLProgramUtilities";
import { Texture } from "./WebGLTextureUtilities";
export { UniformValue };
export { Uniform };
export { UniformSetter };
export { UniformsListSetter };
export { WebGLUniformUtilities };
export declare enum UniformType {
    BOOL = 35670,
    BOOL_VEC2 = 35671,
    BOOL_VEC3 = 35672,
    BOOL_VEC4 = 35673,
    INT = 5124,
    INT_VEC2 = 35667,
    INT_VEC3 = 35668,
    INT_VEC4 = 35669,
    INT_SAMPLER_2D = 36298,
    INT_SAMPLER_3D = 36299,
    INT_SAMPLER_CUBE = 36300,
    INT_SAMPLER_2D_ARRAY = 36303,
    UNSIGNED_INT_SAMPLER_2D = 36306,
    UNSIGNED_INT_SAMPLER_3D = 36307,
    UNSIGNED_INT_SAMPLER_CUBE = 36308,
    UNSIGNED_INT_SAMPLER_2D_ARRAY = 36311,
    UNSIGNED_INT = 5125,
    UNSIGNED_INT_VEC2 = 36294,
    UNSIGNED_INT_VEC3 = 36295,
    UNSIGNED_INT_VEC4 = 36296,
    FLOAT = 5126,
    FLOAT_VEC2 = 35664,
    FLOAT_VEC3 = 35665,
    FLOAT_VEC4 = 35666,
    FLOAT_MAT2 = 35674,
    FLOAT_MAT3 = 35675,
    FLOAT_MAT4 = 35676,
    FLOAT_MAT2x3 = 35685,
    FLOAT_MAT2x4 = 35686,
    FLOAT_MAT3x2 = 35687,
    FLOAT_MAT3x4 = 35688,
    FLOAT_MAT4x2 = 35689,
    FLOAT_MAT4x3 = 35690,
    SAMPLER_2D = 35678,
    SAMPLER_3D = 35679,
    SAMPLER_CUBE = 35680,
    SAMPLER_2D_SHADOW = 35682,
    SAMPLER_2D_ARRAY = 36289,
    SAMPLER_2D_ARRAY_SHADOW = 36292,
    SAMPLER_CUBE_SHADOW = 36293
}
declare type UniformValue = number | Float32List | Uint32List | Int32List | Texture;
declare type Uniform = {
    value: UniformValue;
    srcOffset?: number;
    srcLength?: number;
    transpose?: boolean;
};
declare type UniformSetter = {
    type: UniformType;
    set: (value: any) => void;
};
declare type UniformsListSetter = {
    setters: Record<string, UniformSetter>;
    program: Program;
};
export declare enum UniformDataType {
    SCALAR = "SCALAR",
    VEC2 = "VEC2",
    VEC3 = "VEC3",
    VEC4 = "VEC4",
    MAT2 = "MAT2",
    MAT3 = "MAT3",
    MAT4 = "MAT4"
}
declare class WebGLUniformUtilities {
    static asArrayBufferView(uniformValue: UniformValue): ArrayBufferView;
    static getUniformSetter(gl: WebGL2RenderingContext, uniform: Uniform, location: WebGLUniformLocation, uniformType: UniformType): UniformSetter | null;
    static getUniformsListSetter(gl: WebGL2RenderingContext, program: Program, list: Record<string, Uniform>): UniformsListSetter | null;
    static setUniformsListValues(gl: WebGL2RenderingContext, setter: UniformsListSetter, list: Record<string, Uniform>): void;
}
