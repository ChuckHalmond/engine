import { UUID, UUIDGenerator } from "../../libs/maths/statistics/random/UUIDGenerator";
import { Entity, EntityDescription } from "./Entity";

export { SceneDescription };
export { Scene };
export { SceneBase };

type SceneDescription = {
    [key: string]: EntityDescription;
}

interface Scene {
    readonly uuid: UUID;
    readonly root: Entity;
    build(desc: SceneDescription): void;
}

interface SceneConstructor {
    readonly prototype: Scene;
    new(): Scene;
}

class SceneBase implements Scene {
    readonly root: Entity;
    readonly uuid: UUID;

    constructor() {
        this.uuid = UUIDGenerator.newUUID();
        this.root = new Entity("root");
    }

    private _buildEntityRecursive(name: string, parent: Entity, desc: EntityDescription): Entity {
        const entity = new Entity(name, parent);

        if (desc.children !== undefined) {
            desc.children.forEach((child) => {
                const childEntity = this._buildEntityRecursive(child.name, entity, child);
                childEntity.setParent(entity);
            });
        }
        
        if (desc.components !== undefined) {
            for (const componentName in desc.components) {
                entity.addComponent(componentName, desc.components[componentName]);
            }
        }

        return entity;
    }

    build(desc: SceneDescription, root?: Entity): void {
        if (root === undefined) {
            root = this.root;
        }

        for (const key in desc) {
            const entity = this._buildEntityRecursive(key, this.root, desc[key]);
            root.children.push(entity);
        }
    }
}

const Scene: SceneConstructor = SceneBase;