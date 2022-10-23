import { Mesh } from "../meshes/Mesh";
import { LightBase } from "./Light";
export { PointLight };
declare class PointLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean;
}
