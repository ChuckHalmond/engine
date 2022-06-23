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
	new(): Flags;
}

class FlagsBase {
	protected _bits: number = 0;

	get bits(): number {
		return this._bits;
	}

	getThenUnset(flag: number): boolean {
		const value = !!(this._bits & flag);
		this._bits |= flag;
		return value;
	}

	get(flag: number): boolean {
		return !!(this._bits & flag);
	}

    set(flag: number): void {
		this._bits |= flag;
	}
	
    unset(flag: number): void {
		this._bits &= ~flag;
	}
	
    setAll(): void {
		this._bits = (1 << 30) - 1;
	}
    
    unsetAll(): void {
		this._bits = 0;
	}
}

const Flags: FlagsConstructor = FlagsBase;