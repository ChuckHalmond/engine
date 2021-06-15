import { UniformType, UniformQuery, TextureUnits } from "./WebGLConstants";
import { Texture } from "./WebGLTextureUtilities";

export { UniformValue };
export { UniformProperties };
export { Uniform };
export { UniformsList };
export { UniformSetter };
export { UniformsSettersList };
export { WebGLUniformUtilities };

type UniformValue = number | Float32List | Uint32List | Int32List | Texture;

type UniformProperties = {
    srcOffset?: number;
    srcLength?: number;
    transpose?: boolean;
}

type Uniform<V extends UniformValue = UniformValue> = {
    value: V;
    props?: UniformProperties;
}

type UniformsList = List<Uniform>;

type UniformSetter = {
    type: UniformType;
    func: (value: any) => void;
}

type UniformsSettersList = {
    setters: List<UniformSetter | null>;
    glProg: WebGLProgram;
}

class WebGLUniformUtilities {

    private constructor() {}

    public static getUniformValueArrayBufferView(uniformValue: UniformValue): ArrayBufferView {
        if (typeof uniformValue === 'number') {
            return new Float32Array([uniformValue]);
        }
        else if ('unit' in uniformValue) {
            return new Float32Array(uniformValue.unit);
        }
        else if (Array.isArray(uniformValue)) {
            return new Float32Array(uniformValue);
        }
        else {
            return uniformValue;
        }
    }

    public static getUniformsListSetter(gl: WebGL2RenderingContext, glProg: WebGLProgram, list: UniformsList): UniformsSettersList {
        
        let settersList = {
            setters: {}
        } as UniformsSettersList;
        
        for (const name in list) {
            const uniform = list[name];

            const setter = this.getUniformSetter(gl, glProg, name, uniform);
            settersList.setters[name] = setter;
        }

        settersList.glProg = glProg;

        return settersList;
    }

    public static setUniformsListValues(gl: WebGL2RenderingContext, settersList: UniformsSettersList, list: UniformsList): void {

        for (const name in list) {
            const uniform = list[name];
            const setter = settersList.setters[name];

            if (setter == null) {
                continue;
            }
            
            if (typeof setter !== 'undefined') {
                setter.func(uniform.value);
            }
            else {
                console.warn(`Uniform ${name} does not match with the given setters.`);
            }
        }
    }

    public static isTexture(uniformValue: UniformValue): boolean {
        return (typeof uniformValue !== 'number' && 'unit' in uniformValue);
    }

    public static getUniformSetter(gl: WebGL2RenderingContext,
        glProg: WebGLProgram,
        uniformName: string,
        uniform: Uniform): UniformSetter | null {
        
        const location = gl.getUniformLocation(glProg, uniformName);
        if (location == null) {
            console.error(`Uniform ${uniformName} could not be located.`);
            return null;
        }

        const uniformIndices = gl.getUniformIndices(glProg, [uniformName]);
        if (uniformIndices == null) {
            console.error(`Uniform ${uniformName} could not be found.`);
            return null;
        }

        const uniformType = gl.getActiveUniforms(glProg, uniformIndices, UniformQuery.UNIFORM_TYPE)[0];
        
        const value = uniform.value;
        const props = (typeof uniform.props === 'undefined') ? {
            srcOffset: undefined,
            srcLength: undefined,
            transpose: false
        } : {
            srcOffset: uniform.props.srcOffset || undefined,
            srcLength: uniform.props.srcLength || undefined,
            transpose: uniform.props.transpose || false    
        };

        const uniformTypeWarning = (uniformType: UniformType, valueType: string) => {
            console.warn(`Uniform ${uniformName} of type ${UniformType[uniformType]} should have a value of type ${valueType}`);
        }

        switch (uniformType) {
            case UniformType.FLOAT:
                if (typeof value === 'number') {
                    return {
                        type: uniformType,
                        func: (num: number) => {
                            gl.uniform1f(location, num);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'number');
                }
                break;
            case UniformType.UNSIGNED_INT:
                if (typeof value === 'number') {
                    return {
                        type: uniformType,
                        func: (num: number) => {
                            gl.uniform1ui(location, num);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'number');
                }
                break;
            case UniformType.BOOL:
            case UniformType.INT:
                if (typeof value === 'number') {
                    return {
                        type: uniformType,
                        func: (num: number) => {
                            gl.uniform1i(location, num);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'number');
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
                if (typeof value !== 'number' && 'unit' in value) {
                    return {
                        type: uniformType,
                        func: (tex: Texture) => {
                            gl.activeTexture(TextureUnits.TEXTURE0 + tex.unit);
                            gl.bindTexture(tex.target, tex.glTex);
                            gl.uniform1i(location, tex.unit);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'TextureSetter');
                }
                break;
            case UniformType.FLOAT_VEC2:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Float32List) => {
                            gl.uniform2fv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.BOOL_VEC2:
            case UniformType.INT_VEC2:
                if (value instanceof Int32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Int32List) => {
                            gl.uniform2iv(location, vec);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Int32List');
                }
                break;
            case UniformType.UNSIGNED_INT_VEC2:
                if (value instanceof Uint32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Uint32List) => {
                            gl.uniform2uiv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Uint32List');
                }
                break;
            case UniformType.FLOAT_VEC3:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Float32List) => {
                            gl.uniform3fv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.BOOL_VEC3:
            case UniformType.INT_VEC3:	
                if (value instanceof Int32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Int32List) => {
                            gl.uniform3iv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Int32List');
                }
                break;
            case UniformType.UNSIGNED_INT_VEC3:
                if (value instanceof Uint32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Uint32List) => {
                            gl.uniform3uiv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Uint32List');
                }
                break;
            case UniformType.FLOAT_VEC4:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Float32List) => {
                            gl.uniform4fv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.BOOL_VEC4:
            case UniformType.INT_VEC4:
                if (value instanceof Int32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Int32List) => {
                            gl.uniform4iv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Int32List');
                }
                break;
            case UniformType.UNSIGNED_INT_VEC4:
                if (value instanceof Uint32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (vec: Uint32List) => {
                            gl.uniform4uiv(location, vec, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Uint32List');
                }
                break;
            case UniformType.FLOAT_MAT2:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix2fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT3:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix3fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT4:	
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix4fv(location, props.transpose, mat);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT2x3:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix2x3fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT2x4:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix2x4fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT3x2:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix3x2fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT3x4:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix3x4fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT4x2:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix4x2fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
            case UniformType.FLOAT_MAT4x3:
                if (value instanceof Float32Array || Array.isArray(value)) {
                    return {
                        type: uniformType,
                        func: (mat: Float32List) => {
                            gl.uniformMatrix4x3fv(location, props.transpose, mat, props.srcOffset, props.srcLength);
                        }
                    };
                }
                else {
                    uniformTypeWarning(uniformType, 'Float32List');
                }
                break;
        }

        console.error(`Uniform ${uniformName} has an unknown type.`);

        return null;
    }
}