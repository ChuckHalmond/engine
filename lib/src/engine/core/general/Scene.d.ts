import { UUID } from "../../libs/maths/statistics/random/UUIDGenerator";
import { Entity, EntityDescription } from "./Entity";
export { SceneDescription };
export { Scene };
export { SceneBase };
declare type SceneDescription = {
    [key: string]: EntityDescription;
};
interface Scene {
    readonly uuid: UUID;
    readonly root: Entity;
    build(desc: SceneDescription): void;
}
interface SceneConstructor {
    readonly prototype: Scene;
    new (): Scene;
}
declare class SceneBase implements Scene {
    readonly root: Entity;
    readonly uuid: UUID;
    constructor();
    private _buildEntityRecursive;
    build(desc: SceneDescription, root?: Entity): void;
}
declare const Scene: SceneConstructor;
