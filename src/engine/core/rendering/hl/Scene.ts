import { Camera } from "../scenes/cameras/Camera";
import { Entity } from "./Entity";

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

    addEntity(entity: Entity): void {
        
    }
}

var Scene: SceneConstructor = SceneBase;