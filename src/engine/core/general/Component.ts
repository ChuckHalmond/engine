import { Entity } from "./Entity";

export type ComponentDesc = {
    [key: string]: any;
}

export interface Component<T extends ComponentDesc> {
    type: string;
    owner: Entity;
    desc: T;

    enabled: boolean;

    setup(): void;
    cleanup(): void;
}

export abstract class AbstractComponent<T extends ComponentDesc> implements Component<T> {
    type: string;
    owner: Entity;
    enabled: boolean;
    desc: T;

    constructor(owner: Entity, desc: T) {
        this.type = this.constructor.name;
        this.owner = owner;
        this.desc = desc;
        this.enabled = false;
    }

    public abstract setup(): void;
    public abstract cleanup(): void;
}