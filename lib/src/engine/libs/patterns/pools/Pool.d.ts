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
    acquireTemp<N extends number>(n: N, func: SplittedTupleFunction<O, N, void>): void;
    acquire(): O;
    release(n: number): void;
    extend(n: number): void;
    clear(): void;
    setAutoExtendPolicy(autoExtendPolicy: PoolAutoExtendPolicy): void;
}
declare abstract class PoolBase<O extends object = object> implements Pool<O> {
    protected _ctor: Constructor<O>;
    protected _autoExtendPolicy: PoolAutoExtendPolicy;
    protected _autoExtendTicks: number;
    protected _autoExtend: (() => void);
    protected constructor(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy);
    get ctor(): Constructor<O>;
    get autoExtendPolicy(): PoolAutoExtendPolicy;
    setAutoExtendPolicy(autoExtendPolicy: PoolAutoExtendPolicy): void;
    protected getAutoExtendFunction(autoExtdPolicy: PoolAutoExtendPolicy): () => void;
    abstract acquireTemp<N extends number>(n: N, func: SplittedTupleFunction<O, N, void>): void;
    abstract acquire(): O;
    abstract release(n: number): void;
    abstract extend(n: number): void;
    abstract clear(): void;
}
