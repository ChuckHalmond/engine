import { UUID } from "../../libs/maths/statistics/random/UUIDGenerator";
import { ComponentDesc, Component } from "./Component";
import { Transform } from "./Transform";
export { EntityDesc };
export { Entity };
export { EntityBase };
interface EntityDesc {
    components?: {
        [name: string]: ComponentDesc;
    };
    children?: {
        [name: string]: EntityDesc;
    };
}
interface Entity {
    uuid: UUID;
    desc: EntityDesc;
    name: string;
    active: boolean;
    components: Map<string, Component<any>>;
    transform: Transform;
    setup(desc: EntityDesc): void;
    parent?: Entity;
    children: Entity[];
    getComponent<T extends Component<any>>(name: string): T | undefined;
    addComponent<T extends Component<any>>(name: string, desc: any): void;
}
interface EntityConstructor {
    readonly prototype: Entity;
    new (name: string, parent?: Entity): Entity;
}
declare class EntityBase implements Entity {
    readonly uuid: UUID;
    desc: EntityDesc;
    name: string;
    active: boolean;
    parent?: Entity;
    children: Entity[];
    components: Map<string, Component<any>>;
    transform: Transform;
    constructor(name: string, parent?: Entity);
    setup(desc: EntityDesc): void;
    getComponent<T extends Component<any>>(name: string): T | undefined;
    addComponent<T extends Component<any>>(name: string, desc: any): T | undefined;
}
declare const Entity: EntityConstructor;
