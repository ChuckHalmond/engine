import { UUID, Identifiable, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
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

type UBOCtor<U extends UBOBase, R extends {[key: string]: Identifiable} = {[key: string]: Identifiable}> = new(references: R) => U;

abstract class UBOBase<R extends {[key: string]: Identifiable} = {[key: string]: Identifiable}, L extends UniformsList = UniformsList> implements UBO<L> {
    
    public readonly name: string;
    public readonly uuid: UUID;
    
    protected _references: R;
    protected _subscriptions?: Array<(message: any) => void>;
    protected _deltaFlags?: Flags;

    constructor(name: string, references: R) {
        this.name = name;
        this._references = references;
        this.uuid = UUIDGenerator.newUUID();
    }

    private static _dictionary: Map<string, UBOBase<any>> = new Map<string, UBOBase<any>>();

    public abstract subscribeReferences(): void;
    public abstract unsubscribeReferences(): void;
    public abstract getUniformValues(): L;
    public abstract getDeltaUniformValues(): Partial<L> | null;

    protected static getReferencesHash<R extends {[key: string]: Identifiable}>(references: R) {
        return Object.keys(references).reduce((prev: string, curr: string) => {
            return references[prev].uuid + references[curr].uuid;
        });
    }

    protected static getConcreteInstance<U extends UBOBase, R extends {[key: string]: Identifiable}>(ctor: UBOCtor<U, R>, references: R): U {
        const hash = UBOBase.getReferencesHash(references);
        let ref = UBOBase._dictionary.get(hash);
        if (typeof ref === 'undefined') {
            ref = new ctor(references);
            UBOBase._dictionary.set(hash, ref);
        }
        return ref as U;
    }
}