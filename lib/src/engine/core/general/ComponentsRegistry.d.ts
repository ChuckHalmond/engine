import { Component } from "./Component";
import { Entity } from "./Entity";
export declare class ComponentsRegistry {
    private static _instance;
    static get instance(): ComponentsRegistry;
    private _dictionary;
    private constructor();
    register<T extends Component<any>>(name: string, type: {
        new (...args: any): T;
    }): void;
    create<T extends Component<any>>(name: string, owner: Entity, desc: any): T | undefined;
}
