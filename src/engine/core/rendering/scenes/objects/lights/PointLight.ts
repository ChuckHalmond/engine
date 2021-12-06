import { Mesh } from "../meshes/Mesh";
import { LightBase } from "./Light";

export { PointLight };

class PointLight extends LightBase {
    public isLightingOn(mesh: Mesh): boolean {
        return false;
    }
}