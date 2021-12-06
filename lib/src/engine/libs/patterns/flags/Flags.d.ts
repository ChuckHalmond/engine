export { Flags };
export { FlagsBase };
interface Flags {
    bits: number;
    getThenUnset(flag: number): boolean;
    get(flag: number): boolean;
    set(flag: number): void;
    unset(flag: number): void;
    setAll(): void;
    unsetAll(): void;
}
interface FlagsConstructor {
    new (): Flags;
}
declare class FlagsBase {
    protected _bits: number;
    get bits(): number;
    getThenUnset(flag: number): boolean;
    get(flag: number): boolean;
    set(flag: number): void;
    unset(flag: number): void;
    setAll(): void;
    unsetAll(): void;
}
declare const Flags: FlagsConstructor;
