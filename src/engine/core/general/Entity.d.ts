import { UUID } from "../../libs/maths/statistics/random/UUIDGenerator";
import { Component } from "./Component";
export { EntityDescription };
export { Entity };
interface EntityDescription {
    name: string;
    children: EntityDescription[];
    components: {
        [key: string]: any;
    };
}
interface Entity {
    readonly parent: Entity | null;
    readonly children: Entity[];
    addChild(child: Entity, index: number): void;
    removeChild(child: Entity): void;
    setParent(parent: Entity | null): void;
    root(): Entity | null;
    uuid: UUID;
    name: string;
    setActive(active: boolean): void;
    readonly active: boolean;
    components: Map<string, Component>;
    getComponent<T extends Component>(name: string): T | undefined;
    addComponent<T extends Component>(name: string, ...args: any[]): T;
}
interface EntityConstructor {
    readonly prototype: Entity;
    new (name: string, parent?: Entity): Entity;
}
declare const Entity: EntityConstructor;
