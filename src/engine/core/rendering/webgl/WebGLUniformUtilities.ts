import { Program, WebGLProgramUtilities } from "./WebGLProgramUtilities";
import { Texture } from "./WebGLTextureUtilities";

export { UniformValue };
export { UniformProperties };
export { Uniform };
export { UniformsList };
export { UniformSetter };
export { UniformsListSetter };
export { WebGLUniformUtilities };

export enum UniformType {
    BOOL = 0x8B56,
    BOOL_VEC2 = 0x8B57,	 
    BOOL_VEC3 = 0x8B58,	 
    BOOL_VEC4 = 0x8B59,
    INT = 0x1404,
    INT_VEC2 = 0x8B53,	 
    INT_VEC3 = 0x8B54,	 
    INT_VEC4 = 0x8B55,	 
    INT_SAMPLER_2D = 0x8DCA,
    INT_SAMPLER_3D = 0x8DCB,
    INT_SAMPLER_CUBE = 0x8DCC,
    INT_SAMPLER_2D_ARRAY = 0x8DCF,
    UNSIGNED_INT_SAMPLER_2D = 0x8DD2,
    UNSIGNED_INT_SAMPLER_3D = 0x8DD3,
    UNSIGNED_INT_SAMPLER_CUBE = 0x8DD4,
    UNSIGNED_INT_SAMPLER_2D_ARRAY = 0x8DD7,
    UNSIGNED_INT = 0x1405,
    UNSIGNED_INT_VEC2 = 0x8DC6,
    UNSIGNED_INT_VEC3 = 0x8DC7,
    UNSIGNED_INT_VEC4 = 0x8DC8,
    FLOAT = 0x1406,
    FLOAT_VEC2 = 0x8B50,	 
    FLOAT_VEC3 = 0x8B51,	 
    FLOAT_VEC4 = 0x8B52,
    FLOAT_MAT2 = 0x8B5A,	 
    FLOAT_MAT3 = 0x8B5B,	 
    FLOAT_MAT4 = 0x8B5C,	 
    FLOAT_MAT2x3 = 0x8B65,
    FLOAT_MAT2x4 = 0x8B66,
    FLOAT_MAT3x2 = 0x8B67,
    FLOAT_MAT3x4 = 0x8B68,
    FLOAT_MAT4x2 = 0x8B69,
    FLOAT_MAT4x3 = 0x8B6A,
    SAMPLER_2D = 0x8B5E,	 
    SAMPLER_3D = 0x8B5F,
    SAMPLER_CUBE = 0x8B60,
    SAMPLER_2D_SHADOW = 0x8B62,
    SAMPLER_2D_ARRAY = 0x8DC1,
    SAMPLER_2D_ARRAY_SHADOW = 0x8DC4,
    SAMPLER_CUBE_SHADOW = 0x8DC5
}

type UniformValue = number | Float32List | Uint32List | Int32List | Texture;

type UniformProperties = {
    srcOffset?: number;
    srcLength?: number;
    transpose?: boolean;
}

type Uniform = {
    value: UniformValue;
    props?: UniformProperties;
}

type UniformsList = {
    [name: string]: Uniform
};

type UniformSetter = {
    type: UniformType;
    set: (value: any) => void;
}

type UniformsListSetter = {
    setters: {
        [name: string]: UniformSetter | null;
    };
    program: Program;
}

class WebGLUniformUtilities {

    static getUniformValueByteLength(uniformValue: UniformValue): number {
        if (typeof uniformValue === "object") {
            if ("buffer" in uniformValue) {
                return uniformValue.byteLength;
            }
            else if ("unit" in uniformValue) {
                return 32;
            }
            else {
                return uniformValue.length * 32;
            }
        }
        return 32;
    }

    static getUniformValueArrayBufferView(uniformValue: UniformValue): ArrayBufferView {
        if (typeof uniformValue === "object") {
            if ("buffer" in uniformValue) {
                return uniformValue;
            }
            else if ("unit" in uniformValue) {
                return new Float32Array(uniformValue.unit);
            }
            else {
                return new Float32Array(uniformValue);
            }
        }
        return new Float32Array([uniformValue]);
    }

