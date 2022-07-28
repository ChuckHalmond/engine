import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { BoundingBox } from "../../engine/core/rendering/scenes/geometries/bounding/BoundingBox";
import { GeometryBuffer } from "../../engine/core/rendering/scenes/geometries/GeometryBuffer";
import { Octree } from "../../engine/core/rendering/scenes/geometries/lib/Octree";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { BufferDataUsage } from "../../engine/core/rendering/webgl/WebGLBufferUtilities";
import { WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { AttributeDataType, DrawMode, WebGLVertexArrayUtilities } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
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
    camera.transform.setTranslation(new Vector3([0, 0, 25]));
    const cameraControl = new FreeCameraControl(camera)

    const cubeGeometry = new CubeGeometry();
    const cubeGeometryBuilder = cubeGeometry.toBuilder();
    const cubeLinesArray = cubeGeometryBuilder.verticesArray();
    const cubeLinesIndicesArray = cubeGeometryBuilder.linesIndicesArray();

    const rootScaling = 16;
    const rootBox = new BoundingBox(
        new Vector3(-rootScaling, -rootScaling, -rootScaling),
        new Vector3(rootScaling, rootScaling, rootScaling)
    );

    const entityBoxScalingRatio = 2;
    const entityBoxTranslationRatio = 8;

    const staticEntitiesCount = 8;
    const staticEntities = new Array(staticEntitiesCount).fill(0).map(() => {
        const coordRands = new Array(6).fill(0).map(() => {
            const randDigit = Math.random() * entityBoxTranslationRatio;
            const randSign = Math.sign(Math.random() - 0.5);
            return randDigit * randSign;
        });
        const scalingRand = Math.random() * entityBoxScalingRatio;
        coordRands.forEach((coord_i, i, coords) => {
            coords[i] = coord_i * scalingRand;
        });
        return {
            box: new BoundingBox(
                new Vector3(coordRands.slice(0, 3)),
                new Vector3(coordRands.slice(3, 6))
            )
        };
    });
    const nonStaticEntitiesCount = 8;
    const nonStaticEntities = new Array(nonStaticEntitiesCount).fill(0).map(() => {
        const coordRands = new Array(6).fill(0).map(() => {
            const randDigit = Math.random() * entityBoxTranslationRatio;
            const randSign = Math.sign(Math.random() - 0.5);
            return randDigit * randSign;
        });
        const scalingRand = Math.random() * entityBoxScalingRatio;
        coordRands.forEach((coord_i, i, coords) => {
            coords[i] = coord_i * scalingRand;
        });
        return {
            box: new BoundingBox(
                new Vector3(coordRands.slice(0, 3)),
                new Vector3(coordRands.slice(3, 6))
            )
        };
    });

    const octree = new Octree(
        rootBox,
        null,
        Array.from(nonStaticEntities),
        Array.from(staticEntities)
    );
    
    octree.init();

    const entitiesCount = staticEntities.length + nonStaticEntities.length;
    const octants = octree.innerOctants();
    const octantsCount = octants.length;

    console.log(octree);
    console.log(staticEntities);
    console.log(nonStaticEntities);
    octants.forEach((octant_i, i) => {
        console.log(`Octant ${i} contains static entities ${octant_i.staticEntities.map(entity => staticEntities.indexOf(entity))}`);
        console.log(`Octant ${i} contains non-static entities ${octant_i.nonStaticEntities.map(entity => nonStaticEntities.indexOf(entity))}`);
    });

    const uniformEntries = [...staticEntities, ...nonStaticEntities].flatMap((entity_i, i) => {
        const {box} = entity_i;
        const {min, max} = box;
        const {x: minX, y: minY, z: minZ} = min;
        const {x: maxX, y: maxY, z: maxZ} = max;
        const boxWidth = Math.abs(maxX - minX);
        const boxHeight = Math.abs(maxY - minY);
        const boxDepth = Math.abs(maxZ - minZ);
        const centerX = (minX + maxX) / 2;
        const centerY = (minY + maxY) / 2;
        const centerZ = (minZ + maxZ) / 2;
        const boxCenter = new Vector3(centerX, centerY, centerZ);

        const mat = Matrix4.identity().translate(boxCenter).scale(new Vector3(boxWidth, boxHeight, boxDepth));
        return [
            [`models[0].instances[${i}].u_model`, {value: mat.array}],
            [`models[0].instances[${i}].u_color`, {value: [1, 0, 0]}]
        ];
    }).concat(
        ...octants.map((octree, i) => {
            const {region} = octree;
            const {min, max} = region;
            const {x: minX, y: minY, z: minZ} = min;
            const {x: maxX, y: maxY, z: maxZ} = max;
            const boxWidth = Math.abs(maxX - minX);
            const boxHeight = Math.abs(maxY - minY);
            const boxDepth = Math.abs(maxZ - minZ);
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const centerZ = (minZ + maxZ) / 2;
            const boxCenter = new Vector3(centerX, centerY, centerZ);
    
            const mat = Matrix4.identity().translate(boxCenter).scale(new Vector3(boxWidth, boxHeight, boxDepth));
            return [
                [`models[0].instances[${entitiesCount + i}].u_model`, {value: mat.array}],
                [`models[0].instances[${entitiesCount + i}].u_color`, {value: [0, 1, 0]}]
            ];
        })
    );
    
    const cubePacket = WebGLPacketUtilities.createPacket(gl, {
        program: linesProgram,
        vertexArray: {
            vertexAttributes: {
                a_position: { array: cubeLinesArray, type: AttributeDataType.VEC3 }
            },
            elementIndices: cubeLinesIndicesArray
        },
        uniformBuffers: [
            {
                usage: BufferDataUsage.STATIC_READ
            }
        ],
        uniformBlocks: {
            basicModelBlock: {
                buffer: 0,
                uniforms: Object.fromEntries(uniformEntries)/*{
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
            elementsCount: cubeLinesIndicesArray.length,
            instanceCount: entitiesCount + octantsCount,
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

        WebGLPacketUtilities.drawPacket(gl, cubePacket);
        
        Input.clear();

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}