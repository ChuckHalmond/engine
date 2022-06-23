import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { GeometryBuffer } from "../../engine/core/rendering/scenes/geometries/GeometryBuffer";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { FramebufferAttachment, FramebufferTextureTarget, RenderbufferPixelFormat, WebGLFramebufferUtilities } from "../../engine/core/rendering/webgl/WebGLFramebufferUtilities";
import { WebGLPacketUtilities, PacketProperties } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, TestFunction, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { TexturePixelFormat, TexturePixelType, TextureMagFilter, TextureMinFilter, TextureTarget, TextureWrapMode, WebGLTextureUtilities, TextureInternalPixelFormat } from "../../engine/core/rendering/webgl/WebGLTextureUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
import { Quaternion } from "../../engine/libs/maths/algebra/quaternions/Quaternion";
import { Vector3, Vector3Values } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Space } from "../../engine/libs/maths/geometry/space/Space";
import { addWidgets, createPositionWidgets, createRelativePositionWidgets, createRotationWidgets } from "./Common";

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
        </section>
    </main>
  </div>`;

export async function start() {
  const template = document.createElement("template");
  template.innerHTML = simpleSceneDOM;
  document.body.insertBefore(template.content, document.body.firstChild);
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
  
  const gl = canvas.getContext("webgl2"/*, {antialias: true}*//*, {preserveDrawingBuffer: true}*/);
  if (!gl) {
    return;
  }

  // Shaders
  const phongVert = await fetch("assets/engine/shaders/common/phong.vert.glsl").then(resp => resp.text());
  const phongFrag = await fetch("assets/engine/shaders/common/phong.frag.glsl").then(resp => resp.text());
  const phongGlProgram = WebGLProgramUtilities.createProgram(gl, phongVert, phongFrag)!;

  const skyboxVert = await fetch("assets/engine/shaders/common/skybox.vert").then(resp => resp.text());
  const skyboxFrag = await fetch("assets/engine/shaders/common/skybox.frag").then(resp => resp.text());
  const skyboxGlProgram = WebGLProgramUtilities.createProgram(gl, skyboxVert, skyboxFrag)!;
  
  const textureVert = await fetch("assets/engine/shaders/common/texture.vert").then(resp => resp.text());
  const textureFrag = await fetch("assets/engine/shaders/common/texture.frag").then(resp => resp.text());
  const texGlProgram = WebGLProgramUtilities.createProgram(gl, textureVert, textureFrag)!;

  const basicVert = await fetch("assets/engine/shaders/common/basic.vert.glsl").then(resp => resp.text());
  const basicFrag = await fetch("assets/engine/shaders/common/basic.frag.glsl").then(resp => resp.text());
  const basicGlProgram = WebGLProgramUtilities.createProgram(gl, basicVert, basicFrag)!;
  
  const depthVert = await fetch("assets/engine/shaders/common/depth.vert.glsl").then(resp => resp.text());
  const depthFrag = await fetch("assets/engine/shaders/common/depth.frag.glsl").then(resp => resp.text());
  const depthGlProgram = WebGLProgramUtilities.createProgram(gl, depthVert, depthFrag)!;

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
  const albedoMapImg = await fetchImage("assets/engine/img/brickwall.jpg");
  const normalMapImg = await fetchImage("assets/engine/img/NormalMap_0.png");
  const heightMapImg = await fetchImage("assets/engine/img/HeightMap_0.png");
  const skyboxXPosImg = await fetchImage("assets/engine/img/skybox_x_pos.png");
  const skyboxXNegImg = await fetchImage("assets/engine/img/skybox_x_neg.png");
  const skyboxYPosImg = await fetchImage("assets/engine/img/skybox_y_pos.png");
  const skyboxYNegImg = await fetchImage("assets/engine/img/skybox_y_neg.png");
  const skyboxZPosImg = await fetchImage("assets/engine/img/skybox_z_pos.png");
  const skyboxZNegImg = await fetchImage("assets/engine/img/skybox_z_neg.png");

  const norm16Extension = gl.getExtension("EXT_texture_norm16");
  if (norm16Extension) {
    console.log(`Extension EXT_texture_norm16 activated.`);
  }

  const phongPacketBindings = WebGLPacketUtilities.createBindings(gl, {
    textures: {
      albedoMap: {
        pixels: albedoMapImg,
        width: albedoMapImg.width, height: albedoMapImg.height,
        target: TextureTarget.TEXTURE_2D,
        type: TexturePixelType.UNSIGNED_BYTE,
        format: TexturePixelFormat.RGBA,
        internalFormat: TextureInternalPixelFormat.RGBA8
      },
      normalMap: {
        pixels: normalMapImg,
        width: normalMapImg.width, height: normalMapImg.height,
        target: TextureTarget.TEXTURE_2D,
        type: TexturePixelType.UNSIGNED_BYTE,
        format: TexturePixelFormat.RGB,
        internalFormat: TextureInternalPixelFormat.RGB8,
        min: TextureMinFilter.LINEAR_MIPMAP_LINEAR,
        mag: TextureMagFilter.LINEAR
      },
      heightMap: {
        pixels: heightMapImg,
        width: heightMapImg.width, height: heightMapImg.height,
        target: TextureTarget.TEXTURE_2D,
        type: TexturePixelType.UNSIGNED_BYTE,
        format: TexturePixelFormat.RGBA,
        internalFormat: TextureInternalPixelFormat.RGBA8
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
        internalFormat: TextureInternalPixelFormat.RGBA8
      },
      fbColorTex: {
        width: canvas.width, height: canvas.height,
        pixels: null,
        target: TextureTarget.TEXTURE_2D,
        type: TexturePixelType.UNSIGNED_BYTE,
        format: TexturePixelFormat.RGBA,
        internalFormat: TextureInternalPixelFormat.RGBA8,
        wrapS: TextureWrapMode.CLAMP_TO_EDGE,
        wrapT: TextureWrapMode.CLAMP_TO_EDGE,
        wrapR: TextureWrapMode.CLAMP_TO_EDGE,
        mag: TextureMagFilter.LINEAR,
        min: TextureMinFilter.LINEAR,
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
    },
    program: phongGlProgram,
    uniformBlocks: ["worldViewBlock", "lightsBlock", "phongBlock"]
  })!;

  const basicPacketBindings = WebGLPacketUtilities.createBindings(gl, {
    program: basicGlProgram,
    uniformBlocks: ["basicBlock"]
  })!;

  const worldViewBlock = phongPacketBindings.uniformBlocks.worldViewBlock;
  const lightsBlock = phongPacketBindings.uniformBlocks.lightsBlock;
  const phongBlock = phongPacketBindings.uniformBlocks.phongBlock;
  const basicBlock = basicPacketBindings.uniformBlocks.basicBlock;

  const albedoMap = phongPacketBindings.textures.albedoMap;
  const normalMap = phongPacketBindings.textures.normalMap;
  const heightMap = phongPacketBindings.textures.heightMap;
  const skybox = phongPacketBindings.textures.skybox;
  const fbColorTex = phongPacketBindings.textures.fbColorTex;
  const depthTex = phongPacketBindings.textures.depthTex;

  const anisotropicExtension = gl.getExtension("EXT_texture_filter_anisotropic");
  if (anisotropicExtension) {
    console.log(`Extension EXT_texture_filter_anisotropic activated.`);
    const maxFiltering = gl.getParameter(anisotropicExtension.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    const textures = [albedoMap, normalMap];
    textures.forEach((texture) => {
      gl.activeTexture(gl.TEXTURE0 + texture.unit);
      gl.bindTexture(texture.target, texture.internal);
      gl.texParameterf(gl.TEXTURE_2D, anisotropicExtension.TEXTURE_MAX_ANISOTROPY_EXT, maxFiltering);
    });
  }

  const cubeGeometry = new CubeGeometry({widthSegment: 2}/*{height: 0.5, width: 2}*/);
  const cubeGeometryBuilder = cubeGeometry.toBuilder();
  const quad = new QuadGeometry();
  const quadGeometryBuilder = quad.toBuilder();
  const cube = new Transform();

  const fov = (1 / 3) * Math.PI;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 0.1;
  const zFar = 100;

  const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);

  const lightTransform = new Transform();
  lightTransform.setTranslation(new Vector3([0, 2, 2]));
  lightTransform.setScaling(new Vector3([0.2, 0.2, 0.2]));

  camera.transform.setTranslation(lightTransform.getTranslation(new Vector3()));
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
    a_position: { array: cubeVertices, numComponents: 3 },
    a_normal: { array: cubeNormals, numComponents: 3 },
    a_tangent: { array: cubeTangents, numComponents: 3 },
    a_uv: { array: cubeUVs, numComponents: 2 },
    indices: { array: cubeIndices, numComponents: 1 },
  }, true);
  /*cubeGeometryBuilder.faces.forEach((face) => {
    console.log(face);
    console.log(face.normal.values());
    console.log(face.tangent.values());
  });*/

  const phongCubePacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: { array: cubeVertices, numComponents: 3 },
        a_normal: { array: cubeNormals, numComponents: 3 },
        a_tangent: { array: cubeTangents, numComponents: 3 },
        a_uv: { array: cubeUVs, numComponents: 2 },
      },
      indices: cubeIndices,
      numElements: cubeIndices.length
    },
    uniformBlocks: [
      {
        block: worldViewBlock,
        uniforms: {
          u_model: { value: cube.matrix.array },
          u_modelView: { value: camera.view.mult(cube.matrix).array },
          u_normal: { value: camera.view.mult(cube.matrix).invert().transpose().array },
          u_view: { value: camera.view.array },
          u_camera: { value: camera.transform.matrix.array },
          u_projection: { value: camera.projection.array },
        }
      },
      {
        block: lightsBlock,
        uniforms: {
          u_lightWorldPos: { value: Array.from(lightTransform.getTranslation(new Vector3())) },
          u_lightColor: { value: [1, 0.8, 0.8] },
        }
      },
      {
        block: phongBlock,
        uniforms: {
          u_ambientColor: { value: [0.1, 0.1, 0.1] },
          u_diffuseColor: { value: [0.8, 0, 0] },
          u_specularColor: { value: [1, 1, 1] },
          u_ambientFactor: { value: 1 },
          u_diffuseFactor: { value: 1 },
          u_specularFactor: { value: 1 },
          u_shininess: { value: 36 },
        }
      }
    ],
    uniforms: {
      u_albedo: { value: albedoMap },
      u_normalMap: { value: normalMap },
      u_heightMap: { value: heightMap }
    }
  };

  const basicPacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: { array: cubeVertices, numComponents: 3 },
      },
      indices: cubeIndices,
      numElements: cubeIndices.length
    },
    uniformBlocks: [
      {
        block: basicBlock,
        uniforms: {
          u_model: { value: Array.from(lightTransform.matrix.array) },
          u_viewProjection: { value: Array.from(camera.viewProjection.array) },
          u_color: { value: [1, 1, 0] },
        }
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
        a_position: { array: quadVertices, numComponents: 3 },
      },
      indices: quadIndices,
      numElements: quadIndices.length
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
        a_position: { array: quadVertices, numComponents: 3 },
        a_uv: { array: quadUVs, numComponents: 2 },
      },
      indices: quadIndices,
      numElements: quadIndices.length
    },
    uniforms: {
      u_world: { value: quadWorld.array },
      u_tex: { value: depthTex }
    }
  };

  const texPacketProperties: PacketProperties = {
    vertexArray: {
      attributes: {
        a_position: { array: quadVertices, numComponents: 3 },
        a_uv: { array: quadUVs, numComponents: 2 },
      },
      indices: quadIndices,
      numElements: quadIndices.length
    },
    uniforms: {
      u_world: { value: quadWorld.array },
      u_tex: { value: fbColorTex }
    }
  };

  const basicPacket = WebGLPacketUtilities.createPacket(gl, basicGlProgram, basicPacketProperties)!;
  const phongCubePacket = WebGLPacketUtilities.createPacket(gl, phongGlProgram, phongCubePacketProperties)!;
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
    /*transform.globalPosition = transform.globalPosition
      .lerp(initPosition, targetPosition, t);*/
    transform.setRotation(transform.getRotation(new Quaternion()).slerp(initRotation, targetRotation, t));
  }

  Input.initialize(gl.canvas);
  
  WebGLFramebufferUtilities.unbindFramebuffer(gl);

  const cameraControl = new FreeCameraControl(camera);

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

    fpsElement.textContent = fps.toFixed(2);

    cameraControl.update(deltaTime);

    animate(
      cube,
      initPosition, initRotation,
      initPosition, targetRotation,
      t
    );
    
    t += deltaTime * direction * 0.5;
    
    WebGLRendererUtilities.clearColor(gl, Color.GREEN.valuesNormalized());
    WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);
    
    viewDirectionProjectionInverse.copy(camera.projection).mult(new Matrix4().setIdentity().setRotation(camera.view.getRotation())).invert();

    // Framebuffer
    //WebGLFramebufferUtilities.bindFramebuffer(gl, depthFramebuffer);
    WebGLFramebufferUtilities.bindFramebuffer(gl, framebuffer);

    WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);
    WebGLRendererUtilities.depthFunction(gl, TestFunction.LESS);

    WebGLPacketUtilities.setPacketValues(gl, phongCubePacket, {
      uniformBlocks: [{
          block: worldViewBlock,
          buffer: phongCubePacket.uniformBlocks!.worldViewBlock.buffer,
          uniforms: {
            u_model: { value: cube.matrix.array },
            u_modelView: { value: camera.view.mult(cube.matrix).array },
            u_camera: { value: camera.transform.matrix.array },
            u_view: { value: camera.view.array },
            u_normal: { value: camera.view.mult(cube.matrix).invert().transpose().array },
            u_projection: { value: camera.projection.array },
          }
      }]
    });

    WebGLPacketUtilities.drawPacket(gl, phongCubePacket);

    WebGLPacketUtilities.setPacketValues(gl, basicPacket, {
      uniformBlocks: [
        {
          block: basicBlock,
          buffer: basicPacket.uniformBlocks!.basicBlock.buffer,
          uniforms: {
            u_viewProjection: { value: camera.viewProjection.array },
          }
        }
      ]
    });
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
}