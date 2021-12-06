import { Identifiable, UUID } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { ArraySections } from "../../../../libs/structures/arrays/ArraySection";
import { AttributesList } from "../../webgl/WebGLAttributeUtilities";
export { VAO };
export { VAOBase };
declare type VAOCtor<U extends VAOBase, R extends List<Identifiable> = List<Identifiable>> = new (references: R) => U;
interface VAO<L extends AttributesList = AttributesList> {
    readonly name: string;
    readonly uuid: UUID;
    enableDeltaSubscriptions(): void;
    disableDeltaSubscriptions(): void;
    getAttributeValues(): L;
    getDeltaAttributeValues(): RecursivePartial<L> | null;
}
declare abstract class VAOBase<R extends List<Identifiable> = List<Identifiable>, L extends AttributesList = AttributesList> implements VAO<L> {
    readonly uuid: UUID;
    readonly name: string;
    protected _references: R;
    protected _values: L;
    protected _deltaSubscriptions?: Array<(message: any) => void>;
    protected _deltaSections?: ArraySections;
    protected constructor(name: string, references: R);
    abstract getAttributeValues(): L;
    abstract getDeltaAttributeValues(): RecursivePartial<L> | null;
    abstract enableDeltaSubscriptions(): void;
    abstract disableDeltaSubscriptions(): void;
    private static _dictionary;
    protected static getReferencesHash<R extends List<Identifiable>>(references: R): string;
    static getConcreteInstance<V extends VAOBase, R extends List<Identifiable>>(ctor: VAOCtor<V, R>, references: R): V;
}
