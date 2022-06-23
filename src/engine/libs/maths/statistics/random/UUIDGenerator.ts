export { UUID };
export { Identifiable };
export { UUIDGeneratorBase };
export { UUIDGenerator };

type UUID = string;

interface Identifiable {
    readonly uuid: UUID;
}

interface UUIDGenerator {
    newUUID(): UUID;
}

class UUIDGeneratorBase {

    private _count: number;

    constructor() {
        this._count = 0
    }

    newUUID(): UUID {
        return (++this._count).toString(16);
    }
}

const UUIDGenerator: UUIDGenerator = new UUIDGeneratorBase();