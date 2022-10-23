import { Scene } from "../scenes/Scene";
import { Camera } from "../scenes/cameras/Camera";
import { RenderPacket } from "./RenderPacket";
import { Shader } from "../shaders/Shader";
import { Texture } from "../webgl/WebGLTextureUtilities";
export declare class Renderer {
    context: WebGL2RenderingContext;
    programs: Map<Shader, Shader>;
    packets: Array<RenderPacket>;
    textures: Texture[];
    constructor(context: WebGL2RenderingContext);
    compile(scene: Scene): void;
    clear(): void;
    dispose(): void;
    prepare(): void;
    prerender(scene: Scene): void;
    render(scene: Scene, camera: Camera): void;
}
