//import { Program } from "../shaders/programs/Program";
import { Scene } from "../scenes/Scene";
import { Camera } from "../scenes/cameras/Camera";
import { RenderPacket } from "./RenderPacket";
import { Shader } from "../shaders/Shader";
import { Texture } from "../webgl/WebGLTextureUtilities";

export class Renderer {
    context: WebGL2RenderingContext;
    programs: Map<Shader, Shader>;
    packets: Array<RenderPacket>;
    textures: Texture[];

    // compiling scene to memory
    // i.e.
    // from Uniforms and Attributes (shaders)
    // to Programs, Buffers, Textures, and Framebuffers (webgl)

    // render loop :
    //  culling
    //  rendering passes


    // TODO:
    // - use uniform buffers (instanced), uniform blocks, instanced attributes, buffer subdata
    // - 

    constructor(context: WebGL2RenderingContext) {
        this.context = context;
        this.programs = new Map<Shader, Shader>();
        this.packets = new Array<RenderPacket>();
        this.textures = [];
    }

    compile(scene: Scene) {

    }

    clear() {

    }

    dispose() {

    }

    prepare() {

    }

    prerender(scene: Scene) {
        this.packets = [];

        /*for (const mesh of scene.meshes) {
            //this.packets.push(new MeshRenderPacket(this.getProgramFor(mesh.material), mesh, scene));
        }

        for (const compositeMesh of scene.compositeMeshes) {
            for (const submesh of compositeMesh.submeshes) {
                //this.packets.push(new SubmeshRenderPacket(this.getProgramFor(submesh.material), submesh, scene));
            }
        }

        for (const program of this.programs.values()) {
            //program.compile(this.context);
        }*/
    }

    render(scene: Scene, camera: Camera) {
        
        // Culling (octree, etc.)

        // Sorting

        for (const packet of this.packets) {
            //this.context.useProgram(packet.program);
        }
    }
}