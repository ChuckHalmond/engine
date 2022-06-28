import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { ConeGeometry } from "../../engine/core/rendering/scenes/geometries/euclidian/ConeGeometry";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { Packet, PacketProperties, WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, WindingOrder, WebGLRendererUtilities, TestFunction, BlendingMode, BlendingEquation } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { AttributeDataType, DrawMode } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Space } from "../../engine/libs/maths/geometry/space/Space";
import { addWidgets, createPositionWidgets, createRotationWidgets } from "./Common";

export async function wireframe() {
  const widgets = document.createElement("div");
  widgets.id = "widgets";
  const canvas = document.createElement("canvas");
  document.body.append(widgets, canvas);

  const gl = canvas.getContext("webgl2");
  if (!gl) {
      console.error("webgl2 not available.");
      return;
  }

  gl.canvas.width = 600;
  gl.canvas.height = 600;

  const wireframeVertex = await fetch("assets/engine/shaders/common/wireframe.vert.glsl").then(resp => resp.text());
  const wireframeFragment = await fetch("assets/engine/shaders/common/wireframe.frag.glsl").then(resp => resp.text());
  const linesVertex = await fetch("assets/engine/shaders/common/lines.vert.glsl").then(resp => resp.text());
  const linesFragment = await fetch("assets/engine/shaders/common/lines.frag.glsl").then(resp => resp.text());

  const wireframeProgram = WebGLProgramUtilities.createProgram(gl, wireframeVertex, wireframeFragment);
  const linesProgram = WebGLProgramUtilities.createProgram(gl, linesVertex, linesFragment);

  if (wireframeProgram == null || linesProgram == null) {
    console.error("program null.");
    return;
  }

  const linesBindings = WebGLPacketUtilities.createBindings(gl, {
    program: linesProgram,
    uniformBlocks: ["viewBlock", "linesBlock"]
  });

  if (linesBindings == null) {
    console.error("bindings null.");
    return;
  }

  const viewBlock = linesBindings.uniformBlocks.viewBlock;
  const linesBlock = linesBindings.uniformBlocks.linesBlock;

  const camera = new PerspectiveCamera(
    (1 / 3) * Math.PI,
    gl.canvas.width / gl.canvas.height,
    1,
    1000
  );
  camera.transform.setTranslation(new Vector3([0, 0, 10]));
  camera.transform.lookAt(new Vector3([0, 0, 0]), Space.up);

  const cameraMat = camera.transform.matrix;
  const viewProjection = camera.projection.clone().mult(cameraMat.clone().invert());
  
  const cubeGeometry =
    /*new CubeGeometry({width: 2, height: 0.5, depth: 5})*/
    /*new QuadGeometry({widthSegment: 4, heightSegment: 8})*/
    new ConeGeometry();
  const cubeTransform = new Transform();
  const cubeLines = cubeGeometry.toBuilder().linesArray();
  
  const wireframeProps: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: {
          array: cubeLines,
          type: AttributeDataType.VEC3
        }
      },
      numElements: cubeLines.length / 2
    },
    uniformBlocks: [
      {
        block: viewBlock,
        uniforms: {
          u_worldViewProjection: {
            value: new Float32Array(viewProjection.clone().mult(cubeTransform.getMatrix(new Matrix4())).array),
          }
        }
      },
      {
        block: linesBlock,
        uniforms: {
          u_color: {
            value: new Float32Array([0, 255, 0]),
          }
        }
      }
    ],
    options: {
      drawMode: DrawMode.LINES
    }
  };

  const wireframePacket = WebGLPacketUtilities.createPacket(gl, linesProgram, wireframeProps);
  if (wireframePacket == null) {
    return console.error("vertWireframePacket null.");
  }
  
  WebGLRendererUtilities.viewport(gl, 0, 0, gl.canvas.width, gl.canvas.height);
  WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);

  /*WebGLRendererUtilities.enable(gl, Capabilities.BLEND);
  WebGLRendererUtilities.blendEquation(gl, BlendingEquation.FUNC_ADD);
  WebGLRendererUtilities.blendFunction(gl, BlendingMode.SRC_ALPHA, BlendingMode.ONE_MINUS_SRC_ALPHA);*/

  WebGLRendererUtilities.frontFace(gl, WindingOrder.CW);

  await Input.initialize(gl.canvas);
  const cameraControl = new ArcballCameraControl(camera, cubeTransform);

  let frameTime = 0;
  let deltaTime = 0;
  let lastFrameTime = 0;
  function render(frameTime: number) {
    if (gl === null || wireframePacket === null) {
      return;
    }
    frameTime *= 0.001;

    deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;

    cameraControl.update(deltaTime);

    WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT);

    WebGLPacketUtilities.setPacketValues(gl, wireframePacket, {
      uniformBlocks: [
        {
          block: viewBlock,
          buffer: wireframePacket.uniformBlocks!.viewBlock.buffer,
          uniforms: {
            u_worldViewProjection: { value: new Float32Array(camera.viewProjection.mult(cubeTransform.matrix).array) }
          }
        }
      ]
    });

    WebGLPacketUtilities.drawPacket(gl, wireframePacket);

    Input.clear();
    requestAnimationFrame(render);
  }

  render(frameTime);
}