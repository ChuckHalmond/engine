import { PoolAutoExtendPolicy, Pool } from "./Pool";
export { RegularPool };
interface RegularPool<O extends object = object> extends Pool<O> {
    release(...objects: O[]): void;
}
interface RegularPoolConstructor {
    readonly prototype: RegularPool;
    new <O extends object>(constructor: Constructor<O>, options?: {
        args?: ConstructorParameters<Constructor<O>>;
        policy?: PoolAutoExtendPolicy;
        size?: number;
    }): RegularPool<O>;
}
declare var RegularPool: RegularPoolConstructor;
