import { UUID, UUIDGenerator } from "engine/libs/maths/statistics/random/UUIDGenerator";

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
    public readonly isMaterial: true;
    public readonly uuid: UUID;
    public readonly name: string;

    protected _subscriptions!: Array<(message: any) => void>;

    constructor(name: string) {
        this.isMaterial = true;
        this.uuid = UUIDGenerator.newUUID();
        this.name = name;
    }

    public abstract copy(instance: Material<T>): Material<T>;
    public abstract clone(): Material<T>;
}