// import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
// import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
// import { Transform } from "../../engine/core/general/Transform";
// import { Input } from "../../engine/core/input/Input";
// import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
// import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
// import { WebGLFramebufferUtilities } from "../../engine/core/rendering/webgl/WebGLFramebufferUtilities";
// import { WebGLPacketUtilities, PacketProperties } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
// import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
// import { BufferMask, Capabilities, TestFunction, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
// import { TexturePixelFormat, TexturePixelType, TextureMagFilter, TextureMinFilter, TextureTarget, TextureWrapMode, TextureInternalPixelFormat } from "../../engine/core/rendering/webgl/WebGLTextureUtilities";
// import { AttributeDataType, DrawMode } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
// import { Color } from "../../engine/libs/graphics/colors/Color";
// import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
// import { Space } from "../../engine/libs/maths/geometry/space/Space";
// import { addWidgets, createPositionWidgets, createRotationWidgets } from "./Common";

// const simpleSceneDOM = /*template*/`
// <!--<link rel="stylesheet" href="./css/main.css"/>-->
//   <div class="flex-auto flex-cols">
//     <main class="flex-rows flex-auto">
//         <section class="centered padded">
//           <div id="ui" class="flex-cols">
//             <div class="flex-auto"><span class="blue">"RigidBuddy FTW!"</span> <span class="yellow">:-)</span></div>
//             <div class="flex-none">FPS: <span id="canvas-fps">-.-</span></div>
//           </div>
//           <button id="playpause">Pause</button>
//           <div id="widgets"></div>
//           <canvas id="canvas" tabindex="0" tooltip="mon-canvas" oncontextmenu="return false;"></canvas>
//         </section>
//     </main>
//   </div>`;

// export async function startMaps() {
//   const template = document.createElement("template");
//   template.innerHTML = simpleSceneDOM;
//   document.body.insertBefore(template.content, document.body.firstChild);
//   launchScene();
// }

// export async function launchScene() {
//   let frameRequest: number;
//   let render: (time: number) => void;
//   let fps: number = 0;
//   let paused = false;

//   const playPause = document.getElementById('playpause') as HTMLButtonElement;
//   if (playPause !== null) {
//     playPause.onclick = () => {
//       paused = !paused;
//       playPause.textContent = paused ? "Play" : "Pause";
//       if (!paused) {
//         render(0);
//       }
//     };
//   }

//   const fpsElement = document.getElementById('canvas-fps') as HTMLSpanElement;
//   if (!fpsElement) {
//     return;
//   }

//   const canvas = document.getElementById("canvas") as HTMLCanvasElement;
//   if (!canvas) {
//     return;
//   }
  
//   const canvasWidth = 1200;
//   const canvasHeight = 800;
//   const supersamplingRatio = 1;
//   canvas.width = canvasWidth * supersamplingRatio;
//   canvas.height = canvasHeight * supersamplingRatio;
//   canvas.style.width = `${canvasWidth}px`;
//   canvas.style.height = `${canvasHeight}px`;
  
//   const gl = canvas.getContext("webgl2"/*, {antialias: true}*//*, {preserveDrawingBuffer: true}*/);
//   if (!gl) {
//     return;
//   }

//   // Shaders
//   const phongVert = await fetch("assets/engine/shaders/common/phong.vert.glsl").then(resp => resp.text());
//   const phongFrag = await fetch("assets/engine/shaders/common/phong.frag.glsl").then(resp => resp.text());
//   const phongGlProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: phongVert, fragmentSource: phongFrag})!;
//   const linesVertex = await fetch("assets/engine/shaders/common/lines.vert.glsl").then(resp => resp.text());
//   const linesFragment = await fetch("assets/engine/shaders/common/lines.frag.glsl").then(resp => resp.text());
//   const linesProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: linesVertex, fragmentSource: linesFragment})!;
  
