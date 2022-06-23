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
    static #instance: SConfiguration;

    static get instance(): IConfiguration {
        if (this.#instance === undefined) {
            this.#instance = new SConfiguration();
        }
        return this.#instance;
    }

    constructor() {
        this.options = {
            renderingCanvasId: 'canvas'
        };
    }

    readonly options: IConfigurationOptions;
}