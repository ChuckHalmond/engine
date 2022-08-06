import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { CameraHelper } from "../../engine/core/rendering/helpers/CameraHelper";
import { GridHelper } from "../../engine/core/rendering/helpers/GridHelper";
import { Camera } from "../../engine/core/rendering/scenes/cameras/Camera";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { BoundingBox } from "../../engine/core/rendering/scenes/geometries/bounding/BoundingBox";
import { GeometryBuffer } from "../../engine/core/rendering/scenes/geometries/GeometryBuffer";
import { Octree } from "../../engine/core/rendering/scenes/geometries/lib/Octree";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { BufferDataUsage } from "../../engine/core/rendering/webgl/WebGLBufferUtilities";
import { WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, TestFunction, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { AttributeDataType, DrawMode, WebGLVertexArrayUtilities } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Plane } from "../../engine/libs/maths/geometry/primitives/Plane";
import { Space } from "../../engine/libs/maths/geometry/space/Space";

function projectedInterval(a: Vector3, b: Vector3, points: Vector3[]): Vector3[] {
    const ab = b.clone().sub(a);
    return points.map(p => {
        const ap = p.clone().sub(a);
        const dot = ap.dot(ab);
        return ap.copy(a).add(ab.scale(dot / ab.dot(ab)));
    });
}

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

    
    let selectionMatrix = new Matrix4();
    /*let updateSelection: Function;

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
            const boxScaling = new Vector3(boxWidth, boxHeight, boxDepth);
            selectionMatrix.setIdentity().translate(boxCenter).scale(boxScaling);
        };
        return input;
    });*/

    let controlledCamera: Camera;

    const cameraSwitch = document.createElement("input");
    cameraSwitch.type = "checkbox";
    cameraSwitch.onchange = () => {
        const {checked} = cameraSwitch;
        controlledCamera = checked ? cullingCamera : defaultCamera;
        cameraControl.camera = controlledCamera;
    };

    document.body.append(
        cameraSwitch, playpause, canvas
    );

    const linesVert = await fetch("assets/engine/shaders/common/multi/lines.vert").then(resp => resp.text());
    const linesFrag = await fetch("assets/engine/shaders/common/multi/lines.frag").then(resp => resp.text());

    const fov = (1 / 3) * Math.PI;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 1000;

    const cullingCamera = new PerspectiveCamera(fov, aspect, 0.1, 10);
    cullingCamera.transform.setTranslation(new Vector3([0, 0, 15]));

    /*const defaultCamera = new PerspectiveCamera(fov, aspect, zNear, zFar);
    defaultCamera.transform.setTranslation(
        cullingCamera.transform
            .getTranslation(new Vector3())
            .add(
                cullingCamera.transform.getForward(new Vector3())
            )
    );
    defaultCamera.transform.lookAt(
        cullingCamera.transform.getTranslation(new Vector3()),
        Space.up
    );*/

    const defaultCamera = new PerspectiveCamera(fov, aspect, zNear, zFar);
    defaultCamera.transform.setTranslation(
        Space.left.clone().scale(25).add(
            Space.forward.clone().scale(15)
        )
    );
    defaultCamera.transform.lookAt(
        Space.origin,
        Space.up
    );

    const cullingCameraHelper = new CameraHelper(cullingCamera);
    const cameraLines = cullingCameraHelper.geometry.getAttribute("a_position")!;
    const cameraColors = cullingCameraHelper.geometry.getAttribute("a_color")!;

    
    controlledCamera = defaultCamera;
    const cameraControl = new FreeCameraControl(controlledCamera);

    const gridHelper = new GridHelper({
        size: 100,
        divisions: 100
    });
    const gridLines = gridHelper.geometry.getAttribute("a_position")!;
    const gridColors = gridHelper.geometry.getAttribute("a_color")!;

    const cubeGeometry = new CubeGeometry();
    const cubeGeometryBuilder = cubeGeometry.toBuilder();
    const cubeLinesArray = cubeGeometryBuilder.verticesArray();
    const cubeLinesIndicesArray = cubeGeometryBuilder.linesIndicesArray();

    const rootScaling = 32;
    const rootBox = new BoundingBox(
        new Vector3(-rootScaling, -rootScaling, -rootScaling),
        new Vector3(rootScaling, rootScaling, rootScaling)
    );

    const entityBoxScalingRatio = 1;
    const entityBoxTranslationRatio = rootScaling / 2;

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
    const instancesCount = entitiesCount/* + octantsCount*/;
    const entities = [...staticEntities, ...nonStaticEntities];
    
    let highlightedEntity: {
        box: BoundingBox;
    };
    (window as any)["entities"] = entities;
    (window as any)["highlightEntity"] = (entity: {
        box: BoundingBox;
    }) => {
        highlightedEntity = entity;
    };
    /*console.table(
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
    );*/

    function getBoxMatrix(box: BoundingBox) {
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
        return matrix;
    }

    const uniformEntries = entities.flatMap((entity_i, i) => {
        const matrix = getBoxMatrix(entity_i.box);
        return [
            [`instances[${i}].u_model`, {value: matrix.array}],
            [`instances[${i}].u_color`, {value: [1, 0, 0]}]
        ];
    })/*.concat(
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
    )*/;
    
    const cubePacket = WebGLPacketUtilities.createPacket(gl, {
        program: {
            vertexSource: linesVert,
            fragmentSource: linesFrag
        },
        vertexArray: {
            vertexAttributes: {
                a_position: { array: cubeLinesArray, type: AttributeDataType.VEC3 },
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
                uniforms: Object.fromEntries(uniformEntries)
            },
            viewBlock: {
                uniforms: {
                    u_view: { value: defaultCamera.view.array },
                    u_projection: { value: defaultCamera.projection.array }
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

    const cameraPacket = WebGLPacketUtilities.createPacket(gl, {
        program: {
            vertexSource: linesVert,
            fragmentSource: linesFrag
        },
        vertexArray: {
            vertexAttributes: {
                a_position: cameraLines,
                a_color: cameraColors
            }
        },
        uniformBuffers: [
            {
                usage: BufferDataUsage.STATIC_READ
            },
            cubePacket.uniformBlocks!.viewBlock.buffer!
        ],
        uniformBlocks: {
            basicModelBlock: {
                buffer: 0,
                uniforms: {
                    "instances[0].u_model": { value: cullingCamera.transform.array },
                }
            },
            viewBlock: {
                buffer: 1
            }
        },
        drawCommand: {
            mode: DrawMode.LINES,
            elementsCount: cameraLines.array.length
        }
    });
    if (cameraPacket === null) return;

    const gridPacket = WebGLPacketUtilities.createPacket(gl, {
        program: {
            vertexSource: linesVert,
            fragmentSource: linesFrag
        },
        vertexArray: {
            vertexAttributes: {
                a_position: gridLines,
                a_color: gridColors
            }
        },
        uniformBuffers: [
            {
                usage: BufferDataUsage.STATIC_READ
            },
            cubePacket.uniformBlocks!.viewBlock.buffer!
        ],
        uniformBlocks: {
            basicModelBlock: {
                buffer: 0,
                uniforms: {
                    "instances[0].u_model": { value: cullingCamera.transform.array },
                }
            },
            viewBlock: {
                buffer: 1
            }
        },
        drawCommand: {
            mode: DrawMode.LINES,
            elementsCount: gridLines.array.length
        }
    });
    if (gridPacket === null) return;
    
    
    WebGLRendererUtilities.viewport(gl, 0, 0, canvas.width, canvas.height);
    WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);
    WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
    WebGLRendererUtilities.clearColor(gl, Color.WHITE);

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

        const {frustrum} = cullingCamera;
        frustrum.setFromPerspectiveMatrix(cullingCamera.viewProjection);

        
        const temp = new Vector3();
        const separatingAxis = frustrum.separatingAxis();
        const uniformEntries = entities.flatMap((entity_i, i) => {
            let visible = cullingCamera.frustrum.intersectsBox(entity_i.box);
            if (visible) {
                const extents = entity_i.box.extents();
                visible = separatingAxis.some(
                    ([a, b]) => {
                        const axis = b.clone().sub(a);
                        const middle = b.clone().add(a).scale(0.5);
                        const halfSize = axis.length() / 2;
                        const interval = projectedInterval(a, b, extents);
                        const overlap = interval.some(
                            point => temp.copy(point).sub(middle).length() < halfSize
                        );
                        return overlap;
                    }
                )
            };
            return [
                [`instances[${i}].u_color`, {value: Array.from(/*entity_i === highlightedEntity ? Color.YELLOW : */visible ? Color.BLUE : Color.RED)}]
            ];
        });/*.concat(octants.flatMap((octant_i, i) => {
            const transformedBox = octant_i.region.transformed(invertedView);
            const visible = cullingCamera.frustrum.intersectsBox(transformedBox);
            return [
                [`instances[${entitiesCount + i}].u_color`, {value: visible ? Array.from(Color.BLUE) : Array.from(Color.GREEN)}]
            ];
        }));*/

        WebGLPacketUtilities.setPacketValues(gl, cubePacket, {
            uniformBlocks: {
                basicModelBlock: {
                    uniforms: Object.fromEntries(uniformEntries)
                },
                viewBlock: {
                    uniforms: {
                        u_view: { value: controlledCamera.view.array },
                        u_projection: { value: controlledCamera.projection.array }
                    }
                }
            }
        });

        WebGLPacketUtilities.setPacketValues(gl, cameraPacket, {
            uniformBlocks: {
                basicModelBlock: {
                    uniforms: {
                        "instances[0].u_model": { value: cullingCamera.transform.array },
                    }
                }
            }
        });

        //WebGLPacketUtilities.drawPacket(gl, gridPacket);
        WebGLPacketUtilities.drawPacket(gl, cubePacket);
        WebGLPacketUtilities.drawPacket(gl, cameraPacket);
        
        Input.clear();

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}