//   async function fetchImage(url: string) {
//     return fetch(url).then((resp) => {
//       if (resp.ok) {
//         return new Promise<HTMLImageElement>((resolve) => {
//           const img = new Image();
//           img.onload = () => {
//             resolve(img);
//           };
//           img.src = url;
//         })
//       }
//       else {
//         throw new Error(`Image '${url}' not found.`);
//       }
//     });
//   }
//   // Images
//   const albedoMapImg = await fetchImage("assets/engine/img/brickwall.jpg");
//   const normalMapImg = await fetchImage("assets/engine/img/NormalMap_0.png");
//   const heightMapImg = await fetchImage("assets/engine/img/HeightMap_0.png");
//   const skyboxXPosImg = await fetchImage("assets/engine/img/skybox_x_pos.png");
//   const skyboxXNegImg = await fetchImage("assets/engine/img/skybox_x_neg.png");
//   const skyboxYPosImg = await fetchImage("assets/engine/img/skybox_y_pos.png");
//   const skyboxYNegImg = await fetchImage("assets/engine/img/skybox_y_neg.png");
//   const skyboxZPosImg = await fetchImage("assets/engine/img/skybox_z_pos.png");
//   const skyboxZNegImg = await fetchImage("assets/engine/img/skybox_z_neg.png");

//   const phongBlocks = WebGLPacketUtilities.createUniformBlocks(gl, phongGlProgram, ["worldViewBlock", "lightsBlock", "phongBlock"])!;
//   const {worldViewBlock: phongWorldViewBlock, lightsBlock: phongLightsBlock, phongBlock} = phongBlocks;
//   const linesBlocks = WebGLPacketUtilities.createUniformBlocks(gl, linesProgram, ["viewBlock", "linesBlock"])!;
//   const {viewBlock: linesViewBlock, linesBlock} = linesBlocks;

//   const textures = WebGLPacketUtilities.createTextures(gl, {
//     albedoMap: {
//         pixels: albedoMapImg,
//         width: albedoMapImg.width, height: albedoMapImg.height,
//         target: TextureTarget.TEXTURE_2D,
//         type: TexturePixelType.UNSIGNED_BYTE,
//         format: TexturePixelFormat.RGB,
//         internalFormat: TextureInternalPixelFormat.RGB8
//     },
//     normalMap: {
//       pixels: normalMapImg,
//       width: normalMapImg.width, height: normalMapImg.height,
//       target: TextureTarget.TEXTURE_2D,
//       type: TexturePixelType.UNSIGNED_BYTE,
//       format: TexturePixelFormat.RGB,
//       internalFormat: TextureInternalPixelFormat.RGB8,
//       min: TextureMinFilter.LINEAR_MIPMAP_LINEAR,
//       mag: TextureMagFilter.LINEAR
//     },
//     heightMap: {
//       pixels: heightMapImg,
//       width: heightMapImg.width, height: heightMapImg.height,
//       target: TextureTarget.TEXTURE_2D,
//       type: TexturePixelType.UNSIGNED_BYTE,
//       format: TexturePixelFormat.RGB,
//       internalFormat: TextureInternalPixelFormat.RGB8,
//       min: TextureMinFilter.LINEAR_MIPMAP_LINEAR,
//       mag: TextureMagFilter.LINEAR
//     }
//   });

//   const albedoMap = textures.albedoMap;
//   const normalMap = textures.normalMap;
//   const heightMap = textures.heightMap;

//   const anisotropicExtension = gl.getExtension("EXT_texture_filter_anisotropic");
//   if (anisotropicExtension) {
//     console.log(`Extension EXT_texture_filter_anisotropic activated.`);
//     const maxFiltering = gl.getParameter(anisotropicExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
//     const textures = [albedoMap, normalMap];
//     textures.forEach((texture) => {
//       gl.activeTexture(gl.TEXTURE0 + texture.unit);
//       gl.bindTexture(gl.TEXTURE_2D, texture.internalTexture);
//       gl.texParameterf(gl.TEXTURE_2D, anisotropicExtension.TEXTURE_MAX_ANISOTROPY_EXT, maxFiltering);
//     });
//   }

