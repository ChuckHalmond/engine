import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { AttributeDataType, DrawMode, WebGLVertexArrayUtilities } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Space } from "../../engine/libs/maths/geometry/space/Space";

export async function shadows() {
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.tabIndex = 0;
    canvas.oncontextmenu = () => {
        return false;
    };
    canvas.width = 600;
    canvas.height = 500;
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
            render(0);
        }
      };
    }

    document.body.append(playpause, canvas);

    const basicVert = await fetch("assets/engine/shaders/common/multi/basic.vert.glsl").then(resp => resp.text());
    const basicFrag = await fetch("assets/engine/shaders/common/multi/basic.frag.glsl").then(resp => resp.text());
    const basicProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: basicVert, fragmentSource: basicFrag});
    if (basicProgram === null) return;

    const fov = (1 / 3) * Math.PI;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 100;

    const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
    camera.transform.setTranslation(new Vector3([1, 0, 0]));
    const cameraControl = new FreeCameraControl(camera)
    
    const cubeTransform = new Transform();
    cubeTransform.setTranslation(camera.getFront(new Vector3()).scale(4));

    const quadTransform = new Transform();
    quadTransform.setTranslation(camera.getFront(new Vector3()).scale(8));

    const cubeGeometry = new CubeGeometry();
    const cubeGeometryBuilder = cubeGeometry.toBuilder();
    const cubeVerticesArray = cubeGeometryBuilder.verticesArray();
    const cubeIndicesArray = cubeGeometryBuilder.indicesArray();

    const quadGeometry = new QuadGeometry({
        width: 4, height: 4
    });
    const quadGeometryBuilder = quadGeometry.toBuilder();
    const quadVerticesArray = quadGeometryBuilder.verticesArray();
    const quadIndicesArray = quadGeometryBuilder.indicesArray();
    
    const cubePacket = WebGLPacketUtilities.createPacket(gl, {
        program: basicProgram,
        vertexArray: {
            vertexAttributes: {
                a_position: { array: Float32Array.of(...quadVerticesArray, ...cubeVerticesArray), type: AttributeDataType.VEC3 }
            },
            elementIndices: Uint16Array.of(...quadIndicesArray, ...cubeIndicesArray.map(i => i + quadIndicesArray.length))
        },
        uniformBlocks: {
            basicModelBlock: {
                uniforms: {
                    "models[0].u_model": { value: cubeTransform.matrix.array },
                    "models[0].u_color": { value: [1, 0, 0] },
                    "models[1].u_model": { value: quadTransform.matrix.array },
                    "models[1].u_color": { value: [0, 1, 0] }
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
            mode: DrawMode.TRIANGLES,
            multiDraw: {
                countsList: [quadIndicesArray.length, cubeIndicesArray.length],
                countsOffset: 0,
                offsetsList: [0, quadIndicesArray.length * Uint16Array.BYTES_PER_ELEMENT],
                offsetsOffset: 0,
                drawCount: 2
            }
        }
    });
    if (cubePacket === null) return;

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

        WebGLPacketUtilities.setPacketValues(gl, cubePacket, {
            uniformBlocks: {
                viewBlock: {
                    uniforms: {
                        u_view: { value: camera.view.array },
                        u_projection: { value: camera.projection.array }
                    }
                }
            }
        });

        WebGLPacketUtilities.drawPacket(gl, cubePacket, /*{
            mode: DrawMode.TRIANGLES,
            multiDraw: {
                ...cubePacket.drawCommand.multiDraw!,
                countsList: [quadIndicesArray.length + cubeIndicesArray.length, quadIndicesArray.length + cubeIndicesArray.length],
                offsetsList: [0, 0],
            }
        }*/);
        
        Input.clear();

        requestAnimationFrame(render);
    }

    render(0);
}