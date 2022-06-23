import { UUID, UUIDGenerator } from "../../../../libs/maths/statistics/random/UUIDGenerator";

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

function isMaterial(obj: any): obj is Material {
    return (obj as Material).isMaterial;
}

abstract class MaterialBase<T extends List = List> implements Material<T> {
    readonly isMaterial: true;
    readonly uuid: UUID;
    readonly name: string;

    protected _subscriptions!: Array<(message: any) => void>;

    constructor(name: string) {
        this.isMaterial = true;
        this.uuid = UUIDGenerator.newUUID();
        this.name = name;
    }

    abstract copy(instance: Material<T>): Material<T>;
    abstract clone(): Material<T>;
}