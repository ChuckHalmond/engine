export { SceneNode };
interface SceneNodeProperties {
    parent: SceneNode | null;
}
interface SceneNodeConstructor {
    prototype: SceneNode;
    new (properties: SceneNodeProperties): SceneNode;
}
interface SceneNode {
    get parent(): SceneNode | null;
    readonly nodes: SceneNode[];
}
declare var SceneNode: SceneNodeConstructor;
