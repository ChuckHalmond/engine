import { LightBase } from "./Light";
import { Mesh } from "../meshes/Mesh";

export { AmbientLight };

class AmbientLight extends LightBase {
    
    isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}