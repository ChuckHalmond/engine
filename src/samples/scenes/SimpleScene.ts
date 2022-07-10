import { IcosahedronGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/IcosahedronGeometry";
import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { GeometryBuffer } from "../../engine/core/rendering/scenes/geometries/GeometryBuffer";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { BufferDataUsage } from "../../engine/core/rendering/webgl/WebGLBufferUtilities";
import { FramebufferAttachment, FramebufferTextureTarget, RenderbufferPixelFormat, WebGLFramebufferUtilities } from "../../engine/core/rendering/webgl/WebGLFramebufferUtilities";
import { WebGLPacketUtilities, PacketProperties } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, TestFunction, WebGLRendererUtilities, WindingOrder } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { TexturePixelFormat, TexturePixelType, TextureMagFilter, TextureMinFilter, TextureTarget, TextureWrapMode, WebGLTextureUtilities, TextureInternalPixelFormat } from "../../engine/core/rendering/webgl/WebGLTextureUtilities";
import { WebGLUniformBlockUtilities } from "../../engine/core/rendering/webgl/WebGLUniformBlockUtilities";
import { AttributeDataType } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
import { Quaternion } from "../../engine/libs/maths/algebra/quaternions/Quaternion";
import { Vector3, Vector3Values } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Space } from "../../engine/libs/maths/geometry/space/Space";
import { addWidgets, createPositionWidgets, createRelativePositionWidgets, createRotationWidgets } from "./Common";
import { SphereGeometry } from "../../engine/core/rendering/scenes/geometries/lib/SphereGeometry";
import { CylinderGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CylinderGeometry";
import { DodecahedronGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/DodecahedronGeometry";

const simpleSceneDOM = /*template*/`
<!--<link rel="stylesheet" href="./css/main.css"/>-->
  <div class="flex-auto flex-cols">
    <main class="flex-rows flex-auto">
        <section class="centered padded">
          <div id="ui" class="flex-cols">
            <div class="flex-none">FPS: <span id="canvas-fps">-.-</span><button id="playpause">Pause</button></div>
          </div>
          <div id="widgets"></div>
          <canvas id="canvas" tabindex="0" tooltip="mon-canvas" oncontextmenu="return false;"></canvas>
          <style>
            circle:hover {
              fill: rgb(255, 0, 0);
            }
          </style>
          <!--<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
            <circle cx="10" cy="10" r="4"/>
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200" id="save" fill="none">
            <g>
              <rect x="0" y="0" width="100" height="100" fill="red"></rect>
              <text text-anchor="middle" alignment-baseline="middle" x="50" y="50" font-family="Verdana" fill="blue">Hello,World!</text>
            </g>
          </svg>-->
        </section>
    </main>
  </div>`;

export async function start() {
  const template = document.createElement("template");
  template.innerHTML = simpleSceneDOM;
  document.body.insertBefore(template.content, document.body.firstChild);

  /*let onCapture = false;
  const handlePointerUpEvent = (event: PointerEvent) => {
    const {target, pointerId} = event;
    if (target instanceof Element && target.tagName == "circle") {
      (<Element>target).releasePointerCapture(pointerId);
      onCapture = false;
    }
  }
  const handlePointerDownEvent = (event: PointerEvent) => {
    const {target, pointerId} = event;
    if (target instanceof Element && target.tagName == "circle") {
      (<Element>target).setPointerCapture(pointerId);
      onCapture = true;
    }
  }
  const handlePointerOutEvent = (event: PointerEvent) => {
    const {target, pointerId} = event;
    if (target instanceof Element && target.tagName == "circle") {
      (<Element>target).releasePointerCapture(pointerId);
      onCapture = false;
    }
  }
  const handlePointerMoveEvent = (event: PointerEvent) => {
    if (onCapture) {
      const {currentTarget, clientX, clientY} = event;
      const svg = <Element>currentTarget;
      const {
        right: svgRight, left: svgLeft, width: svgWidth,
        bottom: svgBottom, top: svgTop, height: svgHeight
      } = svg.getBoundingClientRect();
      const {target} = event;
      const targetElement = <Element>target;
      const [viewMinX, viewMinY, viewMaxX, viewMaxY] = svg.getAttribute("viewBox")!.split(" ").map(value => parseFloat(value));
      const offsetX = (Math.min(svgRight, Math.max(clientX, svgLeft)) - svgLeft) / svgWidth;
      const offsetY = (Math.min(svgBottom, Math.max(clientY, svgTop)) - svgTop) / svgHeight;
      const newTargetX = Math.round(offsetX * (viewMaxX - viewMinX));
      const newTargetY = Math.round(offsetY * (viewMaxY - viewMinY));
      targetElement.setAttribute("cx", `${newTargetX}`);
      targetElement.setAttribute("cy", `${newTargetY}`);
    }
  }
  const svg = document.querySelector("svg");
  svg!.addEventListener("pointerdown", handlePointerDownEvent);
  svg!.addEventListener("pointermove", handlePointerMoveEvent);
  svg!.addEventListener("pointerup", handlePointerUpEvent);
  svg!.addEventListener("pointerout", handlePointerOutEvent);*/

  try {
    launchScene();
  }
  catch (e) {
    console.trace(e);
  }
}

export async function launchScene() {
  let frameRequest: number;
  let render: (time: number) => void;
  let fps: number = 0;
  let paused = false;

  const playPause = document.getElementById('playpause') as HTMLButtonElement;
  if (playPause !== null) {
    playPause.onclick = () => {
      paused = !paused;
      playPause.textContent = paused ? "Play" : "Pause";
      if (!paused) {
        render(0);
      }
    };
  }

  const fpsElement = document.getElementById('canvas-fps') as HTMLSpanElement;
  if (!fpsElement) {
    return;
  }

  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  if (!canvas) {
    return;
  }
  
  const canvasWidth = 800;
  const canvasHeight = 600;
  const supersamplingRatio = 1;
  canvas.width = canvasWidth * supersamplingRatio;
  canvas.height = canvasHeight * supersamplingRatio;
  canvas.style.width = `${canvasWidth}px`;
  canvas.style.height = `${canvasHeight}px`;
  
  const gl = canvas.getContext("webgl2", {alpha: false}/*, {antialias: true}*//*, {preserveDrawingBuffer: true}*/);
  console.log(gl);
  if (!gl) {
    return;
  }

  WebGLTextureUtilities.setUnpackAlignment(gl, 1);

  // Shaders
  const phongVert = await fetch("assets/engine/shaders/common/phong.vert.glsl").then(resp => resp.text());
  const phongFrag = await fetch("assets/engine/shaders/common/phong.frag.glsl").then(resp => resp.text());
  const phongGlProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: phongVert, fragmentSource: phongFrag});
  if (phongGlProgram == null) return;

  const skyboxVert = await fetch("assets/engine/shaders/common/skybox.vert").then(resp => resp.text());
  const skyboxFrag = await fetch("assets/engine/shaders/common/skybox.frag").then(resp => resp.text());
  const skyboxGlProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: skyboxVert, fragmentSource: skyboxFrag});
  if (skyboxGlProgram == null) return;
  
  const textureVert = await fetch("assets/engine/shaders/common/texture.vert").then(resp => resp.text());
  const textureFrag = await fetch("assets/engine/shaders/common/texture.frag").then(resp => resp.text());
  const texGlProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: textureVert, fragmentSource: textureFrag});
  if (texGlProgram == null) return;

  const basicVert = await fetch("assets/engine/shaders/common/basic.vert.glsl").then(resp => resp.text());
  const basicFrag = await fetch("assets/engine/shaders/common/basic.frag.glsl").then(resp => resp.text());
  const basicGlProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: basicVert, fragmentSource: basicFrag});
  if (basicGlProgram == null) return;
  
  const depthVert = await fetch("assets/engine/shaders/common/depth.vert.glsl").then(resp => resp.text());
  const depthFrag = await fetch("assets/engine/shaders/common/depth.frag.glsl").then(resp => resp.text());
  const depthGlProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: depthVert, fragmentSource: depthFrag});
  if (depthGlProgram == null) return;

  async function fetchImage(url: string) {
    return fetch(url).then((resp) => {
      if (resp.ok) {
        return new Promise<HTMLImageElement>((resolve) => {
          const img = new Image();
          img.onload = () => {
            resolve(img);
          };
          img.src = url;
        })
      }
      else {
        throw new Error(`Image '${url}' not found.`);
      }
    });
  }
  // Images
  const albedoMapImg = await fetchImage("assets/engine/img/NormalMap.png");
  const normalMapImg = await fetchImage("assets/engine/img/NormalMap_0.png");
  const heightMapImg = await fetchImage("assets/engine/img/HeightMap_0.png");
  const skyboxXPosImg = await fetchImage("assets/engine/img/skybox_x_pos.png");
  const skyboxXNegImg = await fetchImage("assets/engine/img/skybox_x_neg.png");
  const skyboxYPosImg = await fetchImage("assets/engine/img/skybox_y_pos.png");
  const skyboxYNegImg = await fetchImage("assets/engine/img/skybox_y_neg.png");
  const skyboxZPosImg = await fetchImage("assets/engine/img/skybox_z_pos.png");
  const skyboxZNegImg = await fetchImage("assets/engine/img/skybox_z_neg.png");

  /*const norm16Extension = gl.getExtension("EXT_texture_norm16");
  if (norm16Extension) {
    console.log(`Extension EXT_texture_norm16 activated.`);
  }*/

  const phongPacketBindings = WebGLPacketUtilities.createBindings(gl, {
    program: phongGlProgram,
    textures: ["albedoMap", "normalMap", "heightMap", "skybox", "fbColorTex", "depthTex"],
    uniformBlocks: ["viewBlock", "modelBlock", "lightsBlock", "phongBlock"]
  })!; 

  const basicPacketBindings = WebGLPacketUtilities.createBindings(gl, {
    program: basicGlProgram,
    uniformBlocks: ["viewBlock", "basicModelBlock"]
  })!;

  const {uniformBlocks: phongPacketBlocks} = phongPacketBindings;
  const {uniformBlocks: basicPacketBlocks} = basicPacketBindings;

  const phongPacketBuffers = WebGLUniformBlockUtilities.createRangedUniformBuffers(gl,
    Object.values(phongPacketBindings.uniformBlocks), BufferDataUsage.DYNAMIC_DRAW
  )!;

  const {albedoMap, normalMap, heightMap, skybox, fbColorTex, depthTex} = phongPacketBindings.textures;

  /*const anisotropicExtension = gl.getExtension("EXT_texture_filter_anisotropic");
  if (anisotropicExtension) {
    console.log(`Extension EXT_texture_filter_anisotropic activated.`);
    const maxFiltering = gl.getParameter(anisotropicExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    const textures = [albedoMap, normalMap];
    textures.forEach((texture) => {
      gl.activeTexture(gl.TEXTURE0 + texture.unit);
      gl.bindTexture(gl.TEXTURE_2D, texture.internal);
      gl.texParameterf(gl.TEXTURE_2D, anisotropicExtension.TEXTURE_MAX_ANISOTROPY_EXT, maxFiltering);
    });
  }*/

  const cubeGeometry =
    //new QuadGeometry({height: 4, width: 4});
    new CubeGeometry({width: 2, height: 2, depth: 2}/*{widthSegments: 64, heightSegments: 64}*/);
    //new SphereGeometry({widthSegments: 64, heightSegments: 64});
    //new CylinderGeometry();
    //new DodecahedronGeometry();

  const cubeGeometryBuilder = cubeGeometry.toBuilder();
  const quad = new QuadGeometry({height: 2, width: 2});
  const quadGeometryBuilder = quad.toBuilder();
  const cube = new Transform();

  const fov = (1 / 3) * Math.PI;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100;

  const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
  camera.transform.setTranslation(new Vector3([0, 4, 4]));
  camera.transform.lookAt(new Vector3([0, 0, 0]), Space.up);

  const lightTransform = new Transform();
  lightTransform.setTranslation(new Vector3([0, 2, 2]));
  lightTransform.setScaling(new Vector3([0.2, 0.2, 0.2]));

  camera.transform.setTranslation(lightTransform.getTranslation(new Vector3()).scale(2));
  camera.transform.lookAt(new Vector3([0, 0, 0]), Space.up);

  const viewDirectionProjectionInverse = camera.projection.clone().mult(new Matrix4().setIdentity().setRotation(camera.view.getRotation())).invert();

  addWidgets([
    ...createRotationWidgets(cube, "Cube"),
    ...createPositionWidgets(cube, "Cube"),
    ...createRelativePositionWidgets(cube, "Cube"),
    ...createRelativePositionWidgets(camera.transform, "Camera"),
  ]);

  const cubeVertices = cubeGeometryBuilder.verticesArray();
  const cubeIndices = cubeGeometryBuilder.indicesArray();
  const cubeNormals = cubeGeometryBuilder.verticesNormalsArray();
  const cubeUVs = cubeGeometryBuilder.uvsArray();
  const cubeTangents = cubeGeometryBuilder.tangentsArray();

  const cubeGeometryBuffer = new GeometryBuffer({
    a_position: { array: cubeVertices, type: AttributeDataType.VEC3 },
    a_normal: { array: cubeNormals, type: AttributeDataType.VEC3 },
    a_tangent: { array: cubeTangents, type: AttributeDataType.VEC3 },
    a_uv: { array: cubeUVs, type: AttributeDataType.VEC2 },
  }, true);

  const phongCubePacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: cubeGeometryBuffer.getAttribute("a_position")!,
        a_normal: cubeGeometryBuffer.getAttribute("a_normal")!,
        a_tangent: cubeGeometryBuffer.getAttribute("a_tangent")!,
        a_uv: cubeGeometryBuffer.getAttribute("a_uv")!
      },
      indices: cubeIndices,
      elementsCount: cubeIndices.length,
      interleave: true
    },
    uniformBlocks: [
      {
        block: phongPacketBlocks.viewBlock,
        buffer: phongPacketBuffers.viewBlock,
        uniforms: {
          u_view: { value: camera.view.array },
          u_projection: { value: camera.projection.array },
        }
      },
      {
        block: phongPacketBlocks.modelBlock,
        buffer: phongPacketBuffers.modelBlock,
        uniforms: {
          "models[0].u_model": { value: cube.matrix.array },
          "models[0].u_modelView": { value: camera.view.mult(cube.matrix).array },
          "models[0].u_normal": { value: camera.view.mult(cube.matrix).invert().transpose().array }
        }
      },
      {
        block: phongPacketBlocks.lightsBlock,
        buffer: phongPacketBuffers.lightsBlock,
        uniforms: {
          "lights[0].u_lightWorldPos": { value: Array.from(lightTransform.getTranslation(new Vector3())) },
          "lights[0].u_lightDirection": { value: Array.from(lightTransform.getBackward(new Vector3())) },
          "lights[0].u_cutOff": { value: (12.5 / 360) * Math.PI },
          "lights[0].u_lightColor": { value: [1, 0.8, 0.8] }
        }
      },
      {
        block: phongPacketBlocks.phongBlock,
        buffer: phongPacketBuffers.phongBlock,
        uniforms: {
          u_ambientColor: { value: [0.1, 0.1, 0.1] },
          u_diffuseColor: { value: [0.8, 0, 0] },
          u_specularColor: { value: [1, 1, 1] },
          u_ambientFactor: { value: 1 },
          u_diffuseFactor: { value: 1 },
          u_specularFactor: { value: 1 },
          u_shininess: { value: 36 },
          u_constant: { value: 1}, 
          u_linear: { value: 0.09},
          u_quadratic: { value: 0.032 }
        }
      }
    ],
    uniforms: {
      u_albedoMap: { value: albedoMap },
      u_normalMap: { value: normalMap },
      u_heightMap: { value: heightMap }
    },
    textures: [
      {
        texture: albedoMap,
        properties: {
          pixels: null,
          width: 8, height: 8, depth: 2,
          // pixels: albedoMapImg,
          // width: albedoMapImg.width, height: albedoMapImg.height,
          target: TextureTarget.TEXTURE_2D_ARRAY,
          type: TexturePixelType.UNSIGNED_BYTE,

          /*wrapS: TextureWrapMode.CLAMP_TO_EDGE,
          wrapT: TextureWrapMode.CLAMP_TO_EDGE,
          wrapR: TextureWrapMode.CLAMP_TO_EDGE,*/

          format: TexturePixelFormat.LUMINANCE,
          internalFormat: TextureInternalPixelFormat.LUMINANCE,

          // format: TexturePixelFormat.RGB,
          // internalFormat: TextureInternalPixelFormat.RGB

          min: TextureMinFilter.NEAREST,
          mag: TextureMagFilter.NEAREST,

          subimages: [
            {
              pixels: new Uint8Array([
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
                0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC,
                0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF, 0xCC, 0xFF,
              ]),
              xoffset: 0,
              yoffset: 0,
              zoffset: 0,
              width: 8,
              height: 8,
              depth: 1
            },
            {
              pixels: new Uint8Array([
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
                0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC, 0xCC,
              ]),
              xoffset: 0,
              yoffset: 0,
              zoffset: 1,
              width: 8,
              height: 8,
              depth: 1
            }
          ]
          // format: TexturePixelFormat.RGBA,
          // internalFormat: TextureInternalPixelFormat.RGBA8
        }
      },
      {
        texture: normalMap,
        properties: {
          pixels: normalMapImg,
          width: normalMapImg.width, height: normalMapImg.height,
          target: TextureTarget.TEXTURE_2D,
          type: TexturePixelType.UNSIGNED_BYTE,
          format: TexturePixelFormat.RGB,
          internalFormat: TextureInternalPixelFormat.RGB8,
          min: TextureMinFilter.LINEAR_MIPMAP_LINEAR,
          mag: TextureMagFilter.LINEAR
        }
      },
      {
        texture: heightMap,
        properties: {
          pixels: heightMapImg,
          width: heightMapImg.width, height: heightMapImg.height,
          target: TextureTarget.TEXTURE_2D,
          type: TexturePixelType.UNSIGNED_BYTE,
          format: TexturePixelFormat.RGBA,
          internalFormat: TextureInternalPixelFormat.RGBA8
        }
      },
      {
        texture: skybox,
        properties: {
          pixels: {
            xPos: skyboxXPosImg, xNeg: skyboxXNegImg,
            yPos: skyboxYPosImg, yNeg: skyboxYNegImg,
            zPos: skyboxZPosImg, zNeg: skyboxZNegImg
          },
          width: skyboxXPosImg.width, height: skyboxXPosImg.height,
          target: TextureTarget.TEXTURE_CUBE_MAP,
          type: TexturePixelType.UNSIGNED_BYTE,
          format: TexturePixelFormat.RGBA,
          internalFormat: TextureInternalPixelFormat.RGBA8
        }
      },
      {
        texture: fbColorTex,
        properties: {
          width: canvas.width, height: canvas.height,
          pixels: null,
          target: TextureTarget.TEXTURE_2D,
          type: TexturePixelType.UNSIGNED_BYTE,
          format: TexturePixelFormat.RGBA,
          internalFormat: TextureInternalPixelFormat.RGBA8,
          mag: TextureMagFilter.LINEAR,
          min: TextureMinFilter.LINEAR,
          wrapS: TextureWrapMode.CLAMP_TO_EDGE,
          wrapT: TextureWrapMode.CLAMP_TO_EDGE,
          wrapR: TextureWrapMode.CLAMP_TO_EDGE,
        }
      },
      {
        texture: depthTex,
        properties: {
          width: canvas.width, height: canvas.height,
          pixels: null,
          target: TextureTarget.TEXTURE_2D,
          type: TexturePixelType.UNSIGNED_INT,
          format: TexturePixelFormat.DEPTH_COMPONENT,
          internalFormat: TextureInternalPixelFormat.DEPTH_COMPONENT24,
          wrapS: TextureWrapMode.CLAMP_TO_EDGE,
          wrapT: TextureWrapMode.CLAMP_TO_EDGE,
          wrapR: TextureWrapMode.CLAMP_TO_EDGE,
          mag: TextureMagFilter.NEAREST,
          min: TextureMinFilter.NEAREST,
        }
      }
    ]
  };

  const basicPacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: { array: cubeVertices, type: AttributeDataType.VEC3 },
      },
      indices: cubeIndices,
      elementsCount: cubeIndices.length
    },
    uniformBlocks: [
      {
        block: basicPacketBlocks.basicModelBlock,
        uniforms: {
          u_model: { value: lightTransform.matrix.array },
          u_color: { value: [1, 1, 0] }
        }
      },
      {
        block: basicPacketBlocks.viewBlock,
        buffer: phongPacketBuffers.viewBlock,
      }
    ]
  };

  const quadIndices = quadGeometryBuilder.indicesArray();
  const quadVertices = quadGeometryBuilder.verticesArray();
  const quadUVs = quadGeometryBuilder.uvsArray();
  const quadWorld = new Matrix4().setIdentity();

  const skyboxPacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: { array: quadVertices, type: AttributeDataType.VEC3 },
      },
      indices: quadIndices,
      elementsCount: quadIndices.length
    },
    uniforms: {
      u_world: { value: quadWorld.array },
      u_viewDirectionProjectionInverse: { value: viewDirectionProjectionInverse.array }, 
      u_skybox: { value: skybox },
    }
  };

  const depthPacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: { array: quadVertices, type: AttributeDataType.VEC3 },
        a_uv: { array: quadUVs, type: AttributeDataType.VEC2 },
      },
      indices: quadIndices,
      elementsCount: quadIndices.length
    },
    uniforms: {
      u_world: { value: quadWorld.array },
      u_tex: { value: depthTex }
    }
  };

  const texPacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: { array: quadVertices, type: AttributeDataType.VEC3 },
        a_uv: { array: quadUVs, type: AttributeDataType.VEC2 },
      },
      indices: quadIndices,
      elementsCount: quadIndices.length
    },
    uniforms: {
      u_world: { value: quadWorld.array },
      u_tex: { value: fbColorTex }
    }
  };

  
  console.log(phongCubePacketProperties);
  const phongCubePacket = WebGLPacketUtilities.createPacket(gl, phongGlProgram, phongCubePacketProperties)!;
  const basicPacket = WebGLPacketUtilities.createPacket(gl, basicGlProgram, basicPacketProperties)!;
  const skyboxPacket = WebGLPacketUtilities.createPacket(gl, skyboxGlProgram, skyboxPacketProperties)!;
  const depthPacket = WebGLPacketUtilities.createPacket(gl, depthGlProgram, depthPacketProperties)!;
  const texPacket = WebGLPacketUtilities.createPacket(gl, texGlProgram, texPacketProperties)!;

  const framebuffer = WebGLFramebufferUtilities.createFramebuffer(gl)!;
  const maxSamples = WebGLRendererUtilities.getMaxSamples(gl);
  
  WebGLFramebufferUtilities.attachRenderbuffer(
    gl, framebuffer,
    {
      renderbuffer: WebGLFramebufferUtilities.createRenderbuffer(gl, {
        internalFormat: RenderbufferPixelFormat.DEPTH_COMPONENT24,
        width: canvas.width,
        height: canvas.height,
        samples: maxSamples
      })!,
      attachment: FramebufferAttachment.DEPTH_ATTACHMENT
    },
    {
      renderbuffer: WebGLFramebufferUtilities.createRenderbuffer(gl, {
        internalFormat: RenderbufferPixelFormat.RGBA8,
        width: canvas.width,
        height: canvas.height,
        samples: maxSamples
      })!,
      attachment: FramebufferAttachment.COLOR_ATTACHMENT0,
    }
  );

  const postFramebuffer = WebGLFramebufferUtilities.createFramebuffer(gl)!;

  WebGLFramebufferUtilities.attachTexture(
    gl, postFramebuffer, 
    {
      textureTarget: FramebufferTextureTarget.TEXTURE_2D,
      texture: fbColorTex,
      attachment: FramebufferAttachment.COLOR_ATTACHMENT0
    },
    {
      textureTarget: FramebufferTextureTarget.TEXTURE_2D,
      texture: depthTex,
      attachment: FramebufferAttachment.DEPTH_ATTACHMENT
    }
  );

  WebGLRendererUtilities.viewport(gl, 0, 0, gl.canvas.width, gl.canvas.height);

  //WebGLRendererUtilities.frontFace(gl, WindingOrder.CW);
  WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
  WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);
  
  let lastFrameTime = 0;
  let deltaTime = 0;

  let t = 0;
  let direction = 1;
  
  let initRotation = cube.getRotation(new Quaternion());
  let initPosition = cube.getTranslation(new Vector3());

  const targetPosition = new Vector3([2, -2, -2]);
  const targetRotation = Quaternion.fromAxisAngle(Space.down, Math.PI / 3)/*.mult(Quaternion.fromAxisAngle(Space.forward, Math.PI / 3))*/;
  
  function animate(transform: Transform, initPosition: Vector3, initRotation: Quaternion, targetPosition: Vector3, targetRotation: Quaternion, t: number) {
    transform.setTranslation(
      new Vector3().lerp(initPosition, targetPosition, t)
    );
    transform.setRotation(transform.getRotation(new Quaternion()).slerp(initRotation, targetRotation, t));
  }

  Input.initialize(gl.canvas);
  
  WebGLFramebufferUtilities.unbindFramebuffer(gl);

  const cameraControl = new FreeCameraControl(camera);

  console.log(basicPacket);
  let frame = 0;
  render = function(frameTime: number) {
    ++frame;
    if (paused) {
      return;
    }
    
    frameTime *= 0.001;

    deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;
    fps = 1 / deltaTime;

    fpsElement.textContent = fps.toFixed(0);

    cameraControl.update(deltaTime);
    lightTransform.setMatrix(camera.transform.matrix);

    animate(
      cube,
      initPosition, initRotation,
      targetPosition, targetRotation,
      t
    );
    
    t += deltaTime * direction * 0.5;
    if (t > 2 || t < 0) {
      direction *= -1;
    }
    
    WebGLRendererUtilities.clearColor(gl, Color.GREEN.valuesNormalized());
    WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);
    
    viewDirectionProjectionInverse.copy(camera.projection).mult(new Matrix4().setIdentity().setRotation(camera.view.getRotation())).invert();

    // Framebuffer
    // WebGLFramebufferUtilities.bindFramebuffer(gl, depthFramebuffer);
    WebGLFramebufferUtilities.bindFramebuffer(gl, framebuffer);

    WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);
    WebGLRendererUtilities.depthFunction(gl, TestFunction.LESS);

    WebGLPacketUtilities.setPacketValues(gl, phongCubePacket, {
      uniformBlocks: [
        {
          block: phongPacketBlocks.modelBlock,
          buffer: phongPacketBuffers.modelBlock,
          uniforms: {
            "models[0].u_model": { value: cube.matrix.array },
            "models[0].u_modelView": { value: camera.view.mult(cube.matrix).array },
            "models[0].u_normal": { value: camera.view.mult(cube.matrix).invert().transpose().array },
          }
        },
        {
          block: phongPacketBlocks.viewBlock,
          buffer: phongPacketBuffers.viewBlock,
          uniforms: {
            u_view: { value: camera.view.array },
            u_projection: { value: camera.projection.array },
          }
        },
        {
          block: phongPacketBlocks.lightsBlock,
          buffer: phongPacketBuffers.lightsBlock,
          uniforms: {
            "lights[0].u_lightWorldPos": { value: Array.from(lightTransform.getTranslation(new Vector3())) },
            "lights[0].u_lightDirection": { value: Array.from(lightTransform.getBackward(new Vector3())) },
          }
        }
      ]
    });
    
    WebGLPacketUtilities.drawPacket(gl, phongCubePacket);
    
    WebGLPacketUtilities.drawPacket(gl, basicPacket);
    
    WebGLPacketUtilities.setPacketValues(gl, skyboxPacket, {
      uniforms: {
        u_viewDirectionProjectionInverse: { value: viewDirectionProjectionInverse.array }
      }
    });
    
    WebGLRendererUtilities.depthFunction(gl, TestFunction.LEQUAL);
    WebGLPacketUtilities.drawPacket(gl, skyboxPacket);
    
    // Framebuffer
    WebGLFramebufferUtilities.blit(gl, framebuffer, postFramebuffer,
      [0, 0, canvas.width, canvas.height],
      [0, 0, canvas.width, canvas.height],
      BufferMask.COLOR_BUFFER_BIT,
      TextureMagFilter.LINEAR
    );
    // WebGLFramebufferUtilities.blit(gl, framebuffer, postFramebuffer,
    //   [0, 0, canvas.width, canvas.height],
    //   [0, 0, canvas.width, canvas.height],
    //   BufferMask.DEPTH_BUFFER_BIT,
    //   TextureMagFilter.NEAREST
    // );

    // WebGLFramebufferUtilities.unbindFramebuffer(gl);
    // WebGLPacketUtilities.drawPacket(gl, depthPacket);

    WebGLFramebufferUtilities.unbindFramebuffer(gl);
    WebGLPacketUtilities.drawPacket(gl, texPacket);

    Input.clear();

    frameRequest = requestAnimationFrame(render);
  }

  /*const stream = gl.canvas.captureStream(60);
  const rec = new MediaRecorder(stream, {
    mimeType: "video/webm; codecs=vp9",
    audioBitsPerSecond: 0,
    videoBitsPerSecond: canvas.width * canvas.height * 24 * 60
  });

  const chunks: BlobPart[] = [];
  rec.addEventListener("dataavailable", (event) => {
    chunks.push(event.data);
  });
  rec.addEventListener("stop", () => {
    const blob = new Blob(chunks, {type: "video/webm; codecs=vp9"});
    const anchor = document.createElement("a");
    anchor.download = "recorded.webm";
    anchor.href = URL.createObjectURL(blob);
    anchor.click();
  });
  rec.start();*/
  
  render(0);
  
  // const saveSVG = document.querySelector<SVGSVGElement>("svg#save")!;
  // const getSVGImageData = (svg: SVGSVGElement) => new Promise((resolve: (value: string) => void) => {
  //   const url = URL.createObjectURL(new Blob([svg.outerHTML], {
  //     type: "image/svg+xml"
  //   }));
  //   const svgImage = document.createElement("img");
  //   document.body.appendChild(svgImage);
  //   svgImage.onload = () => {
  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d", {alpha: true})!;
  //     canvas.width = svgImage.clientWidth;
  //     canvas.height = svgImage.clientHeight;
  //     ctx.drawImage(svgImage, 0, 0);
  //     const imgData = canvas.toDataURL("image/png");
  //     resolve(imgData);
  //     URL.revokeObjectURL(url);
  //     svgImage.remove();
  //   };
  //   svgImage.src = url;
  // });

  // getSVGImageData(saveSVG).then(
  //   (data: string) => {
  //     const img = new Image();
  //     img.src = data;
  //     document.body.append(img);
  //   }
  // )
}