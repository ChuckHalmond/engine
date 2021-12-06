import { UUID } from "../../../../libs/maths/statistics/random/UUIDGenerator";
export { Material };
export { isMaterial };
export { MaterialBase };
interface Material<T extends List = List> {
    readonly isMaterial: true;
    readonly uuid: UUID;
    readonly name: string;
    copy(instance: Material<T>): Material<T>;
    clone(): Material<T>;
}
declare function isMaterial(obj: any): obj is Material;
declare abstract class MaterialBase<T extends List = List> implements Material<T> {
    readonly isMaterial: true;
    readonly uuid: UUID;
    readonly name: string;
    protected _subscriptions: Array<(message: any) => void>;
    constructor(name: string);
    abstract copy(instance: Material<T>): Material<T>;
    abstract clone(): Material<T>;
}
