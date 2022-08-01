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

    let updateSelection: Function;
    let selectionMatrix = new Matrix4();

    const [minXInput, minYInput, minZInput, maxXInput, maxYInput, maxZInput] = new Array(6).fill(0).map(() => {
        const input  = document.createElement("input");
        input.type = "number";
        input.valueAsNumber = 0;
        input.onchange = () => {
            const {valueAsNumber: minX} = minXInput;
            const {valueAsNumber: minY} = minYInput;
            const {valueAsNumber: minZ} = minZInput;
            const {valueAsNumber: maxX} = maxXInput;
            const {valueAsNumber: maxY} = maxYInput;
            const {valueAsNumber: maxZ} = maxZInput;
            const boxWidth = Math.abs(maxX - minX);
            const boxHeight = Math.abs(maxY - minY);
            const boxDepth = Math.abs(maxZ - minZ);
            const centerX = (minX + maxX) / 2;
            const centerY = (minY + maxY) / 2;
            const centerZ = (minZ + maxZ) / 2;
            const boxCenter = new Vector3(centerX, centerY, centerZ);
            const boxScaling =new Vector3(boxWidth, boxHeight, boxDepth);
            selectionMatrix.setIdentity().translate(boxCenter).scale(boxScaling);
        };
        return input;
    });

    document.body.append(
        minXInput, minYInput, minZInput, maxXInput, maxYInput, maxZInput, playpause, canvas
    );

    const linesVert = await fetch("assets/engine/shaders/common/multi/lines.vert").then(resp => resp.text());
    const linesFrag = await fetch("assets/engine/shaders/common/multi/lines.frag").then(resp => resp.text());
    const linesProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: linesVert, fragmentSource: linesFrag});
    if (linesProgram === null) return;

    const fov = (1 / 3) * Math.PI;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 1000;

    const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
    camera.transform.setTranslation(new Vector3([0, 0, 25]));
    const cameraControl = new FreeCameraControl(camera)

    const cubeGeometry = new CubeGeometry();
    const cubeGeometryBuilder = cubeGeometry.toBuilder();
    const cubeLinesArray = cubeGeometryBuilder.verticesArray();
    const cubeLinesIndicesArray = cubeGeometryBuilder.linesIndicesArray();

    const rootScaling = 32;
    const rootBox = new BoundingBox(
        new Vector3(-rootScaling, -rootScaling, -rootScaling),
        new Vector3(rootScaling, rootScaling, rootScaling)
    );

    const entityBoxScalingRatio = 2;
    const entityBoxTranslationRatio = rootScaling - 4;

    const staticEntitiesCount = 8;
    const staticEntities = new Array(staticEntitiesCount).fill(0).map(() => {
        const coordRands = new Array(6).fill(0).map(() => {
            return Math.random() * entityBoxTranslationRatio * Math.sign(Math.random() - 0.5);
        });
        const scalingRand = Math.random() * entityBoxScalingRatio;
        coordRands.forEach((coord_i, i, coords) => {
            coords[i] = Math.round(coord_i * scalingRand);
        });
        coordRands.sort((a, b) => a - b);
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
            return Math.random() * entityBoxTranslationRatio * Math.sign(Math.random() - 0.5);
        });
        const scalingRand = Math.random() * entityBoxScalingRatio;
        coordRands.forEach((coord_i, i, coords) => {
            coords[i] = Math.round(coord_i * scalingRand);
        });
        coordRands.sort((a, b) => a - b);
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
    const octants = octree.innerOctants().slice(1);
    const octantsCount = octants.length;
    const instancesCount = entitiesCount + octantsCount + 1;

    // const colors = [
    //     "silver",
    //     "gray",
    //     "white",
    //     "maroon",
    //     "red",
    //     "purple",
    //     "fuchsia",
    //     "green",
    //     "lime",
    //     "olive",
    //     "yellow",
    //     "navy",
    //     "blue",
    //     "teal",
    //     "aqua"
    // ];

    /*console.log(octree);
    console.log(staticEntities);
    console.log(nonStaticEntities);*/
    console.table(
        octants.map((octant_i, i) => {
            const {id} = octant_i;
            const {min, max} = octant_i.region;
            const storedStaticEntites = octant_i.staticEntities.map(entity => staticEntities.indexOf(entity));
            const storedNonStaticEntities = octant_i.nonStaticEntities.map(entity => nonStaticEntities.indexOf(entity));
            const testedStaticEntities = staticEntities
                .map((entity_i, i) => octant_i.region.hits(entity_i.box) ? i : null)
                .filter(entity => entity !== null);
            const testedNonStaticEntities = nonStaticEntities
                .map((entity_i, i) => octant_i.region.hits(entity_i.box) ? i : null)
                .filter(entity => entity !== null);
            return {
                id,
                size: min.distance(max),
                min: Array.from(min).join(","),
                max: Array.from(max).join(","),
                storedStaticEntites: Array.from(storedStaticEntites).join(","),
                storedNonStaticEntities: Array.from(storedNonStaticEntities).join(","),
                testedStaticEntities: Array.from(testedStaticEntities).join(","),
                testedNonStaticEntities: Array.from(testedNonStaticEntities).join(","),
            };
            /*console.log(`Octant ${i} makes region [${Array.from(min)}, ${Array.from(max)}]`);
            console.log(`Octant ${i} contains static entities ${}`);
            console.log(`Octant ${i} contains non-static entities ${octant_i.nonStaticEntities.map(entity => nonStaticEntities.indexOf(entity))}`);*/
        })
    );

    console.table(
        staticEntities.map((entity_i, i) => {
            const {box} = entity_i;
            const {min, max} = box;
            return {
                min: Array.from(min).join(","),
                max: Array.from(max).join(","),
            }
        })
    );

    /*staticEntities.forEach((entity_i, i) => {
        octants.forEach((octant_j, j) => {
            const collides = octant_j.region.hits(entity_i.box);
            console.log(`Static entity ${i} ${collides ? "does" : "does not"} collide with octant ${j}`);
        });
    });

    nonStaticEntities.forEach((entity_i, i) => {
        octants.forEach((octant_j, j) => {
            const collides = octant_j.region.hits(entity_i.box);
            console.log(`Non-static entity ${i} ${collides ? "does" : "does not"} collide with octant ${j}`);
        });
    });*/

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
        const boxScaling = new Vector3(boxWidth, boxHeight, boxDepth);
        const matrix = Matrix4.identity().translate(boxCenter).scale(boxScaling);
        return [
            [`instances[${i}].u_model`, {value: matrix.array}],
            [`instances[${i}].u_color`, {value: [1, 0, 0]}]
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
            const boxScaling = new Vector3(boxWidth, boxHeight, boxDepth);
            const matrix = Matrix4.identity().translate(boxCenter).scale(boxScaling);
            return [
                [`instances[${entitiesCount + i}].u_model`, {value: matrix.array}],
                [`instances[${entitiesCount + i}].u_color`, {value: [0, 1, 0]}]
            ];
        })
    ).concat([
        [`instances[${entitiesCount + octantsCount}].u_model`, {value: selectionMatrix.array}],
        [`instances[${entitiesCount + octantsCount}].u_color`, {value: [0, 0, 1]}]
    ]);
    
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
                    "instances[0].u_model": { value: cubeTransform.matrix.array },
                    "instances[0].u_color": { value: [1, 0, 0] },
                    "instances[0].u_model": { value: quadTransform.matrix.array },
                    "instances[0].u_color": { value: [0, 1, 0] },
                    "instances[1].u_model": { value: cubeTransform.matrix.clone().translate(new Vector3(1, 1, 1)).array },
                    "instances[1].u_color": { value: [0, 0, 1] },
                    "instances[1].u_model": { value: quadTransform.matrix.clone().translate(new Vector3(1, 1, 1)).array },
                    "instances[1].u_color": { value: [0, 1, 1] }
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
            instanceCount: instancesCount
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

        WebGLPacketUtilities.setPacketValues(gl, cubePacket, {
            uniformBlocks: {
                basicModelBlock: {
                    uniforms: {
                        [`instances[${instancesCount - 1}].u_model`]: {value: selectionMatrix.array}
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