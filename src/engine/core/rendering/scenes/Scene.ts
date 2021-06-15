import { Light, isLight } from "engine/core/rendering/scenes/objects/lights/Light";
import { isMesh, Mesh } from "engine/core/rendering/scenes/objects/meshes/Mesh";
import { TransformBase, Transform } from "engine/core/general/Transform";
import { CompositeMesh } from "./objects/meshes/CompositeMesh";

export { Scene };
export { BaseScene };

interface Scene {

}

class BaseScene implements Scene {
    root: Transform;

    meshes: Mesh[];
    compositeMeshes: CompositeMesh[];
    
    lights: Light[];

    layers: number[];
    //background: Background;
    
    constructor() {
        this.root = new TransformBase();
        
        this.meshes = [];
        this.compositeMeshes = [];
        this.lights = [];
        this.layers = [];
    }

    public parseObjectRecursive(transform: Transform): void {

        for (const child of transform.children) {
            this.parseObjectRecursive(child);
        }
        
        if (transform.owner !== undefined) {
            if (isMesh(transform.owner)) {
                this.meshes.push(transform.owner);
            }
            if (isLight(transform.owner)) {
                this.lights.push(transform.owner);
            }
        }
    }

    public *lightsOn(mesh: Mesh): IterableIterator<Light> {
        for (const light of this.lights) {
            if (light.isLightingOn(mesh)) {
                yield light;
            }
        }
    }
}
