import { Resources } from "../../../resources/Resources";
import { Logger } from "../../logger/Logger";
import { ShadersLib } from "./ShadersLib";

export { ShaderType };
export { Shader };

enum ShaderType {
    FRAGMENT_SHADER,
    VERTEX_SHADER
}

interface ShaderConstructor {
    readonly prototype: Shader;
    new(args: {name: string, vertex: string, fragment: string}): Shader;
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

class DefaultShader implements Shader {
    public readonly name: string;
    private readonly __vertex: string;
    private readonly __fragment: string;

    public _vertex: string;
    public _fragment: string;

    private static _dictionnary = new Map<string, Shader>();

    constructor(args: {name: string, vertex: string, fragment: string}) {
        this.name = args.name;
        this._vertex = this.__vertex = args.vertex;
        this._fragment = this.__fragment = args.fragment;
        DefaultShader._dictionnary.set(this.name, this);
    }

    public get vertex(): string {
        return this._vertex;
    }

    public get fragment(): string {
        return this._fragment;
    }  

    public static get(name: string): Shader | undefined {
        return DefaultShader._dictionnary.get(name);
    }

    public setDefinition(shader: DefaultShader, sourceType: ShaderType, definitionName: string, definitionValue: number): DefaultShader {
        const definitionPattern = new RegExp(`#define ${definitionName} (.*?)\n`, 'gms');
        const shaderSource = shader.getSource(sourceType);

        let match: RegExpExecArray | null;

        if ((match = definitionPattern.exec(shaderSource)) !== null) {
            let definitionValueMatch = match[1];
            this.replaceInSource(shader, sourceType, definitionValueMatch, definitionValue.toString());
        }
        else {
            this.prependToSource(shader, sourceType, `#define ${definitionName} ${definitionValue}\n`);
        }

        return this;
    }

    public resolveIncludes(shader: DefaultShader, sourceType: ShaderType, resources: Resources): void {
        const includePattern = new RegExp('\/\/include+<(.*)+>', 'gm');
        const shaderSource = shader.getSource(sourceType);

        let match: RegExpExecArray | null;
        
        while ((match = includePattern.exec(shaderSource)) !== null) {
            let patternMatch = match[0];
            let includeMatch = match[1];

            let chunk = ShadersLib.chunks.get(includeMatch);
            if (chunk !== undefined) {
                const chunkSource = resources.get<string>(chunk);
                if (chunkSource) {
                    this.replaceInSource(shader, sourceType, patternMatch, chunkSource);
                }
            }
            else {
                Logger.info(`Shader chunk '${includeMatch}' is unknown!`);
            }
        }
    }

    public getUniformBlockIndex(shader: DefaultShader, sourceType: ShaderType, blockName: string): number | null {
        const uniformBlockPattern = new RegExp(`uniform ${blockName}`, 'gms');
        const shaderSource = shader.getSource(sourceType);

        let match: RegExpExecArray | null;

        if ((match = uniformBlockPattern.exec(shaderSource)) !== null) {
            return match.index;
        }

        Logger.info(`Block '${blockName}' is not present in shader '${shader.name}' !`);
        
        return null;
    }

    public replaceInSource(shader: DefaultShader, sourceType: ShaderType, oldStr: string, newStr: string): void {
        const shaderSource = shader.getSource(sourceType);
        shader._setSource(sourceType, shaderSource.replace(oldStr, newStr));
    }

    public prependToSource(shader: DefaultShader, sourceType: ShaderType, str: string): void {
        const shaderSource = shader.getSource(sourceType);
        shader._setSource(sourceType, str.concat(shaderSource));
    }

    public getSource(type: ShaderType): string {
        if (type == ShaderType.VERTEX_SHADER) {
            return this._vertex;
        }
        else {
            return this._fragment;
        }
    }

    private _setSource(type: ShaderType, value: string): void {
        if (type == ShaderType.VERTEX_SHADER) {
            this._vertex = value;
        }
        else {
            this._fragment = value;
        }
    }
}

const Shader: ShaderConstructor = DefaultShader;