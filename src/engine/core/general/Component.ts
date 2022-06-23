import { Entity } from "./Entity";

export type ComponentDesc = {
    [key: string]: any;
}

export interface Component {
    type: string;
    owner: Entity;

    enabled: boolean;

    setup(): void;
    cleanup(): void;
}

export abstract class AbstractComponent implements Component {
    type: string;
    owner: Entity;
    enabled: boolean;

    constructor(owner: Entity) {
        this.type = this.constructor.name;
        this.owner = owner;
        this.enabled = false;
    }

    abstract setup(): void;
    abstract cleanup(): void;
}