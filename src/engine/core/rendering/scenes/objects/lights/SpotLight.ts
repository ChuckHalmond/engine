import { Mesh } from "../meshes/Mesh";
import { LightBase } from "./Light";

export { SpotLight };

class SpotLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}