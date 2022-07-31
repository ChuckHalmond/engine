export { Entity };

interface EntityProperties {
    parent: Entity | null;
}

interface EntityConstructor {
    prototype: Entity;
    new(properties: EntityProperties): Entity;
}

interface Entity {
    get parent(): Entity | null;
    readonly nodes: Entity[];
}

class EntityBase implements Entity {
    #parent: Entity | null;
    readonly nodes: Entity[];

    get parent(): Entity | null {
        return this.#parent;
    }

    constructor(properties: EntityProperties) {
        this.#parent = properties.parent ?? null;
        this.nodes = [];
    }

    add(...nodes: Entity[]): void {
        nodes.forEach((node) => {
            const {parent} = node;
            if (parent !== null && parent !== this) {
                const {nodes} = parent;
                const index = nodes.indexOf(node);
                if (index > -1) {
                    nodes.splice(index, 1);
                }
                if (node instanceof EntityBase) {
                    node.#parent = this;
                }
            }
            else if (parent == null) {
                if (node instanceof EntityBase) {
                    node.#parent = this;
                }
            }
        });
    }

    dispose(): void {

    }
}

var Entity: EntityConstructor = EntityBase;