import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Input } from "../../engine/core/input/Input";
import { CameraHelper } from "../../engine/core/rendering/helpers/CameraHelper";
import { GridHelper } from "../../engine/core/rendering/helpers/GridHelper";
import { OrthographicCamera } from "../../engine/core/rendering/scenes/cameras/OrthographicCamera";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { BufferDataUsage } from "../../engine/core/rendering/webgl/WebGLBufferUtilities";
import { WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { DrawMode } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Space } from "../../engine/libs/maths/geometry/space/Space";

export async function grid() {
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.tabIndex = 0;
    canvas.oncontextmenu = () => {
        return false;
    };
    canvas.width = 1000;
    canvas.height = 800;
    const gl = canvas.getContext("webgl2");
    if (gl == null) {
        return;
    }

    WebGLPacketUtilities.enableMultidrawExtension(gl);

    const playpause = document.createElement("button");
    playpause.textContent = "Pause";
    let paused = false;
    if (playpause !== null) {
        playpause.onclick = () => {
        paused = !paused;
        playpause.textContent = paused ? "Play" : "Pause";
        if (!paused) {
            requestAnimationFrame(render);
        }
      };
    }

    document.body.append(playpause, canvas);

    const linesVert = await fetch("assets/engine/shaders/common/multi/lines.vert").then(resp => resp.text());
    const linesFrag = await fetch("assets/engine/shaders/common/multi/lines.frag").then(resp => resp.text());
    const linesProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: linesVert, fragmentSource: linesFrag});
    if (linesProgram === null) return;

    const fov = (1 / 3) * Math.PI;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 1000;

    const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
    camera.transform.setTranslation(new Vector3([0, 10, 0]));
    camera.transform.lookAt(new Vector3(0, -1, 0), Space.up);
    const cameraControl = new FreeCameraControl(camera)

    const grid = new CameraHelper(new PerspectiveCamera(fov, aspect, zNear, zFar / 4));//new GridHelper();
    const gridTransform = new Matrix4().setIdentity();
    const gridLines = grid.geometry.getAttribute("a_position")!;
    const gridColors = grid.geometry.getAttribute("a_color")!;
    

    const gridPacket = WebGLPacketUtilities.createPacket(gl, {
        program: linesProgram,
        vertexArray: {
            vertexAttributes: {
                a_position: gridLines,
                a_color: gridColors
            }
        },
        uniformBuffers: [
            {
                usage: BufferDataUsage.STATIC_READ
            }
        ],
        uniformBlocks: {
            basicModelBlock: {
                buffer: 0,
                uniforms: {
                    "instances[0].u_model": { value: gridTransform.array },
                    "instances[0].u_color": { value: [1, 0, 0] },
                }
            },
            viewBlock: {
                uniforms: {
                    u_view: { value: camera.view.array },
                    u_projection: { value: camera.projection.array }
                }
            }
        },
        drawCommand: {
            mode: DrawMode.LINES,
            elementsCount: gridLines.array.length
        }
    });
    if (gridPacket === null) return;
    console.log(gridPacket);
    
    WebGLRendererUtilities.viewport(gl, 0, 0, canvas.width, canvas.height);
    WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);
    WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
    WebGLRendererUtilities.clearColor(gl, Color.BLACK);

    Input.initialize(canvas);

    let deltaTime, lastFrameTime = 0;
    const render = (frameTime: number) => {
        if (paused) {
            return;
        }
        frameTime *= 0.001;
        deltaTime = frameTime - lastFrameTime;
        lastFrameTime = frameTime;

        WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);

        cameraControl.update(deltaTime);

        WebGLPacketUtilities.setPacketValues(gl, gridPacket, {
            uniformBlocks: {
                viewBlock: {
                    uniforms: {
                        u_view: { value: camera.view.array },
                        u_projection: { value: camera.projection.array }
                    }
                }
            }
        });

        WebGLPacketUtilities.drawPacket(gl, gridPacket);
        
        Input.clear();

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}