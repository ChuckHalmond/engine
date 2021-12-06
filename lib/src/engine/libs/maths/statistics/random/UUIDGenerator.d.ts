export { UUID };
export { Identifiable };
export { UUIDGeneratorBase };
export { UUIDGenerator };
declare type UUID = string;
interface Identifiable {
    readonly uuid: UUID;
}
interface UUIDGenerator {
    newUUID(): UUID;
}
declare class UUIDGeneratorBase {
    private _count;
    constructor();
    newUUID(): UUID;
}
declare const UUIDGenerator: UUIDGenerator;
