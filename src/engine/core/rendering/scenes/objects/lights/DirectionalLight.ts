import { LightBase } from "engine/core/rendering/scenes/objects/lights/Light";
import { Mesh } from "../meshes/Mesh";

export { DirectionalLight };

class DirectionalLight extends LightBase {
    public isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}