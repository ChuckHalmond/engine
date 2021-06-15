export { ArraySectionValues };
export { ArraySections };
export { ArraySectionsBase };

type ArraySectionValues = [number, number];

interface ArraySections {
    get(index: number): ArraySectionValues;
    getThenSetEmpty(index: number): ArraySectionValues;
    isEmpty(index: number): boolean;
    setEmpty(index: number): void;
    extend(index: number, extension: ArraySectionValues): void;
}

interface ArraySectionsConstructor {
    readonly prototype: ArraySections;
    new(count: number, maxLength: number): ArraySections;
}

class ArraySectionsBase implements ArraySections {
    private _sections: Uint8Array | Uint16Array;
    private _maxLength: number;
    
	constructor(count: number, maxLength: number) {
        const length = 2 * count;
        
        if (maxLength < 256) {
            this._sections = new Uint8Array(length);
            this._maxLength = 256;
        }
        else {
            this._sections = new Uint16Array(length);
            this._maxLength = 65535;
        }
        this._sections = new Uint16Array(length);

        for (let index = 0; index < length; index += 2) {
            this._sections[index    ] = this._maxLength;
            this._sections[index + 1] = 0;
        }
    }

    public get(index: number): ArraySectionValues {
        return [this._sections[index], this._sections[index + 1]];
    }

    public getThenSetEmpty(index: number): ArraySectionValues {
        const section: ArraySectionValues = [this._sections[index], this._sections[index + 1]];
        this._sections[index    ] = this._maxLength;
        this._sections[index + 1] = 0;
        return section;
    }

    public isEmpty(index: number): boolean {
        return this._sections[index] <= this._sections[index + 1];
    }

    public setEmpty(index: number): void {
        this._sections[index    ] = this._maxLength;
        this._sections[index + 1] = 0;
	}
	
    public extend(index: number, section: ArraySectionValues): void {
        this._sections[index    ] = Math.min(this._sections[index    ], section[0], this._maxLength);
        this._sections[index + 1] = Math.max(this._sections[index + 1], section[1], 0);
	}
}

const ArraySections: ArraySectionsConstructor = ArraySectionsBase;