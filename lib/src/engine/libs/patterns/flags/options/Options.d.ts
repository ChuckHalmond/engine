export { Options };
export { AdvancedOptionsBase };
export { SimpleOptionsBase };
interface Options<O extends number = number> {
    readonly bits: number;
    set(options: O): void;
    unset(options: O): boolean;
    get(options: O): boolean;
}
declare abstract class AdvancedOptionsBase<O extends number = number> implements Options<O> {
    private _flags;
    constructor(flags?: O);
    get bits(): number;
    set(options: O): void;
    unset(options: O): boolean;
    get(options: O): boolean;
    protected abstract handleSet(options: O): void;
    protected abstract handleUnset(options: O): void;
}
declare class SimpleOptionsBase<O extends number = number> implements Options<O> {
    private _flags;
    constructor(flags?: O);
    get bits(): number;
    set(options: O): void;
    unset(options: O): boolean;
    get(options: O): boolean;
}
