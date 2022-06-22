import { UUID, UUIDGenerator } from "../../libs/maths/statistics/random/UUIDGenerator";
import { Component } from "./Component";
import { ComponentsRegistry } from "./ComponentsRegistry";

export { EntityDescription };
export { Entity };

interface EntityDescription {
    name: string;
    children: EntityDescription[];
    components: {
        [key: string]: any;
    }
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
    new(name: string, parent?: Entity): Entity;
}

class EntityBase implements Entity {
    public readonly uuid: UUID;

    private _parent: Entity | null;

    public get parent(): Entity | null {
        return this._parent;
    }

    readonly children: Entity[];

    name: string;

    private _active: boolean;

    public get active(): boolean {
        return this._active;
    }

    components: Map<string, Component>;

    constructor(name: string)
    constructor(name: string, parent: Entity)
    constructor(name: string, parent?: Entity) {
        this.uuid = UUIDGenerator.newUUID();
        this.name = name;
        this._active = false;
        this._parent = parent || null;
        this.children = [];
        this.components = new Map<string, Component>();
    }

    public setActive(active: boolean): void {
        this._active = active;
    }

    public root(): Entity | null {
        if (this._parent !== null) {
            return this._parent.parent;
        }
        return this;
    }

    public setParent(parent: Entity | null) {
        if (this._parent != null) {
            const childIdx = this._parent.children.indexOf(this);
            if (childIdx > -1) {
                const last = this._parent.children.pop();
                if (last !== undefined) {
                    this._parent.children[childIdx] = last;
                }
            }
        }
        if (parent != null) {
            this._parent = parent;
            this._parent.children.push(this);
        }
    }

    public addChild(child: Entity, index: number): void {
        if (index > -1) {
            this.children.length += 1;
            this.children.copyWithin(index + 1, index, this.children.length);
            this.children[index] = child;
        }
    }

    public removeChild(child: Entity): void {
        const childIdx = this.children.indexOf(child);
        if (childIdx > -1) {
            const last = this.children.pop();
            if (last !== undefined) {
                this.children[childIdx] = last;
            }
        }
    }

    public getComponent<T extends Component>(name: string): T | undefined {
        return this.components.get(name) as T;
    }

    public addComponent<T extends Component>(name: string, ...args: any[]): T {
        const component = ComponentsRegistry.instance.create(name, this, ...args) as T;
        this.components.set(name, component);
        return component;
    }
}

const Entity: EntityConstructor = EntityBase;