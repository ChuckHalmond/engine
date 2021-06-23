import { LightBase } from "./Light";
import { Mesh } from "../meshes/Mesh";

export { AmbientLight };

class AmbientLight extends LightBase {
    
    public isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}