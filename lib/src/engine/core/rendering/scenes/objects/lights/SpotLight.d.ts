import { Mesh } from "../meshes/Mesh";
import { LightBase } from "./Light";
export { SpotLight };
declare class SpotLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean;
}
