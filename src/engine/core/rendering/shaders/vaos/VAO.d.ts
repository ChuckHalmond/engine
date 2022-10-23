import { Identifiable, UUID } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { ArraySections } from "../../../../libs/structures/arrays/ArraySection";
import { VertexArray } from "../../webgl/WebGLVertexArrayUtilities";
export { VAO };
export { VAOBase };
declare type VAOCtor<U extends VAOBase, R extends {
    [key: string]: Identifiable;
} = {
    [key: string]: Identifiable;
}> = new (references: R) => U;
interface VAO<L extends VertexArray = VertexArray> {
    readonly name: string;
    readonly uuid: UUID;
    enableDeltaSubscriptions(): void;
    disableDeltaSubscriptions(): void;
    getAttributeValues(): L;
    getDeltaAttributeValues(): RecursivePartial<L> | null;
}
declare abstract class VAOBase<R extends {
    [key: string]: Identifiable;
} = {
    [key: string]: Identifiable;
}, L extends VertexArray = VertexArray> implements VAO<L> {
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
    protected static getReferencesHash<R extends {
        [key: string]: Identifiable;
    }>(references: R): string;
    static getConcreteInstance<V extends VAOBase, R extends {
        [key: string]: Identifiable;
    }>(ctor: VAOCtor<V, R>, references: R): V;
}
