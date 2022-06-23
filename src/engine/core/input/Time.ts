
export class Time {
    private static _renderLoop: (timestamp: number) => void;

    static initialize(renderLoop: (timestamp: number) => void) {
        this._renderLoop = renderLoop;
    }

    static {
        const hey = 1;
    }
}