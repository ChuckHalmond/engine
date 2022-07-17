import { UUID, Identifiable, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";
import { Flags } from "../../../../libs/patterns/flags/Flags";
import { Uniform } from "../../webgl/WebGLUniformUtilities";

export { UBO };
export { UBOBase };

interface UBO<L extends Record<string, Uniform> = Record<string, Uniform>> {
    readonly uuid: UUID;
    readonly name: string;
    subscribeReferences(): void;
    unsubscribeReferences(): void;
    getUniformValues(): L;
    getDeltaUniformValues(): Partial<L> | null;
}

type UBOCtor<U extends UBOBase, R extends {[key: string]: Identifiable} = {[key: string]: Identifiable}> = new(references: R) => U;

abstract class UBOBase<R extends {[key: string]: Identifiable} = {[key: string]: Identifiable}, L extends Record<string, Uniform> = Record<string, Uniform>> implements UBO<L> {
    
    readonly name: string;
    readonly uuid: UUID;
    
    protected _references: R;
    protected _subscriptions?: Array<(message: any) => void>;
    protected _deltaFlags?: Flags;

    constructor(name: string, references: R) {
        this.name = name;
        this._references = references;
        this.uuid = UUIDGenerator.newUUID();
    }

    private static _dictionary: Map<string, UBOBase<any>> = new Map<string, UBOBase<any>>();

    abstract subscribeReferences(): void;
    abstract unsubscribeReferences(): void;
    abstract getUniformValues(): L;
    abstract getDeltaUniformValues(): Partial<L> | null;

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