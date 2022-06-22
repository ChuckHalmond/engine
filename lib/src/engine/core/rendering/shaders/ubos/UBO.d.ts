import { UUID, Identifiable } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { Flags } from "../../../../libs/patterns/flags/Flags";
import { UniformsList } from "../../webgl/WebGLUniformUtilities";
export { UBO };
export { UBOBase };
interface UBO<L extends UniformsList = UniformsList> {
    readonly uuid: UUID;
    readonly name: string;
    subscribeReferences(): void;
    unsubscribeReferences(): void;
    getUniformValues(): L;
    getDeltaUniformValues(): Partial<L> | null;
}
declare type UBOCtor<U extends UBOBase, R extends {
    [key: string]: Identifiable;
} = {
    [key: string]: Identifiable;
}> = new (references: R) => U;
declare abstract class UBOBase<R extends {
    [key: string]: Identifiable;
} = {
    [key: string]: Identifiable;
}, L extends UniformsList = UniformsList> implements UBO<L> {
    readonly name: string;
    readonly uuid: UUID;
    protected _references: R;
    protected _subscriptions?: Array<(message: any) => void>;
    protected _deltaFlags?: Flags;
    constructor(name: string, references: R);
    private static _dictionary;
    abstract subscribeReferences(): void;
    abstract unsubscribeReferences(): void;
    abstract getUniformValues(): L;
    abstract getDeltaUniformValues(): Partial<L> | null;
    protected static getReferencesHash<R extends {
        [key: string]: Identifiable;
    }>(references: R): string;
    protected static getConcreteInstance<U extends UBOBase, R extends {
        [key: string]: Identifiable;
    }>(ctor: UBOCtor<U, R>, references: R): U;
}
