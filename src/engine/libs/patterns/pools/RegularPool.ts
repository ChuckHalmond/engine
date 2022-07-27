import { PoolAutoExtendPolicy, Pool } from "./Pool";

export { RegularPool };

interface RegularPool<O extends object = object> extends Pool<O> {
    release(...objects: O[]): void;
}

interface RegularPoolConstructor {
    readonly prototype: RegularPool;
    new<O extends object>(constructor: Constructor<O>, options?: {args?: ConstructorParameters<Constructor<O>>, policy?: PoolAutoExtendPolicy, size?: number}): RegularPool<O>;
}

class RegularPoolBase<O extends object = object> extends Pool<O> implements RegularPool<O> {
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

    release(...objects: O[]): void {
        objects.forEach((object) => {});
    }

    extend(count: number): void {
        this.objects.push(...Array(count).fill(0).map(() => {
            return new this.ctor();
        }));
    }
}

var RegularPool: RegularPoolConstructor = RegularPoolBase;