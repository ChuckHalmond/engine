export { PoolAutoExtendPolicy };
export { Pool };
export { PoolBase };

enum PoolAutoExtendPolicy {
    NO_AUTO_EXTEND,
    AUTO_EXTEND_ONE,
    AUTO_EXTEND_POW2
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

abstract class PoolBase<O extends object = object> implements Pool<O> {
    protected _ctor: Constructor<O>;
    protected _autoExtendPolicy: PoolAutoExtendPolicy;
    protected _autoExtendTicks: number;
    protected _autoExtend: (() => void);

    protected constructor(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy) {
        this._ctor = constructor;
        this._autoExtendPolicy = policy || PoolAutoExtendPolicy.AUTO_EXTEND_ONE;
        this._autoExtendTicks = 0;
        this._autoExtend = this.getAutoExtendFunction(this._autoExtendPolicy);
    }

    public get ctor(): Constructor<O> {
        return this._ctor;
    }

    public get autoExtendPolicy(): PoolAutoExtendPolicy {
        return this._autoExtendPolicy;
    }

    public setAutoExtendPolicy(autoExtendPolicy: PoolAutoExtendPolicy): void {
        this._autoExtendPolicy = autoExtendPolicy;
        this._autoExtend = this.getAutoExtendFunction(this._autoExtendPolicy);
    }

    protected getAutoExtendFunction(autoExtdPolicy: PoolAutoExtendPolicy): () => void {
        switch (autoExtdPolicy) {
            case PoolAutoExtendPolicy.NO_AUTO_EXTEND:
                return () => {
                    this._autoExtendTicks++;
                    return;
                }
            case PoolAutoExtendPolicy.AUTO_EXTEND_ONE:
                return () => {
                    this.extend(1);
                    this._autoExtendTicks++;
                }
            case PoolAutoExtendPolicy.AUTO_EXTEND_POW2:
                return () => {
                    this.extend(Math.pow(2, this._autoExtendTicks));
                    this._autoExtendTicks++;
                }
        }
    }

    public abstract acquireTemp<N extends number>(n: N, func: SplittedTupleFunction<O, N, void>): void;
    public abstract acquire(): O;
    public abstract release(n: number): void;
    public abstract extend(n: number): void;
    public abstract clear(): void;
}