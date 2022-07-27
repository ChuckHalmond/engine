import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { GeometryBuffer } from "../../engine/core/rendering/scenes/geometries/GeometryBuffer";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { BufferDataUsage } from "../../engine/core/rendering/webgl/WebGLBufferUtilities";
import { WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { AttributeDataType, DrawMode, WebGLVertexArrayUtilities } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Space } from "../../engine/libs/maths/geometry/space/Space";

export async function octree() {
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
    const zFar = 100;

    const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
    camera.transform.setTranslation(new Vector3([1, 0, 0]));
    const cameraControl = new FreeCameraControl(camera)
    
    const cubeTransform = new Transform();
    cubeTransform.setTranslation(camera.getFront(new Vector3()).scale(4));

    const quadTransform = new Transform();
    quadTransform.setTranslation(cubeTransform.getTranslation(new Vector3()).scale(2));

    const cubeGeometry = new CubeGeometry();
    const cubeGeometryBuilder = cubeGeometry.toBuilder();
    const cubeLinesArray = cubeGeometryBuilder.verticesArray();
    const cubeLinesIndicesArray = cubeGeometryBuilder.linesIndicesArray();

    const quadGeometry = new QuadGeometry({
        width: 2, height: 2
    });
    const quadGeometryBuilder = quadGeometry.toBuilder();
    const quadLinesArray = quadGeometryBuilder.verticesArray();
    const quadLinesIndicesArray = quadGeometryBuilder.linesIndicesArray();

    const geometryBuffer = new GeometryBuffer({
        u_model: {
            array: Float32Array.of(
                ...cubeTransform.matrix.array,
                ...quadTransform.matrix.array,
                ...cubeTransform.matrix.clone().translate(new Vector3(1, 1, 1)).array,
                ...quadTransform.matrix.clone().translate(new Vector3(1, 1, 1)).array
            ),
            type: AttributeDataType.VEC3
        },
        u_color: {
            array: Float32Array.of(
                ...[1, 0, 0, 1],
                ...[0, 1, 0, 1],
                ...[0, 0, 1, 1],
                ...[0, 1, 1, 1]
            ),
            type: AttributeDataType.VEC3
        }
    }, undefined, true);

    console.log(geometryBuffer);
    
    const cubePacket = WebGLPacketUtilities.createPacket(gl, {
        program: linesProgram,
        vertexArray: {
            vertexAttributes: {
                a_position: { array: Float32Array.of(...quadLinesArray, ...cubeLinesArray), type: AttributeDataType.VEC3 }
            },
            elementIndices: Uint16Array.of(...quadLinesIndicesArray, ...cubeLinesIndicesArray.map(i => i + quadLinesIndicesArray.length))
        },
        uniformBuffers: [
            {
                //TODO: data as arraybuffer
                usage:  BufferDataUsage.STATIC_READ,
                data: geometryBuffer.buffer
            }
        ],
        uniformBlocks: {
            basicModelBlock: {
                buffer: 0,
                /*uniforms: {
                    "models[0].instances[0].u_model": { value: cubeTransform.matrix.array },
                    "models[0].instances[0].u_color": { value: [1, 0, 0] },
                    "models[1].instances[0].u_model": { value: quadTransform.matrix.array },
                    "models[1].instances[0].u_color": { value: [0, 1, 0] },
                    "models[0].instances[1].u_model": { value: cubeTransform.matrix.clone().translate(new Vector3(1, 1, 1)).array },
                    "models[0].instances[1].u_color": { value: [0, 0, 1] },
                    "models[1].instances[1].u_model": { value: quadTransform.matrix.clone().translate(new Vector3(1, 1, 1)).array },
                    "models[1].instances[1].u_color": { value: [0, 1, 1] }
                }*/
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
            multiDraw: {
                countsList: [quadLinesIndicesArray.length, cubeLinesIndicesArray.length],
                countsOffset: 0,
                offsetsList: [0, quadLinesIndicesArray.length * Uint16Array.BYTES_PER_ELEMENT],
                offsetsOffset: 0,
                instanceCountsList: [2, 2],
                instanceCountsOffset: 0,
                drawCount: 2
            }
        }
    });
    if (cubePacket === null) return;

    console.log(cubePacket);
    
    console.log(geometryBuffer.getAttribute("u_color"));
    
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

        WebGLPacketUtilities.drawPacket(gl, cubePacket);
        
        Input.clear();

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}