import { PoolAutoExtendPolicy, PoolBase, Pool } from "./Pool";

export { StackPool };

interface StackPool<O extends object = object> extends Pool<O> {
    release(count: number): void;
}

interface StackPoolConstructor {
    readonly prototype: StackPool;
    new<O extends object>(constructor: Constructor<O>, options?: {args?: ConstructorParameters<Constructor<O>>, policy?: PoolAutoExtendPolicy, size?: number}): StackPool<O>;
}

class StackPoolBase<O extends object = object> extends PoolBase<O> implements Pool<O> {
    objects: Array<O>;
    top: number;

    constructor(constructor: Constructor<O>, options?: {args?: any, policy?: PoolAutoExtendPolicy, size?: number}) {
        super(constructor, options?.policy);
        this.objects = new Array(options?.size || 0).fill(0).map(() => {
            return new this.ctor(options?.args);
        });
        this.top = 0;
    }
    
    acquire(count: number): O[] {
        const top = this.top;
        const target = top + count;

        if (this.autoExtendPolicy) {
            while (this.objects.length < target) {
                this.autoExtend();
            }
        }
        this.top = target;
        
        return this.objects.slice(top, target);
    }

    release(count: number): void {
        const top = this.top;
        if (count > top) {
            console.warn("Releasing under zero.");
        }
        this.top = Math.max(top - count, 0);
    }

    extend(count: number): void {
        this.objects.push(...Array(count).fill(0).map(() => {
            return new this.ctor();
        }));
    }
    
    clear(): void {
        this.objects = [];
        this.top = 0;
        this.autoExtendTicks = 0;
    }
}

var StackPool: StackPoolConstructor = StackPoolBase;