    static getUniformSetter(gl: WebGL2RenderingContext, uniform: Uniform, location: WebGLUniformLocation , uniformType: UniformType): UniformSetter | null { 
        const uniformValue = uniform.value;
        const uniformProps = (typeof uniform.props === "undefined") ? {
            srcOffset: undefined,
            srcLength: undefined,
            transpose: false
        } : {
            srcOffset: uniform.props.srcOffset || undefined,
            srcLength: uniform.props.srcLength || undefined,
            transpose: uniform.props.transpose || false    
        };

        switch (uniformType) {
            case UniformType.FLOAT:
                if (typeof uniformValue === "number") {
                    return {
                        type: uniformType,
                        set: (num: number) => {
                            gl.uniform1f(location, num);
                        }
                    };
                }
                break;
            case UniformType.UNSIGNED_INT:
                if (typeof uniformValue === "number") {
                    return {
                        type: uniformType,
                        set: (num: number) => {
                            gl.uniform1ui(location, num);
                        }
                    };
                }
                break;
            case UniformType.BOOL:
            case UniformType.INT:
                if (typeof uniformValue === "number") {
                    return {
                        type: uniformType,
                        set: (num: number) => {
                            gl.uniform1i(location, num);
                        }
                    };
                }
                break;
            case UniformType.INT_SAMPLER_2D:
            case UniformType.INT_SAMPLER_2D_ARRAY:
            case UniformType.INT_SAMPLER_3D:
            case UniformType.INT_SAMPLER_CUBE:
            case UniformType.SAMPLER_2D:
            case UniformType.SAMPLER_3D:
            case UniformType.SAMPLER_CUBE:
            case UniformType.SAMPLER_2D_SHADOW:
            case UniformType.SAMPLER_2D_ARRAY:
            case UniformType.SAMPLER_2D_ARRAY_SHADOW:
            case UniformType.SAMPLER_CUBE_SHADOW:
            case UniformType.UNSIGNED_INT_SAMPLER_2D:
            case UniformType.UNSIGNED_INT_SAMPLER_3D:
            case UniformType.UNSIGNED_INT_SAMPLER_CUBE:
            case UniformType.UNSIGNED_INT_SAMPLER_2D_ARRAY:
                if (typeof uniformValue !== "number" && "unit" in uniformValue) {
                    return {
                        type: uniformType,
                        set: (tex: Texture) => {
                            gl.activeTexture(gl.TEXTURE0 + tex.unit);
                            gl.bindTexture(tex.target, tex.internal);
                            gl.uniform1i(location, tex.unit);
                        }
                    };
                }
                else if (typeof uniformValue !== "number" && "unit" in uniformValue) {
                    return {
                        type: uniformType,
                        set: (tex: Texture) => {
                            gl.activeTexture(gl.TEXTURE0 + tex.unit);
                            gl.bindTexture(tex.target, tex.internal);
                            gl.uniform1i(location, tex.unit);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_VEC2:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniform2fv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.BOOL_VEC2:
            case UniformType.INT_VEC2:
                if (uniformValue instanceof Int32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Int32List) => {
                            gl.uniform2iv(location, list);
                        }
                    };
                }
                break;
            case UniformType.UNSIGNED_INT_VEC2:
                if (uniformValue instanceof Uint32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Uint32List) => {
                            gl.uniform2uiv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_VEC3:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniform3fv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.BOOL_VEC3:
            case UniformType.INT_VEC3:	
                if (uniformValue instanceof Int32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Int32List) => {
                            gl.uniform3iv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.UNSIGNED_INT_VEC3:
                if (uniformValue instanceof Uint32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Uint32List) => {
                            gl.uniform3uiv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_VEC4:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniform4fv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.BOOL_VEC4:
            case UniformType.INT_VEC4:
                if (uniformValue instanceof Int32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Int32List) => {
                            gl.uniform4iv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.UNSIGNED_INT_VEC4:
                if (uniformValue instanceof Uint32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Uint32List) => {
                            gl.uniform4uiv(location, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT2:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix2fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT3:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix3fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT4:	
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix4fv(location, uniformProps.transpose, list);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT2x3:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix2x3fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT2x4:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix2x4fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT3x2:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix3x2fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT3x4:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix3x4fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT4x2:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix4x2fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
            case UniformType.FLOAT_MAT4x3:
                if (uniformValue instanceof Float32Array || Array.isArray(uniformValue)) {
                    return {
                        type: uniformType,
                        set: (list: Float32List) => {
                            gl.uniformMatrix4x3fv(location, uniformProps.transpose, list, uniformProps.srcOffset, uniformProps.srcLength);
                        }
                    };
                }
                break;
        }

        return null;
    }

    static getUniformsListSetter(gl: WebGL2RenderingContext, program: Program, list: UniformsList): UniformsListSetter | null {
        const settersList = {
            setters: {}
        } as UniformsListSetter;
        
        const uniformsNames = Object.keys(list);
        const uniformIndices = gl.getUniformIndices(program.internal, uniformsNames);
        if (uniformIndices == null) {
            console.error(`Uniform indices for ${uniformsNames} could not be found.`);
            return null;
        }

        const uniformsTypes = gl.getActiveUniforms(program.internal, uniformIndices, gl.UNIFORM_TYPE);
        uniformsNames.forEach((uniformName, uniformIndex) => {
            const uniform = list[uniformName];

            const location = gl.getUniformLocation(program.internal, uniformName);
            if (location == null) {
                console.error(`Uniform ${uniformName} could not be located.`);
                return null;
            }

            settersList.setters[uniformName] = this.getUniformSetter(gl, uniform, location, uniformsTypes[uniformIndex]);
        });
        
        settersList.program = program;

        return settersList;
    }

    static setUniformsListValues(gl: WebGL2RenderingContext, setter: UniformsListSetter, list: UniformsList): void {
        WebGLProgramUtilities.useProgram(gl, setter.program);
        
        Object.keys(list).forEach((name) => {
            const uniformSetter = setter.setters[name];
            const uniform = list[name];
            if (uniformSetter) {
                uniformSetter.set(uniform.value);
            }
            else {
                console.warn(`Uniform ${name} does not match any of the given setters.`);
            }
        });
    }
}