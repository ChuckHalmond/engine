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
    #private;
    static get instance(): IConfiguration;
    constructor();
    readonly options: IConfigurationOptions;
}
