export { IEngine }
export { Engine }

interface IEngine {
    run(): void;
}

class Engine implements IEngine {

    public async boot() {
        this.run();
    }

    public run(): void {
        
    }
}