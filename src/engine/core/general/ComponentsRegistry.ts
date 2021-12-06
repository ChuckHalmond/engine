import { Component } from "./Component";
import { Entity } from "./Entity";

export class ComponentsRegistry {
    private static _instance: ComponentsRegistry;

    public static get instance(): ComponentsRegistry {
        if (this._instance === undefined) {
            this._instance = new ComponentsRegistry();
        }
        return this._instance;
    }

    private _dictionary: Map<string, any>;

    private constructor() {
        this._dictionary = new Map<string, any>();
    }

    public register<T extends Component<any>>(name: string, type: { new (...args: any): T }): void {
        if (!this._dictionary.has(name)) {
            this._dictionary.set(name, type);
        }
    }

    public create<T extends Component<any>>(name: string, owner: Entity, desc: any): T | undefined {
        const ctor = this._dictionary.get(name);
        if (ctor !== undefined) {
            return new ctor(owner, desc);
        }
        return undefined;
    }
}