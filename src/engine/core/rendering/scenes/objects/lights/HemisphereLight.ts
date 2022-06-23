import { LightBase } from "./Light";
import { Mesh } from "../meshes/Mesh";

export { HemisphereLight };

class HemisphereLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}