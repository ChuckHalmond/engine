import { Component } from "./Component";
import { Entity } from "./Entity";

export { ComponentsRegistry };

interface ComponentsRegistryConstructor {
    readonly instance: ComponentsRegistry;
}

interface ComponentsRegistry {
    register<T extends Component>(name: string, ctor: new(owner: Entity, ...args: any[]) => T): void;
    create<T extends Component>(name: string, owner: Entity, ...args: any[]): T | undefined;
}

export class ComponentsRegistryBase {
    static #instance: ComponentsRegistry;

    static get instance(): ComponentsRegistry {
        if (this.#instance === undefined) {
            this.#instance = new ComponentsRegistryBase();
        }
        return this.#instance;
    }

    #dictionary: Map<string, new(owner: Entity, ...args: any[]) => Component>;

    constructor() {
        this.#dictionary = new Map();
    }

    register<T extends Component>(name: string, ctor: new(owner: Entity, ...args: any[]) => T): void {
        if (!this.#dictionary.has(name)) {
            this.#dictionary.set(name, ctor);
        }
    }

    create<T extends Component>(name: string, owner: Entity, ...args: any[]): T | undefined {
        const ctor = this.#dictionary.get(name);
        if (ctor !== undefined) {
            return new ctor(owner, ...args) as T;
        }
        return undefined;
    }
}

var ComponentsRegistry: ComponentsRegistryConstructor = ComponentsRegistryBase;