//   const quadTransform = new Transform();

//   const fov = (1 / 3) * Math.PI;
//   const aspect = gl.canvas.width / gl.canvas.height;
//   const zNear = 0.02;
//   const zFar = 200;

//   const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);

//   const lightTransform = new Transform();
//   lightTransform.setTranslation(new Vector3([0, 2, 2]));
//   lightTransform.setScaling(new Vector3([0.2, 0.2, 0.2]));

//   camera.transform.setTranslation(Space.forward.clone().scale(2));
//   camera.transform.lookAt(new Vector3([0, 0, 0]), Space.up);

//   addWidgets([
//     ...createRotationWidgets(quadTransform, "Quad"),
//     ...createPositionWidgets(quadTransform, "Quad"),
//   ]);

//   function getDelta(timers: [string, Date][]): Date {
//     return new Date(
//       new Date().getTime() - timers[timers.length - 1][1].getTime()
//     );
//   }

//   const timers: [string, Date][] = [
//     ["t0", new Date()]
//   ];
//   const quadGeometry = new QuadGeometry({widthSegments: 32, heightSegments: 32});
//   timers.push(["constructor()", getDelta(timers)]);
//   const quadGeometryBuilder = quadGeometry.toBuilder();
//   timers.push(["toBuilder()", getDelta(timers)]);
//   const quadIndices = quadGeometryBuilder.indicesArray();
//   timers.push(["indicesArray()", getDelta(timers)]);
//   const quadVertices = quadGeometryBuilder.verticesArray();
//   timers.push(["verticesArray()", getDelta(timers)]);
//   const quadNormals = quadGeometryBuilder.normalsArray();
//   timers.push(["normalsArray()", getDelta(timers)]);
//   const quadUVs = quadGeometryBuilder.uvsArray();
//   timers.push(["uvsArray()", getDelta(timers)]);
//   const quadTangents = quadGeometryBuilder.tangentsArray();
//   timers.push(["tangentsArray()", getDelta(timers)]);
//   const quadLines = quadGeometryBuilder.linesArray();
//   timers.push(["linesArray()", getDelta(timers)]);

//   timers.forEach((timer) => {
//     console.log(`${timer[0]} : ${(timer[1].getMilliseconds()).toFixed(4)}ms`);
//   });

//   const linesPacketProperties: PacketProperties = {
//     vertexArray: {
//       vertexAttributes: {
//         a_position: {
//           array: quadLines,
//           type: AttributeDataType.VEC3
//         }
//       },
//       elementsCount: quadLines.length / 2
//     },
//     uniformBlocks: [
//       {
//         block: linesViewBlock,
//         uniforms: {
//           u_worldViewProjection: {
//             value: new Float32Array(camera.viewProjection.clone().mult(quadTransform.matrix).array),
//           }
//         }
//       },
//       {
//         block: linesBlock,
//         uniforms: {
//           u_color: {
//             value: new Float32Array([255, 0, 0]),
//           }
//         }
//       }
//     ],
//     options: {
//       drawMode: DrawMode.LINES
//     }
//   };
//   const linesPacket = WebGLPacketUtilities.createPacket(gl, linesProgram, linesPacketProperties)!;

