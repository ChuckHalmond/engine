import { Component } from "./Component";
import { Entity } from "./Entity";
export { ComponentsRegistry };
interface ComponentsRegistryConstructor {
    readonly instance: ComponentsRegistry;
}
interface ComponentsRegistry {
    register<T extends Component>(name: string, ctor: new (owner: Entity, ...args: any[]) => T): void;
    create<T extends Component>(name: string, owner: Entity, ...args: any[]): T | undefined;
}
export declare class ComponentsRegistryBase {
    #private;
    static get instance(): ComponentsRegistry;
    constructor();
    register<T extends Component>(name: string, ctor: new (owner: Entity, ...args: any[]) => T): void;
    create<T extends Component>(name: string, owner: Entity, ...args: any[]): T | undefined;
}
declare var ComponentsRegistry: ComponentsRegistryConstructor;
