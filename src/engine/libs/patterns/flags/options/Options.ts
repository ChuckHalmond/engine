import { Flags } from "../Flags";

export { Options };
export { AdvancedOptionsBase };
export { SimpleOptionsBase };

interface Options<O extends number = number> {
    readonly bits: number;
    set(options: O): void;
    unset(options: O): boolean;
    get(options: O): boolean;
}

abstract class AdvancedOptionsBase<O extends number = number> implements Options<O> {
    private _flags: Flags;

    constructor(flags?: O) {
        this._flags = new Flags();

        if (flags) {
            this.set(flags);
        }
    }

    get bits(): number {
        return this._flags.bits;
    }

    set(options: O): void {
        this._flags.set(options);
        this.handleSet(options);
    }

    unset(options: O): boolean {
        const isSet = this._flags.get(options);
        this._flags.unset(options);
        this.handleUnset(options);
        return isSet;
    }

    get(options: O): boolean {
        return this._flags.get(options);
    }

    protected abstract handleSet(options: O): void;
    protected abstract handleUnset(options: O): void;
}

class SimpleOptionsBase<O extends number = number> implements Options<O> {
    private _flags: Flags;

    constructor(flags?: O) {
        this._flags = new Flags();

        if (flags) {
            this.set(flags);
        }
    }

    get bits(): number {
        return this._flags.bits;
    }

    set(options: O): void {
        this._flags.set(options);
    }

    unset(options: O): boolean {
        const isSet = this._flags.get(options);
        this._flags.unset(options);
        return isSet;
    }

    get(options: O): boolean {
        return this._flags.get(options);
    }
}