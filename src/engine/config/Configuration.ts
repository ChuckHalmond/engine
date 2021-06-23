export { IConfigurationOptions };
export { IConfiguration };
export { SConfiguration };

interface IConfigurationOptions {
    renderingCanvasId: string;
}

interface IConfiguration {
    options: IConfigurationOptions;
}

class SConfiguration implements IConfiguration {
    private static _instance: SConfiguration;

    public static get instance(): IConfiguration {
        if (this._instance === undefined) {
            this._instance = new SConfiguration();
        }
        return this._instance;
    }

    private constructor() {
        this.options = {
            renderingCanvasId: 'canvas'
        };
    }

    public readonly options: IConfigurationOptions;
}