import { Mesh } from "../meshes/Mesh";
import { LightBase } from "./Light";

export { DirectionalLight };

class DirectionalLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}