import { PoolAutoExtendPolicy, PoolBase, Pool } from "./Pool";
export { StackPool };
export { StackPoolBase };
interface StackPool<O extends object = object> extends Pool<O> {
}
interface StackPoolConstructor {
    readonly prototype: StackPool;
    new <O extends object, C extends Constructor<O>>(constructor: C, options?: {
        args?: ConstructorParameters<C>;
        policy?: PoolAutoExtendPolicy;
        size?: number;
    }): StackPool<O>;
}
declare class StackPoolBase<O extends object = object> extends PoolBase<O> implements Pool<O> {
    private _objects;
    private _top;
    constructor(constructor: Constructor<O>, options?: {
        args?: any;
        policy?: PoolAutoExtendPolicy;
        size?: number;
    });
    acquireTemp<N extends number>(n: N, func: (...args: O[]) => void): void;
    acquire(): O;
    release(n: number): void;
    extend(n: number): void;
    clear(): void;
}
declare const StackPool: StackPoolConstructor;
