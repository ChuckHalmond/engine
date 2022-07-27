export { PoolAutoExtendPolicy };
export { Pool };
export { PoolBase };

enum PoolAutoExtendPolicy {
    NO_AUTO_EXTEND = 0,
    AUTO_EXTEND_ONE = 1,
    AUTO_EXTEND_POW2 = 2
}

interface PoolConstructor {
    readonly prototype: Pool;
    new<O extends object>(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy): Pool<O>;
}

interface Pool<O extends object = object> {
    readonly ctor: Constructor<O>;
    readonly autoExtendPolicy: PoolAutoExtendPolicy;
    autoExtend(): void;
    acquire(count: number): O[];
    release(...args: any[]): void;
    extend(count: number): void;
    clear(): void;
}

class PoolBase<O extends object = object> implements Pool<O> {
    readonly ctor: Constructor<O>;
    autoExtendPolicy: PoolAutoExtendPolicy;
    autoExtendTicks: number;

    constructor(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy) {
        this.ctor = constructor;
        this.autoExtendPolicy = policy || PoolAutoExtendPolicy.AUTO_EXTEND_ONE;
        this.autoExtendTicks = 0;
    }

    autoExtend(): void {
        switch (this.autoExtendPolicy) {
            case PoolAutoExtendPolicy.AUTO_EXTEND_ONE:
                this.extend(1);
                break;
            case PoolAutoExtendPolicy.AUTO_EXTEND_POW2:
                this.extend(Math.pow(2, this.autoExtendTicks));
                break;
        }
        this.autoExtendTicks++;
    }

    acquire(count: number): O[] {
        throw new Error("Not implemented");
    }

    release(...args: any[]): void {
        throw new Error("Not implemented");
    }

    extend(count: number): void {
        throw new Error("Not implemented");
    }

    clear(): void {
        throw new Error("Not implemented");
    }
}

var Pool: PoolConstructor = PoolBase;