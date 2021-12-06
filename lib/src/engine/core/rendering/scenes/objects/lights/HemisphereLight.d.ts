import { LightBase } from "./Light";
import { Mesh } from "../meshes/Mesh";
export { HemisphereLight };
declare class HemisphereLight extends LightBase {
    isLightingOn(mesh: Mesh): boolean;
}
