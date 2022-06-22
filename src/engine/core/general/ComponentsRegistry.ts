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
    private static _instance: ComponentsRegistry;

    public static get instance(): ComponentsRegistry {
        if (this._instance === undefined) {
            this._instance = new ComponentsRegistryBase();
        }
        return this._instance;
    }

    private _dictionary: Map<string, new(owner: Entity, ...args: any[]) => Component>;

    private constructor() {
        this._dictionary = new Map();
    }

    public register<T extends Component>(name: string, ctor: new(owner: Entity, ...args: any[]) => T): void {
        if (!this._dictionary.has(name)) {
            this._dictionary.set(name, ctor);
        }
    }

    public create<T extends Component>(name: string, owner: Entity, ...args: any[]): T | undefined {
        const ctor = this._dictionary.get(name);
        if (ctor !== undefined) {
            return new ctor(owner, ...args) as T;
        }
        return undefined;
    }
}

var ComponentsRegistry: ComponentsRegistryConstructor = ComponentsRegistryBase;