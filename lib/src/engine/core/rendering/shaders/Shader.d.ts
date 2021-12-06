import { Resources } from "../../../resources/Resources";
export { ShaderType };
export { Shader };
declare enum ShaderType {
    FRAGMENT_SHADER = 0,
    VERTEX_SHADER = 1
}
interface ShaderConstructor {
    readonly prototype: Shader;
    new (args: {
        name: string;
        vertex: string;
        fragment: string;
    }): Shader;
}
interface Shader {
    readonly name: string;
    readonly vertex: string;
    readonly fragment: string;
    setDefinition(shader: Shader, sourceType: ShaderType, definitionName: string, definitionValue: number): Shader;
    resolveIncludes(shader: Shader, sourceType: ShaderType, resources: Resources): void;
    getUniformBlockIndex(shader: Shader, sourceType: ShaderType, blockName: string): number | null;
    replaceInSource(shader: Shader, sourceType: ShaderType, oldStr: string, newStr: string): void;
    prependToSource(shader: Shader, sourceType: ShaderType, str: string): void;
    getSource(type: ShaderType): string;
}
declare const Shader: ShaderConstructor;
