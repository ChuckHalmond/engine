export { Scene };

interface SceneProperties {

}

interface SceneConstructor {
    prototype: Scene;
    new(properties: SceneProperties): Scene;
}

interface Scene {
}

class SceneBase implements Scene {

    constructor(properties: SceneProperties) {
    }
}

var Scene: SceneConstructor = SceneBase;