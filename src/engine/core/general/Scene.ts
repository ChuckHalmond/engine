import { EntityDesc, Entity, EntityBase } from "engine/core/general/Entity";
import { UUID, UUIDGenerator } from "engine/libs/maths/statistics/random/UUIDGenerator";

export { Scene };
export { SceneBase };

type SceneDesc = {
    [key: string]: EntityDesc;
}

interface Scene {
    readonly uuid: UUID;
    readonly root: Entity;
    build(desc: SceneDesc): void;
}

interface SceneConstructor {
    readonly prototype: Scene;
    new(): Scene;
}

class SceneBase implements Scene {
    public readonly root: Entity;
    public readonly uuid: UUID;

    constructor() {
        this.uuid = UUIDGenerator.newUUID();
        this.root = new EntityBase('root', undefined);
    }

    private parseEntityRecursive(name: string, desc: EntityDesc, parent: Entity): Entity {
        const entity = new EntityBase(name, parent);

        // Parsing children
        if (desc.children !== undefined) {
            for (const childName in desc.children) {
                const childDesc = desc.children[childName];
                const childEntity = this.parseEntityRecursive(childName, childDesc, entity);
                childEntity.parent = entity;
                entity.children.push(childEntity);
            }
        }
        // Parsing components
        if (desc.components !== undefined) {
            for (const componentName in desc.components) {
                const component = entity.addComponent(componentName, desc.components[componentName]);
            }
        }

        return entity;
    }

    public build(desc: SceneDesc, root?: Entity): void {
        if (root === undefined) {
            root = this.root;
        }

        for (const key in desc) {
            const entity = this.parseEntityRecursive(key, desc[key], this.root);
            root.children.push(entity);
        }
    }
}

const Scene: SceneConstructor = SceneBase;