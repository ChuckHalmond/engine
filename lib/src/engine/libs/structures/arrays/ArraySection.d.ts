export { ArraySectionValues };
export { ArraySections };
export { ArraySectionsBase };
declare type ArraySectionValues = [number, number];
interface ArraySections {
    get(index: number): ArraySectionValues;
    getThenSetEmpty(index: number): ArraySectionValues;
    isEmpty(index: number): boolean;
    setEmpty(index: number): void;
    extend(index: number, extension: ArraySectionValues): void;
}
interface ArraySectionsConstructor {
    readonly prototype: ArraySections;
    new (count: number, maxLength: number): ArraySections;
}
declare class ArraySectionsBase implements ArraySections {
    private _sections;
    private _maxLength;
    constructor(count: number, maxLength: number);
    get(index: number): ArraySectionValues;
    getThenSetEmpty(index: number): ArraySectionValues;
    isEmpty(index: number): boolean;
    setEmpty(index: number): void;
    extend(index: number, section: ArraySectionValues): void;
}
declare const ArraySections: ArraySectionsConstructor;
