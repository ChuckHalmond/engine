import { Mesh } from "../meshes/Mesh";
import { LightBase } from "./Light";

export { SpotLight };

class SpotLight extends LightBase {
    public isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}