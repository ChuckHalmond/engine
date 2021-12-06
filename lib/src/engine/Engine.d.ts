export { IEngine };
export { Engine };
interface IEngine {
    run(): void;
}
declare class Engine implements IEngine {
    boot(): Promise<void>;
    run(): void;
}
