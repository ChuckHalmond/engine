import { Entity } from "./Entity";
export declare type ComponentDesc = {
    [key: string]: any;
};
export interface Component {
    type: string;
    owner: Entity;
    enabled: boolean;
    setup(): void;
    cleanup(): void;
}
export declare abstract class AbstractComponent implements Component {
    type: string;
    owner: Entity;
    enabled: boolean;
    constructor(owner: Entity);
    abstract setup(): void;
    abstract cleanup(): void;
}