//   const phongPacketProperties: PacketProperties = {
//     vertexArray: {
//       vertexAttributes: {
//         a_position: { array: quadVertices, type: AttributeDataType.VEC3 },
//         a_normal: { array: quadNormals, type: AttributeDataType.VEC3, constant: true },
//         a_tangent: { array: quadTangents, type: AttributeDataType.VEC3, constant: true },
//         a_uv: { array: quadUVs, type: AttributeDataType.VEC2 },
//       },
//       elementIndices: quadIndices,
//       elementsCount: quadIndices.length
//     },
//     uniformBlocks: [
//       {
//         block: phongWorldViewBlock,
//         uniforms: {
//           u_model: { value: new Float32Array(quadTransform.matrix.array) },
//           u_modelView: { value: new Float32Array(camera.view.mult(quadTransform.matrix).array) },
//           u_normal: { value: new Float32Array(camera.view.mult(quadTransform.matrix).invert().transpose().array) },
//           u_view: { value: new Float32Array(camera.view.array) },
//           u_camera: { value: new Float32Array(camera.transform.matrix.array) },
//           u_projection: { value: new Float32Array(camera.projection.array) },
//         }
//       },
//       {
//         block: phongLightsBlock,
//         uniforms: {
//           u_lightWorldPos: { value: Array.from(lightTransform.getTranslation(new Vector3()).array) },
//           u_lightColor: { value: [1, 0.8, 0.8] },
//         }
//       },
//       {
//         block: phongBlock,
//         uniforms: {
//           u_ambientColor: { value: [0.1, 0.1, 0.1] },
//           u_diffuseColor: { value: [0.8, 0.8, 0.8] },
//           u_specularColor: { value: [1, 1, 1] },
//           u_ambientFactor: { value: 1 },
//           u_diffuseFactor: { value: 1 },
//           u_specularFactor: { value: 1 },
//           u_shininess: { value: 60 },
//         }
//       }
//     ],
//     uniforms: {
//       u_albedo: { value: albedoMap },
//       u_normalMap: { value: normalMap },
//       u_heightMap: { value: heightMap }
//     }
//   };

//   const phongPacket = WebGLPacketUtilities.createPacket(gl, phongGlProgram, phongPacketProperties)!;
//   WebGLRendererUtilities.viewport(gl, 0, 0, gl.canvas.width, gl.canvas.height);

//   //WebGLRendererUtilities.frontFace(gl, WindingOrder.CW);
//   WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
//   WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);
  
//   let lastFrameTime = 0;
//   let deltaTime = 0;

//   await Input.initialize(gl.canvas);
  
//   WebGLFramebufferUtilities.unbindFramebuffer(gl);

//   const cameraControl = new FreeCameraControl(camera);
  
//   render = function(frameTime: number) {
//     if (paused) {
//       return;
//     }
    
//     frameTime *= 0.001;

//     deltaTime = frameTime - lastFrameTime;
//     lastFrameTime = frameTime;
//     fps = 1 / deltaTime;

//     fpsElement.textContent = fps.toFixed(2);

//     cameraControl.update(deltaTime);
    
//     WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);

//     WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);
//     WebGLRendererUtilities.depthFunction(gl, TestFunction.LESS);

//     WebGLPacketUtilities.setPacketValues(gl, phongPacket, {
//       uniformBlocks: [{
//           block: phongWorldViewBlock,
//           buffer: phongPacket.uniformBlocks!.worldViewBlock.buffer,
//           uniforms: {
//             u_model: { value: new Float32Array(quadTransform.matrix.array) },
//             u_modelView: { value: new Float32Array(camera.view.mult(quadTransform.matrix).array) },
//             u_camera: { value: new Float32Array(camera.transform.matrix.array) },
//             u_view: { value: new Float32Array(camera.view.array) },
//             u_normal: { value: new Float32Array(camera.view.mult(quadTransform.matrix).invert().transpose().array) },
//             u_projection: { value: new Float32Array(camera.projection.array) },
//           }
//       }]
//     });
//     WebGLPacketUtilities.drawPacket(gl, phongPacket);

//     /*WebGLPacketUtilities.setPacketValues(gl, linesPacket, {
//       uniformBlocks: [
//         {
//           block: linesBindings.uniformBlocks.viewBlock,
//           buffer: linesPacket.uniformBlocks!.viewBlock.buffer,
//           uniforms: {
//             u_worldViewProjection: { value: new Float32Array(camera.viewProjection.mult(quadTransform.matrix).array) }
//           }
//         }
//       ]
//     });
//     WebGLPacketUtilities.drawPacket(gl, linesPacket);*/

//     Input.clear();

//     frameRequest = requestAnimationFrame(render);
//   }

//   render(0);
// }