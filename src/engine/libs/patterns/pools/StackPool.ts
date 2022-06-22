import { PoolAutoExtendPolicy, PoolBase, Pool } from "./Pool";

export { StackPool };

interface StackPool<O extends object = object> extends Pool<O> {
    
}

interface StackPoolConstructor {
    readonly prototype: StackPool;
    new<O extends object>(constructor: Constructor<O>, options?: {args?: ConstructorParameters<Constructor<O>>, policy?: PoolAutoExtendPolicy, size?: number}): StackPool<O>;
}

class StackPoolBase<O extends object = object> extends PoolBase<O> implements Pool<O> {
    private _objects: Array<O>;
    private _top: number;

    constructor(constructor: Constructor<O>, options?: {args?: any, policy?: PoolAutoExtendPolicy, size?: number}) {
        super(constructor, options?.policy);
        this._objects = Array(options?.size || 0).fill(0).map(() => {
            return new this.ctor(options?.args);
        });
        this._top = 0;
    }
    
    public acquire(count: number): O[] {
        const top = this._top;
        const target = top + count;

        if (this._autoExtendPolicy) {
            while (this._objects.length < target) {
                this.autoExtend();
            }
        }
        this._top = target;
        
        return this._objects.slice(top, target);
    }

    public release(count: number): void {
        const top = this._top;
        if (count > top) {
            console.warn("Releasing under zero.");
        }
        this._top = Math.max(top - count, 0);
    }

    public extend(count: number): void {
        this._objects.push(...Array(count).fill(0).map(() => {
            return new this.ctor();
        }));
    }
    
    public clear(): void {
        this._objects = [];
        this._top = 0;
        this._autoExtendTicks = 0;
    }
}

var StackPool: StackPoolConstructor = StackPoolBase;