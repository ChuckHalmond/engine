import { Identifiable, UUID, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { ArraySections } from "../../../../libs/structures/arrays/ArraySection";
import { VertexArray } from "../../webgl/WebGLVertexArrayUtilities";

export { VAO };
export { VAOBase };

type VAOCtor<U extends VAOBase, R extends {[key: string]: Identifiable} = {[key: string]: Identifiable}> = new(references: R) => U;

interface VAO<L extends VertexArray = VertexArray> {
    readonly name: string;
    readonly uuid: UUID;
    
    enableDeltaSubscriptions(): void;
    disableDeltaSubscriptions(): void;
    getAttributeValues(): L;
    getDeltaAttributeValues(): RecursivePartial<L> | null;
}

abstract class VAOBase<R extends {[key: string]: Identifiable} = {[key: string]: Identifiable}, L extends VertexArray = VertexArray> implements VAO<L> {

    readonly uuid: UUID;
    readonly name: string;
    
    protected _references: R;
    protected _values: L;
    protected _deltaSubscriptions?: Array<(message: any) => void>;
    protected _deltaSections?: ArraySections;

    protected constructor(name: string, references: R) {
        this.uuid = UUIDGenerator.newUUID();
        this.name = name;
        this._references = references;
        this._values = {} as L;
    }

    abstract getAttributeValues(): L;
    abstract getDeltaAttributeValues(): RecursivePartial<L> | null;

    abstract enableDeltaSubscriptions(): void;
    abstract disableDeltaSubscriptions(): void;

    private static _dictionary: Map<string, VAOBase<any>> = new Map<string, VAOBase<any>>();
    
    protected static getReferencesHash<R extends {[key: string]: Identifiable}>(references: R): string {
        return Object.keys(references).reduce((prev: string, curr: string) => {
            return references[prev].uuid + references[curr].uuid;
        });
    }

    static getConcreteInstance<V extends VAOBase, R extends {[key: string]: Identifiable}>(ctor: VAOCtor<V, R>, references: R): V {
        const hash = VAOBase.getReferencesHash(references);
        let ref = VAOBase._dictionary.get(hash);
        if (typeof ref === 'undefined') {
            ref = new ctor(references);
            VAOBase._dictionary.set(hash, ref);
        }
        return ref as V;
    }
}