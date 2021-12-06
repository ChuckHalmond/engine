import { UUID, UUIDGenerator } from "../../libs/maths/statistics/random/UUIDGenerator";
import { ComponentDesc, Component } from "./Component";
import { ComponentsRegistry } from "./ComponentsRegistry";
import { Transform } from "./Transform";

export { EntityDesc };
export { Entity };
export { EntityBase };

interface EntityDesc {
    components?: {
        [name: string]: ComponentDesc
    },
    children?: {
        [name: string]: EntityDesc
    }
}
//TODO: recursively parse active entities ONLY
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
    new(name: string, parent?: Entity): Entity;
}

class EntityBase implements Entity {
    public readonly uuid: UUID;

    desc: EntityDesc;
    name: string;
    active: boolean;
    parent?: Entity;
    children: Entity[]
    components: Map<string, Component<any>>;
    transform: Transform;

    constructor(name: string, parent?: Entity) {
        this.uuid = UUIDGenerator.newUUID();
        this.desc = {};
        this.name = name;
        this.active = false;
        this.parent = parent;
        this.children = [];
        this.components = new Map<string, Component<any>>();
        this.transform = new Transform();
    }

    public setup(desc: EntityDesc) {
        this.desc = desc;
    }

    public getComponent<T extends Component<any>>(name: string): T| undefined {
        return this.components.get(name) as T;
    }

    public addComponent<T extends Component<any>>(name: string, desc: any): T | undefined {
        const component = ComponentsRegistry.instance.create(name, this, desc) as T;
        this.components.set(name, component);
        return component;
    }
}

const Entity: EntityConstructor = EntityBase;