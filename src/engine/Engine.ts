export { IEngine }
export { Engine }

interface IEngine {
    run(): void;
}

class Engine implements IEngine {

    async boot() {
        this.run();
    }

    run(): void {
        
    }
}