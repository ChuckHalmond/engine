import { PoolAutoExtendPolicy, Pool } from "./Pool";
export { StackPool };
interface StackPool<O extends object = object> extends Pool<O> {
    release(count: number): void;
}
interface StackPoolConstructor {
    readonly prototype: StackPool;
    new <O extends object>(constructor: Constructor<O>, options?: {
        args?: ConstructorParameters<Constructor<O>>;
        policy?: PoolAutoExtendPolicy;
        size?: number;
    }): StackPool<O>;
}
declare var StackPool: StackPoolConstructor;
