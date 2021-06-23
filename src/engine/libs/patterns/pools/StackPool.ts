import { PoolAutoExtendPolicy, PoolBase, Pool } from "./Pool";

export { StackPool };
export { StackPoolBase };

interface StackPool<O extends object = object> extends Pool<O> {}

interface StackPoolConstructor {
    readonly prototype: StackPool;
    new<O extends object, C extends Constructor<O>>(constructor: C, options?: {args?: ConstructorParameters<C>, policy?: PoolAutoExtendPolicy, size?: number}): StackPool<O>;
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
    
    public acquireTemp<N extends number>(n: N, func: (...args: O[]) => void): void {
        const top = this._top;
        const target = top + n;
        const obj = this._objects;

        while (obj.length < target) {
            this._autoExtend();
        }
        this._top = target;
        
        switch (n) {
            case 1:
                func(obj[top]);
                break;
            case 2:
                func(obj[top], obj[top + 1]);
                break;
            case 3:
                func(obj[top], obj[top + 1], obj[top + 2]);
                break;
            case 4:
                func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3]);
                break;
            case 5:
                func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4]);
                break;
            case 6:
                func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4], obj[top + 5]);
                break;
            case 7:
                func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4], obj[top + 5], obj[top + 6]);
                break;
            case 8:
                func(obj[top], obj[top + 1], obj[top + 2], obj[top + 3], obj[top + 4], obj[top + 5], obj[top + 6], obj[top + 7]);
                break;
            default:
                func(...obj.slice(top, top + n));
                break;
        };

        this._top = top;
    }
    
    public acquire(): O {
        if (this._top + 1 > this._objects.length) {
            this._autoExtend();
        }
        
        return this._objects[this._top++];
    }
    
    public release(n: number): void {
        const target = this._top - n;
        if (target > 0) {
            this._top = target;
        }
        else {
            this._top = 0;
        }
    }

    public extend(n: number): void {
        this._objects.push(...Array(n).fill(0).map(() => {
            return new this.ctor();
        }));
    }
    
    public clear(): void {
        this._objects = [];
        this._top = 0;
        this._autoExtendTicks = 0;
    }
}

const StackPool: StackPoolConstructor = StackPoolBase;