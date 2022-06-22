export { PoolAutoExtendPolicy };
export { Pool };
export { PoolBase };

enum PoolAutoExtendPolicy {
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

abstract class PoolBase<O extends object = object> implements Pool<O> {
    protected _ctor: Constructor<O>;
    protected _autoExtendPolicy: PoolAutoExtendPolicy;
    protected _autoExtendTicks: number;

    protected constructor(constructor: Constructor<O>, policy?: PoolAutoExtendPolicy) {
        this._ctor = constructor;
        this._autoExtendPolicy = policy || PoolAutoExtendPolicy.AUTO_EXTEND_ONE;
        this._autoExtendTicks = 0;
    }

    public get ctor(): Constructor<O> {
        return this._ctor;
    }

    public get autoExtendPolicy(): PoolAutoExtendPolicy {
        return this._autoExtendPolicy;
    }

    public autoExtend(): void {
        switch (this._autoExtendPolicy) {
            case PoolAutoExtendPolicy.AUTO_EXTEND_ONE:
                this.extend(1);
                break;
            case PoolAutoExtendPolicy.AUTO_EXTEND_POW2:
                this.extend(Math.pow(2, this._autoExtendTicks));
                break;
        }
        this._autoExtendTicks++;
    }

    public abstract acquire(count: number): O[];
    public abstract release(count: number): void;
    public abstract extend(count: number): void;
    public abstract clear(): void;
}