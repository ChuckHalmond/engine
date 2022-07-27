export { PoolAutoExtendPolicy };
export { Pool };
export { PoolBase };
declare enum PoolAutoExtendPolicy {
    NO_AUTO_EXTEND = 0,
    AUTO_EXTEND_ONE = 1,
    AUTO_EXTEND_POW2 = 2
}
interface PoolConstructor {
    readonly prototype: Pool;
    new <O extends object>(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy): Pool<O>;
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
declare class PoolBase<O extends object = object> implements Pool<O> {
    readonly ctor: Constructor<O>;
    autoExtendPolicy: PoolAutoExtendPolicy;
    autoExtendTicks: number;
    constructor(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy);
    autoExtend(): void;
    acquire(count: number): O[];
    release(...args: any[]): void;
    extend(count: number): void;
    clear(): void;
}
declare var Pool: PoolConstructor;
