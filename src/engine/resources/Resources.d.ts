export { Resources };
interface Resources {
    readonly folder: string;
    get<T>(path: string): T | null;
    toString(): string;
    load(path: string): Promise<void>;
    loadList(path: string): Promise<void>;
}
interface ResourcesConstructor {
    readonly prototype: Resources;
    new (folder?: string): Resources;
}
declare const Resources: ResourcesConstructor;
