import { Entity } from "./Entity";
export declare type ComponentDesc = {
    [key: string]: any;
};
export interface Component<T extends ComponentDesc> {
    type: string;
    owner: Entity;
    desc: T;
    enabled: boolean;
    setup(): void;
    cleanup(): void;
}
export declare abstract class AbstractComponent<T extends ComponentDesc> implements Component<T> {
    type: string;
    owner: Entity;
    enabled: boolean;
    desc: T;
    constructor(owner: Entity, desc: T);
    abstract setup(): void;
    abstract cleanup(): void;
}
