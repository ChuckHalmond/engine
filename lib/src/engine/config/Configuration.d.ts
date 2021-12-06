export { IConfigurationOptions };
export { IConfiguration };
export { SConfiguration };
interface IConfigurationOptions {
    renderingCanvasId: string;
}
interface IConfiguration {
    options: IConfigurationOptions;
}
declare class SConfiguration implements IConfiguration {
    private static _instance;
    static get instance(): IConfiguration;
    private constructor();
    readonly options: IConfigurationOptions;
}
