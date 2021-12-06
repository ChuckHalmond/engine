import { Mesh } from "../meshes/Mesh";
import { LightBase } from "./Light";
export { DirectionalLight };
declare class DirectionalLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean;
}
