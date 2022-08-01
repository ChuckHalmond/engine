export { Scene };
interface SceneProperties {
}
interface SceneConstructor {
    prototype: Scene;
    new (properties: SceneProperties): Scene;
}
interface Scene {
}
declare var Scene: SceneConstructor;
