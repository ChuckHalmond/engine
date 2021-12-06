import { UUID } from "../../libs/maths/statistics/random/UUIDGenerator";
import { EntityDesc, Entity } from "./Entity";
export { Scene };
export { SceneBase };
declare type SceneDesc = {
    [key: string]: EntityDesc;
};
interface Scene {
    readonly uuid: UUID;
    readonly root: Entity;
    build(desc: SceneDesc): void;
}
interface SceneConstructor {
    readonly prototype: Scene;
    new (): Scene;
}
declare class SceneBase implements Scene {
    readonly root: Entity;
    readonly uuid: UUID;
    constructor();
    private parseEntityRecursive;
    build(desc: SceneDesc, root?: Entity): void;
}
declare const Scene: SceneConstructor;
