import { AttributesList } from "../../webgl/WebGLAttributeUtilities";
import { Identifiable, UUID, UUIDGenerator } from "engine/libs/maths/statistics/random/UUIDGenerator";
import { ArraySections } from "engine/libs/structures/arrays/ArraySection";

export { VAO };
export { VAOBase };

type VAOCtor<U extends VAOBase, R extends List<Identifiable> = List<Identifiable>> = new(references: R) => U;

interface VAO<L extends AttributesList = AttributesList> {
    readonly name: string;
    readonly uuid: UUID;
    
    enableDeltaSubscriptions(): void;
    disableDeltaSubscriptions(): void;
    getAttributeValues(): L;
    getDeltaAttributeValues(): RecursivePartial<L> | null;
}

abstract class VAOBase<R extends List<Identifiable> = List<Identifiable>, L extends AttributesList = AttributesList> implements VAO<L> {

    public readonly uuid: UUID;
    public readonly name: string;
    
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

    public abstract getAttributeValues(): L;
    public abstract getDeltaAttributeValues(): RecursivePartial<L> | null;

    public abstract enableDeltaSubscriptions(): void;
    public abstract disableDeltaSubscriptions(): void;

    private static _dictionary: Map<string, VAOBase<any>> = new Map<string, VAOBase<any>>();
    
    protected static getReferencesHash<R extends List<Identifiable>>(references: R): string {
        return Object.keys(references).reduce((prev: string, curr: string) => {
            return references[prev].uuid + references[curr].uuid;
        });
    }

    public static getConcreteInstance<V extends VAOBase, R extends List<Identifiable>>(ctor: VAOCtor<V, R>, references: R): V {
        const hash = VAOBase.getReferencesHash(references);
        let ref = VAOBase._dictionary.get(hash);
        if (typeof ref === 'undefined') {
            ref = new ctor(references);
            VAOBase._dictionary.set(hash, ref);
        }
        return ref as V;
    }
}