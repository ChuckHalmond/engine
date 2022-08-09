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
import { WebGLPacketUtilities, PacketProperties, PacketValues } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BlendingEquation, BlendingMode, BufferMask, Capabilities, TestFunction, WebGLRendererUtilities, WindingOrder } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { TexturePixelFormat, TexturePixelType, TextureMagFilter, TextureMinFilter, TextureTarget, TextureWrapMode, WebGLTextureUtilities, TextureInternalPixelFormat } from "../../engine/core/rendering/webgl/WebGLTextureUtilities";
import { WebGLUniformBlockUtilities } from "../../engine/core/rendering/webgl/WebGLUniformBlockUtilities";
import { AttributeDataType, DataComponentType, DrawMode, WebGLVertexArrayUtilities } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
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
/*
let file: File | undefined;
const input = document.createElement("input");
input.type = "file";
document.body.append(input);
input.addEventListener("input", () => {
  file = input.files![0];
  launchScene();
});
*/
export async function launchScene() {
  let render: (time: number) => void;
  let fps: number = 0;
  let paused = false;

  const playPause = document.getElementById('playpause') as HTMLButtonElement;
  if (playPause !== null) {
    playPause.onclick = () => {
      paused = !paused;
      playPause.textContent = paused ? "Play" : "Pause";
      if (!paused) {
        requestAnimationFrame(render);
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
  
  const CANVAS_WIDTH = 1400;
  const CANVAS_HEIGHT = 800;
  const supersamplingRatio = 1;
  canvas.width = CANVAS_WIDTH * supersamplingRatio;
  canvas.height = CANVAS_HEIGHT * supersamplingRatio;
  canvas.style.width = `${CANVAS_WIDTH}px`;
  canvas.style.height = `${CANVAS_HEIGHT}px`;
  
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  WebGLTextureUtilities.setUnpackAlignment(gl, 1);

  // Shaders
  const phongVert = await fetch("assets/engine/shaders/common/phong.vert.glsl").then(resp => resp.text());
  const phongFrag = await fetch("assets/engine/shaders/common/phong.frag.glsl").then(resp => resp.text());
  const phongProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: phongVert, fragmentSource: phongFrag});
  if (phongProgram === null) return;

  const skyboxVert = await fetch("assets/engine/shaders/common/skybox.vert").then(resp => resp.text());
  const skyboxFrag = await fetch("assets/engine/shaders/common/skybox.frag").then(resp => resp.text());
  const skyboxProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: skyboxVert, fragmentSource: skyboxFrag});
  if (skyboxProgram === null) return;
  
  const textureVert = await fetch("assets/engine/shaders/common/texture.vert").then(resp => resp.text());
  const textureFrag = await fetch("assets/engine/shaders/common/texture.frag").then(resp => resp.text());
  const texProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: textureVert, fragmentSource: textureFrag});
  if (texProgram === null) return;

  const basicVert = await fetch("assets/engine/shaders/common/basic.vert.glsl").then(resp => resp.text());
  const basicFrag = await fetch("assets/engine/shaders/common/basic.frag.glsl").then(resp => resp.text());
  const basicProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: basicVert, fragmentSource: basicFrag});
  if (basicProgram === null) return;
  
  const depthVert = await fetch("assets/engine/shaders/common/depth.vert.glsl").then(resp => resp.text());
  const depthFrag = await fetch("assets/engine/shaders/common/depth.frag.glsl").then(resp => resp.text());
  const depthProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: depthVert, fragmentSource: depthFrag});
  if (depthProgram === null) return;

  const linesVertex = await fetch("assets/engine/shaders/common/lines.vert.glsl").then(resp => resp.text());
  const linesFragment = await fetch("assets/engine/shaders/common/lines.frag.glsl").then(resp => resp.text());
  const linesProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: linesVertex, fragmentSource: linesFragment});
  if (linesProgram === null) return;

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
  const brickwallImg = await fetchImage("assets/engine/img/brickwall.jpg");
  const normalMapImg = await fetchImage("assets/engine/img/NormalMap_0.png");
  const normalMap2Img = await fetchImage("assets/engine/img/Normal_Map_1024.png");
  const displacementMapImg = await fetchImage("assets/engine/img/DisplacementMap.png");
  const skyboxXPosImg = await fetchImage("assets/engine/img/skybox_x_pos.png");
  const skyboxXNegImg = await fetchImage("assets/engine/img/skybox_x_neg.png");
  const skyboxYPosImg = await fetchImage("assets/engine/img/skybox_y_pos.png");
  const skyboxYNegImg = await fetchImage("assets/engine/img/skybox_y_neg.png");
  const skyboxZPosImg = await fetchImage("assets/engine/img/skybox_z_pos.png");
  const skyboxZNegImg = await fetchImage("assets/engine/img/skybox_z_neg.png");
  const colorsImg = await fetchImage("assets/engine/img/colors.png");

  const PADDING = 1;

  const paddedImage = function(image: HTMLImageElement) {
    const canvas = document.createElement("canvas");
    const {width, height} = image;
    const paddedWidth = width + PADDING * 2;
    const paddedHeight = height + PADDING * 2;
    canvas.width = paddedWidth;
    canvas.height = paddedHeight;
    const ctx = canvas.getContext("2d")!;
    // Draws upper and lower extensions
    /*ctx.drawImage(image, 0, 0, width, 1, 0, 0, paddedWidth, 1);
    ctx.drawImage(image, 0, height - 1, width, 1, 0, height + 1, paddedWidth, 1);
    // Draws left and right extensions
    ctx.drawImage(image, 0, 0, 1, height, 0, 0, 1, paddedHeight);
    ctx.drawImage(image, width - 1, 0, 1, height, width + 1, 0, 1, paddedHeight);*/
    
    // Draws original image
    ctx.drawImage(image, 0, 0, paddedWidth, paddedHeight);
    ctx.drawImage(image, PADDING, PADDING, width, height);
    const data = ctx.getImageData(0, 0, paddedWidth, paddedHeight);
    /*document.body.append(image);
    const img = new Image();
    img.src = canvas.toDataURL();
    document.body.append(img);*/
    return {
      width,
      height,
      paddedWidth,
      paddedHeight, 
      data
    };
  }

  const paddedBrickwallImg = paddedImage(brickwallImg);
  const paddedAlbedoMapImg = paddedImage(albedoMapImg);
  const paddedNormalMap2 = paddedImage(normalMap2Img);
  const paddedColorsImg = paddedImage(colorsImg);
  /*const norm16Extension = gl.getExtension("EXT_texture_norm16");
  if (norm16Extension) {
    console.log(`Extension EXT_texture_norm16 activated.`);
  }*/

  const textures = WebGLPacketUtilities.createTextures(gl, {
    // albedoMap: {
    //   pixels: albedoMapImg,
    //   width: albedoMapImg.width, height: albedoMapImg.height,
    //   target: TextureTarget.TEXTURE_2D,
    //   type: TexturePixelType.UNSIGNED_BYTE,
    //   format: TexturePixelFormat.RGB,
    //   internalFormat: TextureInternalPixelFormat.RGB,

    //   min: TextureMinFilter.NEAREST,
    //   mag: TextureMagFilter.NEAREST,
    // },
    albedoMap: {
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
    },
    albedoMaps: {
      pixels: null,
      width: paddedBrickwallImg.paddedWidth, height: paddedBrickwallImg.paddedHeight, depth: 4,
      target: TextureTarget.TEXTURE_2D_ARRAY,
      type: TexturePixelType.UNSIGNED_BYTE,
      format: TexturePixelFormat.RGB,
      internalFormat: TextureInternalPixelFormat.RGB,
      subimages: [
        {
          pixels: paddedBrickwallImg.data,
          xoffset: 0,
          yoffset: 0,
          zoffset: 0,
          width: paddedBrickwallImg.paddedWidth,
          height: paddedBrickwallImg.paddedHeight,
          depth: 1
        },
        {
          pixels: paddedAlbedoMapImg.data,
          xoffset: 0,
          yoffset: 0,
          zoffset: 1,
          width: paddedAlbedoMapImg.paddedWidth,
          height: paddedAlbedoMapImg.paddedHeight,
          depth: 1
        },
        {
          pixels: paddedNormalMap2.data,
          xoffset: 0,
          yoffset: 0,
          zoffset: 2,
          width: paddedNormalMap2.paddedWidth,
          height: paddedNormalMap2.paddedHeight,
          depth: 1
        },
        {
          pixels: paddedColorsImg.data,
          xoffset: 0,
          yoffset: 0,
          zoffset: 3,
          width: paddedColorsImg.paddedWidth,
          height: paddedColorsImg.paddedHeight,
          depth: 1
        },
      ],
      // wrapS: TextureWrapMode.CLAMP_TO_EDGE,
      // wrapT: TextureWrapMode.CLAMP_TO_EDGE,
      // wrapR: TextureWrapMode.CLAMP_TO_EDGE,
      min: TextureMinFilter.LINEAR,
      mag: TextureMagFilter.LINEAR,
      // mipmap: false
    },
    normalMap: {
      pixels: normalMapImg,
      width: normalMapImg.width, height: normalMapImg.height,
      target: TextureTarget.TEXTURE_2D,
      type: TexturePixelType.UNSIGNED_BYTE,
      format: TexturePixelFormat.RGB,
      internalFormat: TextureInternalPixelFormat.RGB,
      min: TextureMinFilter.LINEAR_MIPMAP_LINEAR,
      mag: TextureMagFilter.LINEAR
    },
    displacementMap: {
      pixels: displacementMapImg,
      width: displacementMapImg.width, height: displacementMapImg.height,
      target: TextureTarget.TEXTURE_2D,
      type: TexturePixelType.UNSIGNED_BYTE,
      format: TexturePixelFormat.RGBA,
      internalFormat: TextureInternalPixelFormat.RGBA
    },
    skybox: {
      pixels: {
        xPos: skyboxXPosImg, xNeg: skyboxXNegImg,
        yPos: skyboxYPosImg, yNeg: skyboxYNegImg,
        zPos: skyboxZPosImg, zNeg: skyboxZNegImg
      },
      width: skyboxXPosImg.width, height: skyboxXPosImg.height,
      target: TextureTarget.TEXTURE_CUBE_MAP,
      type: TexturePixelType.UNSIGNED_BYTE,
      format: TexturePixelFormat.RGBA,
      internalFormat: TextureInternalPixelFormat.RGBA
    },
    fbColorTex: {
      width: canvas.width, height: canvas.height,
      pixels: null,
      target: TextureTarget.TEXTURE_2D,
      type: TexturePixelType.UNSIGNED_BYTE,
      format: TexturePixelFormat.RGBA,
      internalFormat: TextureInternalPixelFormat.RGBA,
      mag: TextureMagFilter.LINEAR,
      min: TextureMinFilter.LINEAR,
      wrapS: TextureWrapMode.CLAMP_TO_EDGE,
      wrapT: TextureWrapMode.CLAMP_TO_EDGE,
      wrapR: TextureWrapMode.CLAMP_TO_EDGE,
    },
    depthTex: {
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
  })!;

  const {albedoMap, albedoMaps, normalMap, displacementMap, skybox, fbColorTex, depthTex} = textures;

  const anisotropicTargetTextures = [albedoMaps];
  const anisotropicExtension = gl.getExtension("EXT_texture_filter_anisotropic");
  if (anisotropicExtension) {
    console.log(`Extension EXT_texture_filter_anisotropic activated.`);
    const maxFiltering = gl.getParameter(anisotropicExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    anisotropicTargetTextures.forEach((texture) => {
      const {properties, internalTexture} = texture;
      const {target} = properties!;
      gl.bindTexture(target, internalTexture);
      gl.texParameterf(target, anisotropicExtension.TEXTURE_MAX_ANISOTROPY_EXT, maxFiltering);
    });
  }

  const cubeGeometry =
    // new QuadGeometry({heightSegments: 64, widthSegments: 64});
    new CubeGeometry({height: 4, width: 4, depth: 4, heightSegments: 32, widthSegments: 32, depthSegments: 32});
    // new SphereGeometry({widthSegments: 64, heightSegments: 64});
    // new CylinderGeometry();
    // new DodecahedronGeometry();
  
  const quad = new QuadGeometry({height: 2, width: 2});
  const quadGeometryBuilder = quad.toBuilder();
  const cube = new Transform();
  cube.setScaling(new Vector3([1, 1, 1]));
  
  const fov = (1 / 3) * Math.PI;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100;

  const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
  camera.transform.setTranslation(new Vector3([0, 8, 8]));
  camera.transform.lookAt(new Vector3([0, 0, 0]), Space.up);

  const lightTransform = new Transform();
  lightTransform.setTranslation(new Vector3([0, 2, 2]));
  lightTransform.setScaling(new Vector3([0.2, 0.2, 0.2]));

  camera.transform.setTranslation(lightTransform.getTranslation(new Vector3()).scale(2));
  camera.transform.lookAt(new Vector3([0, 0, 0]), Space.up);

  const viewDirectionProjectionInverse = camera.projection.clone().mult(Matrix4.identity().setRotation(camera.view.getRotation())).invert();
/*
  addWidgets([
    ...createRotationWidgets(cube, "Cube"),
    ...createPositionWidgets(cube, "Cube"),
    ...createRelativePositionWidgets(cube, "Cube"),
    ...createRelativePositionWidgets(camera.transform, "Camera"),
  ]);*/

  const cubeGeometryBuilder = cubeGeometry.toBuilder();
  const cubeVerticesArray = cubeGeometryBuilder.verticesArray();
  const cubeIndicesArray = cubeGeometryBuilder.trianglesIndicesArray();
  const cubeNormalsArray = cubeGeometryBuilder.normalsArray();
  const cubeUVsArray= cubeGeometryBuilder.uvsArray();
  const cubeTangentsArray = cubeGeometryBuilder.tangentsArray();
  const cubeLinesArray = cubeGeometryBuilder.verticesArray();

  const cubeGeometryBuffer = new GeometryBuffer({
    a_position: { array: cubeVerticesArray, type: AttributeDataType.VEC3 },
    a_tangent: { array: cubeTangentsArray, type: AttributeDataType.VEC3 },
    a_normal: { array: cubeNormalsArray, type: AttributeDataType.VEC3 },
    a_uv: { array: cubeUVsArray, type: AttributeDataType.VEC2 },
  }, cubeIndicesArray, false);

  const cubeVertices = cubeGeometryBuffer.getAttribute("a_position")!;
  const cubeIndices = cubeGeometryBuffer.indices!;
  const cubeNormals = cubeGeometryBuffer.getAttribute("a_normal")!;
  const cubeUVs = cubeGeometryBuffer.getAttribute("a_uv")!;
  const cubeTangents = cubeGeometryBuffer.getAttribute("a_tangent")!;
  const cubeColors = cubeGeometryBuffer.getAttribute("a_normal")!;
  
  //const cubeLines = cubeGeometryBuffer.getAttribute("a_lines")!;

  // const blob = cubeGeometryBuffer.toBlob();
  // const anchor = document.createElement("a");
  // anchor.download = "dat.bin";
  // anchor.href = URL.createObjectURL(blob);
  // anchor.click();

  // console.log(cubeGeometryBuffer);

  // const cubeGeometryBuffer = await GeometryBuffer.fromBlob(file!);

  // const cubeVertices = cubeGeometryBuffer.getAttribute("a_position")!;
  // const cubeIndices = cubeGeometryBuffer.indices!;
  // const cubeNormals = cubeGeometryBuffer.getAttribute("a_normal")!;
  // const cubeUVs = cubeGeometryBuffer.getAttribute("a_uv")!;
  // const cubeTangents = cubeGeometryBuffer.getAttribute("a_tangent")!;

  const phongCubePacketProperties: PacketProperties = {
    program: phongProgram,
    vertexArray: {
      vertexBuffers: [
        {
          interleaved: false
        },
        {
          usage: BufferDataUsage.DYNAMIC_READ
        },
      ],
      vertexAttributes: {
        a_position: { buffer: 0, type: AttributeDataType.VEC3, componentType: DataComponentType.FLOAT, byteLength: cubeNormals.array.byteLength },
        a_tangent: { buffer: 0, type: AttributeDataType.VEC3, componentType: DataComponentType.FLOAT, byteLength: cubeTangents.array.byteLength },
        a_normal: { ...cubeNormals, buffer: 0 },
        a_uv: { ...cubeUVs, buffer: 0 },
        a_color: { buffer: 1, type: AttributeDataType.VEC3, componentType: DataComponentType.FLOAT, byteLength: cubeColors.array.byteLength },
      },
      elementIndices: cubeGeometryBuffer.indices
    },
    uniformBuffers: [
      {
        usage: BufferDataUsage.DYNAMIC_READ
      },
      {
        usage: BufferDataUsage.DYNAMIC_READ
      }
    ],
    uniformBlocks: {
      subTexture: {
        uniforms: {
          u_xOffset: { value: PADDING / paddedBrickwallImg.paddedWidth },
          u_yOffset: { value: PADDING / paddedBrickwallImg.paddedHeight },
          u_zOffset: { value: 1 },
          u_xScaling: { value: paddedAlbedoMapImg.width / paddedBrickwallImg.paddedWidth },
          u_yScaling: { value: paddedAlbedoMapImg.height / paddedBrickwallImg.paddedHeight }
        }
      },
      viewBlock: {
        buffer: 0,
        /*uniforms: {
          u_view: { value: camera.view.array },
          u_projection: { value: camera.projection.array },
        }*/
      },
      modelBlock: {
        buffer: 0,
        /*uniforms: {
          "models[0].u_model": { value: cube.matrix.array },
          "models[0].u_modelView": { value: camera.view.mult(cube.matrix).array },
          "models[0].u_normal": { value: camera.view.mult(cube.matrix).invert().transpose().array }
        }*/
      },
      lightsBlock: {
        buffer: 0,
        /*uniforms: {
          "lights[0].u_lightWorldPos": { value: Array.from(lightTransform.getTranslation(new Vector3())) },
          "lights[0].u_lightDirection": { value: Array.from(lightTransform.getBackward(new Vector3())) },
          "lights[0].u_cutOff": { value: (2 / 360) * Math.PI },
          "lights[0].u_lightColor": { value: Array.from(Color.RED) }
        }*/
      },
      phongBlock: {
        buffer: 1,
        /*uniforms: {
          "phong.u_ambientColor": { value: [0.1, 0.1, 0.1] },
          "phong.u_diffuseColor": { value: [0.8, 0, 0] },
          "phong.u_specularColor": { value: [1, 1, 1] },
          "phong.u_ambientFactor": { value: 0.0008 },
          "phong.u_diffuseFactor": { value: 1 },
          "phong.u_specularFactor": { value: 1 },
          "phong.u_shininess": { value: 36 },
          "phong.u_constant": { value: 1 }, 
          "phong.u_linear": { value: 0.09 },
          "phong.u_quadratic": { value: 0.032 }
        }*/
      }
    },
    uniforms: {
      u_albedoMap: { value: albedoMap },
      u_normalMap: { value: normalMap },
      u_displacementMap: { value: displacementMap },
      u_albedoMaps: { value: albedoMaps }
    },
    drawCommand: {
      mode: DrawMode.TRIANGLES,
      elementsCount: cubeGeometryBuffer.indices!.length,
    }
  };

  const phongPacketInitValues = <PacketValues>{
    program: phongProgram,
    uniformBlocks: {
      viewBlock: {
        uniforms: {
          u_view: { value: camera.view.array },
          u_projection: { value: camera.projection.array },
        }
      },
      modelBlock: {
        uniforms: {
          "models[0].u_model": { value: cube.matrix.array },
          "models[0].u_modelView": { value: camera.view.mult(cube.matrix).array },
          "models[0].u_normal": { value: camera.view.mult(cube.matrix).invert().transpose().array }
        }
      },
      lightsBlock: {
        uniforms: {
          "lights[0].u_lightWorldPos": { value: Array.from(lightTransform.getTranslation(new Vector3())) },
          "lights[0].u_lightDirection": { value: Array.from(lightTransform.getBackward(new Vector3())) },
          "lights[0].u_cutOff": { value: (2 / 360) * Math.PI },
          "lights[0].u_lightColor": { value: /*[1, 0.8, 0.8]*/Array.from(Color.RED) }
        }
      },
      phongBlock: {
        uniforms: {
          "phong.u_ambientColor": { value: [0.1, 0.1, 0.1] },
          "phong.u_diffuseColor": { value: [0.8, 0, 0] },
          "phong.u_specularColor": { value: [1, 1, 1] },
          "phong.u_ambientFactor": { value: 0.0008 },
          "phong.u_diffuseFactor": { value: 1 },
          "phong.u_specularFactor": { value: 1 },
          "phong.u_shininess": { value: 36 },
          "phong.u_constant": { value: 1 }, 
          "phong.u_linear": { value: 0.09 },
          "phong.u_quadratic": { value: 0.032 }
        }
      }
    }
  }

  let phongCubePacket = WebGLPacketUtilities.createPacket(gl, phongCubePacketProperties)!;
  
  WebGLVertexArrayUtilities.setVertexArrayBufferData(gl, phongCubePacket.vertexArray.verticesBuffers[1]!, cubeColors.array);
  WebGLVertexArrayUtilities.setVertexArrayBufferData(gl, phongCubePacket.vertexArray.verticesBuffers[0]!, new Uint8Array(cubeGeometryBuffer.buffer));
  WebGLVertexArrayUtilities.setVertexArrayValues(gl, phongCubePacket.vertexArray, {
    attributes: {
      a_position: {
        array: cubeVertices.array
      }
    }
  });

  WebGLUniformBlockUtilities.setUniformBufferData(gl,
    phongCubePacket.uniformBlocks!.phongBlock!.buffer!,
    Color.lerp(Color.WHITE, Color.GREEN, 0.5).array,
    phongCubePacket.uniformBlocks!.phongBlock!.layout["phong.u_ambientColor"]!.byteOffset!,
  );

  const linesProperties: PacketProperties = {
    program: linesProgram,
    vertexArray: {
      vertexAttributes: {
        a_position: {
          array: cubeLinesArray,
          type: AttributeDataType.VEC3
        }
      }
    },
    uniformBuffers: [
      phongCubePacket.uniformBlocks!.modelBlock.buffer!,
      phongCubePacket.uniformBlocks!.viewBlock.buffer!
    ],
    uniformBlocks: {
      modelBlock: { buffer: 0 },
      viewBlock: { buffer: 1 }
    },
    uniforms: {
      u_color: {
        value: new Float32Array([1, 0, 0])
      }
    },
    drawCommand: {
      mode: DrawMode.LINES,
      elementsCount: cubeLinesArray.length / 2
    }
  };

  const basicPacketProperties: PacketProperties = {
    program: basicProgram,
    vertexArray: {
      vertexBuffers: [
        phongCubePacket.vertexArray.verticesBuffers[0]
      ],
      elementBuffer: phongCubePacket.vertexArray.elementBuffer
    },
    uniformBuffers: [
      phongCubePacket.uniformBlocks!.viewBlock.buffer!
    ],
    uniformBlocks: {
      basicModelBlock: {
        uniforms: {
          u_model: { value: lightTransform.matrix.array },
          u_color: { value: [1, 1, 0] }
        }
      },
      viewBlock: {
        buffer: 0
      }
    },
    drawCommand: {
      mode: DrawMode.TRIANGLES,
      elementsCount: phongCubePacket.drawCommand.elementsCount
    }
  };

  const quadIndices = quadGeometryBuilder.trianglesIndicesArray();
  const quadVertices = quadGeometryBuilder.verticesArray();
  const quadUVs = quadGeometryBuilder.uvsArray();
  const quadWorld = new Matrix4().setIdentity();

  const skyboxPacketProperties: PacketProperties = {
    program: skyboxProgram,
    vertexArray: {
      vertexAttributes: {
        a_position: { array: quadVertices, type: AttributeDataType.VEC3 },
      },
      elementIndices: quadIndices
    },
    uniforms: {
      u_world: { value: quadWorld.array },
      u_viewDirectionProjectionInverse: { value: viewDirectionProjectionInverse.array }, 
      u_skybox: { value: skybox },
    },
    drawCommand: {
      mode: DrawMode.TRIANGLES,
      elementsCount: quadIndices.length
    }
  };

  const depthPacketProperties: PacketProperties = {
    program: depthProgram,
    vertexArray: {
      vertexAttributes: {
        a_position: { array: quadVertices, type: AttributeDataType.VEC3 },
        a_uv: { array: quadUVs, type: AttributeDataType.VEC2 },
      },
      elementIndices: quadIndices
    },
    uniforms: {
      u_depthWorld: { value: quadWorld.array },
      u_depthTex: { value: depthTex }
    },
    drawCommand: {
      mode: DrawMode.TRIANGLES,
      elementsCount: quadIndices.length
    }
  };

  const texPacketProperties: PacketProperties = {
    program: texProgram,
    vertexArray: {
      vertexAttributes: {
        a_position: { array: quadVertices, type: AttributeDataType.VEC3 },
        a_uv: { array: quadUVs, type: AttributeDataType.VEC2 },
      },
      elementIndices: quadIndices
    },
    uniforms: {
      u_world: { value: quadWorld.array },
      u_tex: { value: fbColorTex }
    },
    drawCommand: {
      mode: DrawMode.TRIANGLES,
      elementsCount: quadIndices.length
    }
  };

  const linesPacket = WebGLPacketUtilities.createPacket(gl, linesProperties)!;
  const basicPacket = WebGLPacketUtilities.createPacket(gl, basicPacketProperties)!;
  const skyboxPacket = WebGLPacketUtilities.createPacket(gl, skyboxPacketProperties)!;
  const depthPacket = WebGLPacketUtilities.createPacket(gl, depthPacketProperties)!;
  const texPacket = WebGLPacketUtilities.createPacket(gl, texPacketProperties)!;

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

  // WebGLRendererUtilities.frontFace(gl, WindingOrder.CW);
  WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
  WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);
  WebGLRendererUtilities.enable(gl, Capabilities.BLEND);
  WebGLRendererUtilities.blendFunction(gl, BlendingMode.SRC_ALPHA, BlendingMode.ONE_MINUS_SRC_ALPHA);
  
  let lastFrameTime = 0;
  let deltaTime = 0;

  let t = 0;
  let direction = 1;
  
  let initRotation = cube.getRotation(new Quaternion());
  let initPosition = cube.getTranslation(new Vector3());

  const targetPosition = new Vector3([2, -2, -2]);
  const targetRotation = Quaternion.fromAxisAngle(Space.down, Math.PI / 3);

  Input.initialize(canvas);
  
  WebGLFramebufferUtilities.unbindFramebuffer(gl);

  const cameraControl = new FreeCameraControl(camera);

  // WebGLProgramUtilities.recompileProgram(gl, phongProgram, {fragmentSource: phong2Frag});
  // phongCubePacket = WebGLPacketUtilities.createPacket(gl, phongCubePacketProperties)!;
  
  WebGLPacketUtilities.setPacketValues(gl, phongCubePacket, phongPacketInitValues);
  WebGLRendererUtilities.clearColor(gl, Color.BLACK.normalize());
  
  render = function(frameTime: number) {
    if (paused) {
      return;
    }
    
    frameTime *= 0.001;
    deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;
    fps = 1 / deltaTime;

    fpsElement.textContent = fps.toFixed(1);

    cameraControl.update(deltaTime);
    lightTransform.setMatrix(camera.transform.matrix);

    cube.rotate(Quaternion.fromAxisAngle(Space.down, Math.PI / 128));
    
    t += deltaTime * direction * 0.5;
    if (t > 1 || t < 0) {
      direction *= -1;
    }
    
    
    WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);
    
    viewDirectionProjectionInverse.copy(camera.projection).mult(new Matrix4().setIdentity().setRotation(camera.view.getRotation())).invert();

    // Framebuffer

    WebGLRendererUtilities.viewport(gl, 0, 0, canvas.width, canvas.height);

    WebGLFramebufferUtilities.bindFramebuffer(gl, framebuffer);

    WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);
    
    WebGLRendererUtilities.depthFunction(gl, TestFunction.LEQUAL);

    WebGLPacketUtilities.drawPacket(gl, skyboxPacket);

    WebGLRendererUtilities.depthFunction(gl, TestFunction.LESS);

    WebGLPacketUtilities.setPacketValues(gl, phongCubePacket, {
      uniformBlocks: {
        modelBlock: {
          uniforms: {
            "models[0].u_model": { value: cube.matrix.array },
            "models[0].u_modelView": { value: camera.view.mult(cube.matrix).array },
            "models[0].u_normal": { value: camera.view.mult(cube.matrix).invert().transpose().array },
          }
        },
        viewBlock: {
          uniforms: {
            u_view: { value: camera.view.array },
            u_projection: { value: camera.projection.array },
          }
        },
        lightsBlock: {
          uniforms: {
            "lights[0].u_lightWorldPos": { value: Array.from(lightTransform.getTranslation(new Vector3())) },
            "lights[0].u_lightDirection": { value: Array.from(lightTransform.getBackward(new Vector3())) },
          }
        }
      }
    });

    // WebGLPacketUtilities.drawPacket(gl, basicPacket);
    // WebGLPacketUtilities.drawPacket(gl, linesPacket);
    WebGLPacketUtilities.drawPacket(gl, phongCubePacket);
    
    WebGLPacketUtilities.setPacketValues(gl, skyboxPacket, {
      uniforms: {
        u_viewDirectionProjectionInverse: { value: viewDirectionProjectionInverse.array }
      }
    });
    
    // WebGLRendererUtilities.depthFunction(gl, TestFunction.LEQUAL);
    // WebGLPacketUtilities.drawPacket(gl, skyboxPacket);
    
    // Framebuffer
    WebGLFramebufferUtilities.blit(gl, framebuffer, postFramebuffer,
      [0, 0, canvas.width, canvas.height],
      [0, 0, canvas.width, canvas.height],
      BufferMask.COLOR_BUFFER_BIT,
      TextureMagFilter.LINEAR
    );
    
    WebGLFramebufferUtilities.blit(gl, framebuffer, postFramebuffer,
      [0, 0, canvas.width, canvas.height],
      [0, 0, canvas.width, canvas.height],
      BufferMask.DEPTH_BUFFER_BIT,
      TextureMagFilter.NEAREST
    );

    WebGLFramebufferUtilities.unbindFramebuffer(gl);
    
    WebGLPacketUtilities.drawPacket(gl, texPacket);

    const newWidth = canvas.width / 4;
    const newHeight = canvas.height / 4;
    WebGLRendererUtilities.viewport(gl, 0, canvas.height - newHeight, newWidth, newHeight);

    WebGLRendererUtilities.depthFunction(gl, TestFunction.ALWAYS);

    WebGLPacketUtilities.drawPacket(gl, depthPacket);

    Input.clear();

    requestAnimationFrame(render);
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
  rec.start();

  setTimeout(() => {
    rec.stop();
  }, 5_000);*/
  
  requestAnimationFrame(render);
  
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