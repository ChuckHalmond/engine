import { LightBase } from "./Light";
import { Mesh } from "../meshes/Mesh";
export { AmbientLight };
declare class AmbientLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean;
}
