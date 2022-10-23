import { Transform } from "../../general/Transform";
import { Light } from "./objects/lights/Light";
import { CompositeMesh } from "./objects/meshes/CompositeMesh";
import { Mesh } from "./objects/meshes/Mesh";
export { Scene };
export { BaseScene };
interface Scene {
}
declare class BaseScene implements Scene {
    root: Transform;
    meshes: Mesh[];
    compositeMeshes: CompositeMesh[];
    lights: Light[];
    layers: number[];
    constructor();
    parseObjectRecursive(transform: Transform): void;
    lightsOn(mesh: Mesh): IterableIterator<Light>;
}
