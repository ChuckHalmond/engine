export { PoolAutoExtendPolicy };
export { Pool };
export { PoolBase };
declare enum PoolAutoExtendPolicy {
    NO_AUTO_EXTEND = 0,
    AUTO_EXTEND_ONE = 1,
    AUTO_EXTEND_POW2 = 2
}
interface Pool<O extends object = object> {
    readonly ctor: Constructor<O>;
    readonly autoExtendPolicy: PoolAutoExtendPolicy;
    acquire(count: number): O[];
    release(count: number): void;
    extend(count: number): void;
    clear(): void;
}
declare abstract class PoolBase<O extends object = object> implements Pool<O> {
    protected _ctor: Constructor<O>;
    protected _autoExtendPolicy: PoolAutoExtendPolicy;
    protected _autoExtendTicks: number;
    protected constructor(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy);
    get ctor(): Constructor<O>;
    get autoExtendPolicy(): PoolAutoExtendPolicy;
    autoExtend(): void;
    abstract acquire(count: number): O[];
    abstract release(count: number): void;
    abstract extend(count: number): void;
    abstract clear(): void;
}
