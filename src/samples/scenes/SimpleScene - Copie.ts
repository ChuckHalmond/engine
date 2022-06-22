/*import { Transform } from "../../engine/core/general/Transform";
import { Input, MouseButton } from "../../engine/core/input/Input";
import { OrthographicCamera } from "../../engine/core/rendering/scenes/cameras/OrthographicCamera";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { IcosahedronGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/IcosahedronGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { TextureWrapMode, TextureMagFilter, TextureMinFilter, BufferDataUsage, FramebufferTextureTarget, FramebufferAttachment, Parameter, PixelFormat, Capabilities, BufferMaskBit, TestFunction, FrontFace, TextureTarget, PixelType } from "../../engine/core/rendering/webgl/WebGLConstants";
import { WebGLFramebufferUtilities } from "../../engine/core/rendering/webgl/WebGLFramebufferUtilities";
import { WebGLPacketUtilities, Packet } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilties } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { WebGLRenderbufferUtilities } from "../../engine/core/rendering/webgl/WebGLRenderbuffersUtilities";
import { WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { WebGLTextureUtilities } from "../../engine/core/rendering/webgl/WebGLTextureUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { EulerAngles } from "../../engine/libs/maths/algebra/angles/EulerAngles";
import { Matrix3 } from "../../engine/libs/maths/algebra/matrices/Matrix3";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
import { Quaternion } from "../../engine/libs/maths/algebra/quaternions/Quaternion";
import { Vector2 } from "../../engine/libs/maths/algebra/vectors/Vector2";
import { Vector3, Vector3Values } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Vector4, Vector4Values } from "../../engine/libs/maths/algebra/vectors/Vector4";
import { Space } from "../../engine/libs/maths/geometry/space/Space";
import { clamp } from "../../engine/libs/maths/Snippets";
import { Resources } from "../../engine/resources/Resources";

const simpleSceneDOM = `
<link rel="stylesheet" href="../css/main.css"/>
  <div class="flex-auto flex-cols">
    <main class="flex-rows flex-auto">
        <section class="centered padded">
          <div id="ui" class="flex-cols">
            <div class="flex-auto"><span class="blue">"RigidBuddy FTW!"</span> <span class="yellow">:-)</span></div>
            <div class="flex-none">FPS: <span id="canvas-fps">-.-</span></div>
          </div>
          <div id="widgets"></div>
          <canvas id="canvas" tabindex="0" tooltip="mon-canvas"></canvas>
        </section>
    </main>
  </div>`;

type Widget = {
  name: string;
  data?: any;
} & ({
  type: "range";
  min?: number;
  max?: number;
  value: number;
  setter: (this: Widget, val: number) => void;
} | {
  type: "checkbox";
  value: boolean;
  setter: (this: Widget, val: boolean) => void;
} | {
  type: "select";
  value: string;
  options: ({
    value: string;
    label: string;
  })[];
  setter: (this: Widget, val: string) => void;
});

function addWidgets(widgets: Widget[]) {
  const container = document.getElementById("widgets");
  if (container) {
    widgets.forEach((widget) => {
      let input: HTMLInputElement | HTMLSelectElement | null = null;
      let output: HTMLOutputElement | null = null;
      let label: HTMLLabelElement  = document.createElement("label");
      label.textContent = widget.name;
      switch (widget.type) {
        case "range":
          input = document.createElement("input");
          input.type = "range";
          if (widget.min !== void 0) {
            input.min = widget.min.toString();
          }
          if (widget.max !== void 0) {
            input.max = widget.max.toString();
          }
          input.value = widget.value.toString();
          output = document.createElement("output");
          output.value = widget.value.toString();
          input.onchange = (event: Event) => {
            const newValue = (event.currentTarget as HTMLInputElement).value;
            widget.setter.call(widget, parseFloat(newValue));
            output!.value = newValue;
          };
          break;
        case "checkbox":
          input = document.createElement("input");
          input.type = "checkbox";
          input.value = widget.value.toString();
          input.onclick = (event: Event) => {
            widget.setter.call(widget, (event.currentTarget as HTMLInputElement).checked);
          };
          break;
        case "select":
          input = document.createElement("select");
          input.value = widget.value.toString();
          input.append(
            ...widget.options.map(opt => new Option(opt.label, opt.value))
          );
          input.onchange = (event: Event) => {
            widget.setter.call(widget, (event.currentTarget as HTMLSelectElement).value);
          };
      }
      if (input) {
        container.append(label, input);
        if (output) {
          container.append(output);
        }
      }
    });
  }
}

export async function start() {

  const template = document.createElement('template');

  template.innerHTML = simpleSceneDOM;
  document.body.insertBefore(template.content, document.body.firstChild);

  launchScene();
}

export async function launchScene() {
  let frameRequest: number;
  let render: (time: number) => void;
  let fps: number = 0;

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }
  
  canvas.width = 1200;
  canvas.height = 800;
  
  
  const gl = canvas.getContext('webgl2');
  if (!gl) {
    return;
  }

  const assets = new Resources('assets/engine/');
  await assets.loadList('resources.json');

  // Shaders
  const phongVert = assets.get<string>('shaders/common/phong.vert')!;
  const phongFrag = assets.get<string>('shaders/common/phong.frag')!;
  const phong2Vert = assets.get<string>('shaders/common/phong_2.vert')!;
  const phong2Frag = assets.get<string>('shaders/common/phong_2.frag')!;

  const skyboxVert = assets.get<string>('shaders/common/skybox.vert')!;
  const skyboxFrag = assets.get<string>('shaders/common/skybox.frag')!;

  const textureVert = assets.get<string>('shaders/common/texture.vert')!;
  const textureFrag = assets.get<string>('shaders/common/texture.frag')!;

  // Images
  const albedoMapImg = assets.get<HTMLImageElement>('img/brickwall.jpg')!;
  const normalMapImg = assets.get<HTMLImageElement>('img/brickwall_normal.jpg')!;
  const skyboxXPosImg = assets.get<HTMLImageElement>('img/skybox_x_pos.png')!;
  const skyboxXNegImg = assets.get<HTMLImageElement>('img/skybox_x_neg.png')!;
  const skyboxYPosImg = assets.get<HTMLImageElement>('img/skybox_y_pos.png')!;
  const skyboxYNegImg = assets.get<HTMLImageElement>('img/skybox_y_neg.png')!;
  const skyboxZPosImg = assets.get<HTMLImageElement>('img/skybox_z_pos.png')!;
  const skyboxZNegImg = assets.get<HTMLImageElement>('img/skybox_z_neg.png')!;

  const phongGlProgram = WebGLProgramUtilties.createProgram(gl, phongVert, phongFrag)!;
  const phong2GlProgram = WebGLProgramUtilties.createProgram(gl, phongVert, phongFrag)!;
  const skyboxGlProgram = WebGLProgramUtilties.createProgram(gl, skyboxVert, skyboxFrag)!;
  const texGlProgram = WebGLProgramUtilties.createProgram(gl, textureVert, textureFrag)!;

  const cubeGeometry = new IcosahedronGeometry();
  
  const quad = new QuadGeometry();

  const packetBindings = WebGLPacketUtilities.createBindings(gl, {
    textures: {
      albedoMap: {
        pixels: albedoMapImg,
        width: albedoMapImg.width, height: albedoMapImg.height,
        target: TextureTarget.TEXTURE_2D,
        type: PixelType.UNSIGNED_BYTE,
        format: PixelFormat.RGBA,
      },
      normalMap: {
        pixels: normalMapImg,
        width: normalMapImg.width, height: normalMapImg.height,
        target: TextureTarget.TEXTURE_2D,
        type: PixelType.UNSIGNED_BYTE,
        format: PixelFormat.RGBA,
      },
      skybox: {
        pixels: {
          xPos: skyboxXPosImg, xNeg: skyboxXNegImg,
          yPos: skyboxYPosImg, yNeg: skyboxYNegImg,
          zPos: skyboxZPosImg, zNeg: skyboxZNegImg
        },
        width: skyboxXPosImg.width, height: skyboxXPosImg.height,
        target: TextureTarget.TEXTURE_CUBE_MAP,
        type: PixelType.UNSIGNED_BYTE,
        format: PixelFormat.RGBA,
      },
      fbColorTex: {
        width: canvas.width, height: canvas.height,
        pixels: null,
        target: TextureTarget.TEXTURE_2D,
        type: PixelType.UNSIGNED_BYTE,
        format: PixelFormat.RGBA,
        wrapS: TextureWrapMode.CLAMP_TO_EDGE,
        wrapT: TextureWrapMode.CLAMP_TO_EDGE,
        wrapR: TextureWrapMode.CLAMP_TO_EDGE,
        mag: TextureMagFilter.LINEAR,
        min: TextureMinFilter.LINEAR
      }
    },
    uniformBlocks: {
      worldViewBlock: {usage: BufferDataUsage.DYNAMIC_COPY, program: phongGlProgram },
      lightsBlock: {usage: BufferDataUsage.STATIC_READ, program: phongGlProgram },
      phongBlock: {usage: BufferDataUsage.STATIC_READ, program: phongGlProgram },
    }
  })!;
  
  const worldViewBlock = packetBindings.uniformBlocks.worldViewBlock;
  const lightsBlock = packetBindings.uniformBlocks.lightsBlock;
  const phongBlock = packetBindings.uniformBlocks.phongBlock;

  const albedoMap = packetBindings.textures.albedoMap;
  const normalMap = packetBindings.textures.normalMap;
  const skybox = packetBindings.textures.skybox;
  const fbColorTex = packetBindings.textures.fbColorTex;

  const cube = new Transform();

  const fov = (1 / 3) * Math.PI;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 1;
  const zFar = 1000;

  const left = 0;
  const right = gl.canvas.clientWidth;
  const bottom = 0;
  const top = gl.canvas.clientHeight;
  const near = 400;
  const far = 800;

  const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
  
  camera.transform.globalPosition = new Vector3([0, 0, 10]);
  cube.globalPosition = new Vector3([0, 0, 0]);
  camera.transform.lookAt(new Vector3([0, 0, 0]), Space.up);

  const cameraMat = camera.transform.globalMatrix;
  const viewInverse = cameraMat.clone();
  const view = viewInverse.clone().invert();

  const viewProjection = camera.projection.clone().mult(view);
  const viewProjectionInverse = viewProjection.clone().invert();
  const viewDirectionProjectionInverse = camera.projection.clone().mult(new Matrix4().setIdentity().setRotation(new Matrix3(...view.getRotation()))).invert();

  addWidgets([
    {
      name: "Cube X angle", type: "range",
      value: 0, min: -360, max: 360,
      setter: function(this, val) {
        const rotationMatrix = cube.rotation.toMatrix();
        
        if (!("data" in this)) {
          this.data = {
            lastValue: 0
          };
        }
        if (typeof this.data.lastValue === "number") {
          const lastRotation = Matrix3.rotationX(this.data.lastValue * (Math.PI / 180));
          rotationMatrix.mult(lastRotation.transpose());
        }
        this.data.lastValue = val;

        const newRotation = Quaternion.fromMatrix(rotationMatrix.mult(Matrix3.rotationX(val * (Math.PI / 180))));
        cube.rotation = Quaternion.fromEuler(newRotation.pitch, newRotation.yaw, newRotation.roll);
      }
    },
    {
      name: "Cube Y angle", type: "range",
      value: 0, min: -360, max: 360,
      setter: function(this, val) {
        const rotationMatrix = cube.rotation.toMatrix();
          
        if (!("data" in this)) {
          this.data = {
            lastValue: 0
          };
        }
        if (typeof this.data.lastValue === "number") {
          const lastRotation = Matrix3.rotationY(this.data.lastValue * (Math.PI / 180));
          rotationMatrix.mult(lastRotation.transpose());
        }
        this.data.lastValue = val;

        const newRotation = Quaternion.fromMatrix(rotationMatrix.mult(Matrix3.rotationY(val * (Math.PI / 180))));
        cube.rotation = Quaternion.fromEuler(newRotation.pitch, newRotation.yaw, newRotation.roll);
      }
    },
    {
      name: "Cube Z angle", type: "range",
      value: 0, min: -360, max: 360,
      setter: function(this, val) {
        const rotationMatrix = cube.rotation.toMatrix();
        
        if (!("data" in this)) {
          this.data = {
            lastValue: 0
          };
        }
        if (typeof this.data.lastValue === "number") {
          const lastRotation = Matrix3.rotationZ(this.data.lastValue * (Math.PI / 180));
          rotationMatrix.mult(lastRotation.transpose());
        }
        this.data.lastValue = val;

        const newRotation = Quaternion.fromMatrix(rotationMatrix.mult(Matrix3.rotationZ(val * (Math.PI / 180))));
        cube.rotation = Quaternion.fromEuler(newRotation.pitch, newRotation.yaw, newRotation.roll);
      }
    },
    {
      name: "Cube X", type: "range",
      value: 0, min: -10, max: 10,
      setter: function(this, val) {
        if (!("data" in this)) {
          this.data = {};
        }
        if (typeof this.data.lastValue === "number") {
          cube.translate(Space.right.clone().scale(this.data.lastValue).negate());
        }
        this.data.lastValue = val;
        
        cube.translate(Space.right.clone().scale(val));
      }
    },
    {
      name: "Cube Y", type: "range",
      value: 0, min: -10, max: 10,
      setter: function(this, val) {
        if (!("data" in this)) {
          this.data = {};
        }
        if (typeof this.data.lastValue === "number") {
          cube.translate(Space.up.clone().scale(this.data.lastValue).negate());
        }
        this.data.lastValue = val;

        cube.translate(Space.up.clone().scale(val));
      }
    },
    {
      name: "Cube Z", type: "range",
      value: 0, min: -10, max: 10,
      setter: function(this, val) {
        if (!("data" in this)) {
          this.data = {};
        }
        if (typeof this.data.lastValue === "number") {
          cube.translate(Space.forward.clone().scale(this.data.lastValue).negate());
        }
        this.data.lastValue = val;

        cube.translate(Space.forward.clone().scale(val));
      }
    }
  ]);

  const quadWorld = new Matrix4().setIdentity();

  const phongCubePacketValues: Packet = {

    vertexArray: {
      attributes: {
        a_position: { array: new Float32Array(cubeGeometry.vertices.array), props: { numComponents: 3 } },
        a_normal: { array: new Float32Array(cubeGeometry.verticesNormals.array), props: { numComponents: 3 } },
        a_tangent: { array: new Float32Array(cubeGeometry.tangents.array), props: { numComponents: 3 } },
        a_bitangent: { array: new Float32Array(cubeGeometry.bitangents.array), props: { numComponents: 3 } },
        a_color: { array:
            new Float32Array(Color.array(
              ...Array(cubeGeometry.indices.length).fill(Color.BLUE)
            )), props: { numComponents: 4, normalized: true }
        },
        a_uv: { array: new Float32Array(cubeGeometry.uvs.array), props: { numComponents: 2 } },
      },
      indices: new Uint16Array(cubeGeometry.indices),
      numElements: cubeGeometry.indices.length
    },

    uniformBlocks: [
      {
        block: worldViewBlock,
        uniforms: {
          u_world: { value: new Float32Array(cube.globalMatrix.array) },
          u_view: { value: new Float32Array(view.array) },
          u_viewInverse: { value: new Float32Array(cameraMat.array) },
          u_worldInverseTranspose: { value: new Float32Array(cube.globalMatrix.clone().invert().transpose().array) },
          u_worldViewProjection: { value: new Float32Array(viewProjection.clone().mult(cube.globalMatrix).array) }
        }
      },
      {
        block: lightsBlock,
        uniforms: {
          u_lightWorldPos: { value: [0, 0, 0] },
          u_lightColor: { value: [1, 0.8, 0.8] },
        }
      },
      {
        block: phongBlock,
        uniforms: {
          u_specular: { value: [1, 1, 1, 1] },
          u_shininess: { value: 50 },
          u_specularFactor: { value: 1 }
        }
      }
    ],
    uniforms: {
      u_albedo: { value: albedoMap },
      u_normalMap: { value: normalMap }
    }
  };

  const phong2CubePacketValues: Packet = {

    vertexArray: {
      attributes: {
        a_position: { array: new Float32Array(cubeGeometry.vertices.array), props: { numComponents: 3 } },
        a_normal: { array: new Float32Array(cubeGeometry.verticesNormals.array), props: { numComponents: 3 } },
        a_tangent: { array: new Float32Array(cubeGeometry.tangents.array), props: { numComponents: 3 } },
        a_bitangent: { array: new Float32Array(cubeGeometry.bitangents.array), props: { numComponents: 3 } },
        a_color: { array:
            new Float32Array(Color.array(
              ...Array(cubeGeometry.indices.length).fill(Color.BLUE)
            )), props: { numComponents: 4, normalized: true }
        },
        a_uv: { array: new Float32Array(cubeGeometry.uvs.array), props: { numComponents: 2 } },
      },
      indices: new Uint16Array(cubeGeometry.indices),
      numElements: cubeGeometry.indices.length
    },

    uniformBlocks: [
      {
        block: worldViewBlock,
        uniforms: {
          u_world: { value: new Float32Array(cube.globalMatrix.array) },
          u_view: { value: new Float32Array(view.array) },
          u_viewInverse: { value: new Float32Array(cameraMat.array) },
          u_worldInverseTranspose: { value: new Float32Array(cube.globalMatrix.clone().invert().transpose().array) },
          u_worldViewProjection: { value: new Float32Array(viewProjection.clone().mult(cube.globalMatrix).array) }
        }
      },
      {
        block: lightsBlock,
        uniforms: {
          u_lightWorldPos: { value: [0, 0, 0] },
          u_lightColor: { value: [1, 0.8, 0.8] },
        }
      },
      {
        block: phongBlock,
        uniforms: {
          u_specular: { value: [1, 1, 1, 1] },
          u_shininess: { value: 50 },
          u_specularFactor: { value: 1 }
        }
      }
    ],
    uniforms: {
      u_albedo: { value: albedoMap },
      u_normalMap: { value: normalMap }
    }
  };

  const skyboxPacketValues: Packet = {

    vertexArray: {
      attributes: {
        a_position: { array: new Float32Array(quad.vertices.array), props: { numComponents: 3 } },
      },
      indices: new Uint16Array(quad.indices),
      numElements: quad.indices.length
    },
    
    uniforms: {
      u_world: { value: new Float32Array(quadWorld.array) },
      u_viewDirectionProjectionInverse: { value: new Float32Array(viewDirectionProjectionInverse.array) }, 
      u_skybox: { value: skybox },
    }
  };

  const texPacketValues: Packet = {
    vertexArray: {
      attributes: {
        a_position: { array: new Float32Array(quad.vertices.array), props: { numComponents: 3 } },
        a_uv: { array: new Float32Array(quad.uvs.array), props: { numComponents: 2 } },
      },
      indices: new Uint16Array(quad.indices),
      numElements: quad.indices.length
    },

    uniforms: {
      u_world: { value: new Float32Array(new Matrix4().setIdentity().array) },
      u_tex: { value: fbColorTex }
    }
  };


  const phongCubePacketSetter = WebGLPacketUtilities.getPacketSetter(gl, phongGlProgram, phongCubePacketValues)!;
  WebGLPacketUtilities.setPacketValues(gl, phongCubePacketSetter, phongCubePacketValues);

  const phong2CubePacketSetter = WebGLPacketUtilities.getPacketSetter(gl, phong2GlProgram, phong2CubePacketValues)!;
  WebGLPacketUtilities.setPacketValues(gl, phong2CubePacketSetter, phong2CubePacketValues);


  const skyboxPacketSetter = WebGLPacketUtilities.getPacketSetter(gl, skyboxGlProgram, skyboxPacketValues)!;
  WebGLPacketUtilities.setPacketValues(gl, skyboxPacketSetter, skyboxPacketValues);

  const framebuffer = WebGLFramebufferUtilities.createFramebuffer(gl)!;

  WebGLFramebufferUtilities.attachTexture(
    gl, framebuffer, 
      {
        textureTarget: FramebufferTextureTarget.TEXTURE_2D,
        texture: fbColorTex,
        attachment: FramebufferAttachment.COLOR_ATTACHMENT0
      }
  );

  const maxSamples = WebGLRendererUtilities.getParameter(gl, Parameter.MAX_SAMPLES);
  
  const stencilRenderbuffer = WebGLRenderbufferUtilities.createRenderbuffer(gl, {
    internalFormat: PixelFormat.DEPTH24_STENCIL8,
    width: canvas.width,
    height: canvas.height,
    samples: maxSamples
  })!;

  const antialiasRenderbuffer = WebGLRenderbufferUtilities.createRenderbuffer(gl, {
    internalFormat: PixelFormat.RGBA8,
    width: canvas.width,
    height: canvas.height,
    samples: maxSamples
  })!;

  WebGLFramebufferUtilities.attachRenderbuffer(
    gl, framebuffer,
    {
      renderbuffer: stencilRenderbuffer,
      attachment: FramebufferAttachment.DEPTH_STENCIL_ATTACHMENT
    },
    {
      renderbuffer: antialiasRenderbuffer,
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
    }
  );

  const texPacketSetter = WebGLPacketUtilities.getPacketSetter(gl, texGlProgram, texPacketValues)!;
  WebGLPacketUtilities.setPacketValues(gl, texPacketSetter, texPacketValues);

  WebGLRendererUtilities.setViewport(gl, 0, 0, gl.canvas.width, gl.canvas.height);

  WebGLRendererUtilities.setFrontFace(gl, FrontFace.CW);
  WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
  WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);
  
  let lastFrameTime = 0;
  let deltaTime = 0;
  
  let anim = 0;
  let direction = 1;
  let initRot = cube.rotation.clone();
  let initPos = cube.globalPosition.clone();
  const targetPos = new Vector3([1, 1, 1]);

  await Input.initialize(document.body);
  
  render = function(frameTime: number) {
    
    frameTime *= 0.001;

    deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;
    fps = 1 / deltaTime;

    cube.rotation = cube.rotation
      .slerp(initRot, initRot.clone().mult(
        Quaternion.fromAxisAngle(Space.left, Math.PI / 6)
        .mult(
          Quaternion.fromAxisAngle(Space.forward, Math.PI / 6)
        )
      ), anim * 8);
    
    cube.globalPosition = cube.globalPosition
      .lerp(initPos, targetPos, anim * 8);

    
    anim += (deltaTime / 4) * direction;
    if (anim > 1 || anim < 0) {
      direction *= -1;
    }
    
    WebGLRendererUtilities.setClearColor(gl, Color.GREEN.valuesNormalized());
    WebGLRendererUtilities.clearBuffers(gl, BufferMaskBit.COLOR_BUFFER_BIT | BufferMaskBit.DEPTH_BUFFER_BIT);
    
    viewInverse.copy(cameraMat);
    view.copy(cameraMat).invert();
    viewProjection.copy(camera.projection).mult(view);
    viewDirectionProjectionInverse.copy(camera.projection).mult(new Matrix4().setIdentity().setRotation(new Matrix3(...view.getRotation()))).invert();


    // Framebuffer

    WebGLFramebufferUtilities.bindFramebuffer(gl, framebuffer);

    // Framebuffer

    WebGLRendererUtilities.clearBuffers(gl, BufferMaskBit.COLOR_BUFFER_BIT | BufferMaskBit.DEPTH_BUFFER_BIT);
    
    WebGLPacketUtilities.setPacketValues(gl, phongCubePacketSetter, {
      uniformBlocks: [{
          block: worldViewBlock,
          uniforms: {
            u_world: { value: new Float32Array(cube.globalMatrix.array) },
            u_view: { value: new Float32Array(view.array) },
            u_viewInverse: { value: new Float32Array(viewInverse.array) },
            u_worldInverseTranspose: { value: new Float32Array(cube.globalMatrix.clone().invert().transpose().array) },
            u_worldViewProjection: { value: new Float32Array(viewProjection.clone().mult(cube.globalMatrix).array) }
          }
      }]
    });
    WebGLRendererUtilities.setDepthFunction(gl, TestFunction.LESS);
    //WebGLPacketUtilities.drawPacket(gl, phongCubePacketSetter);
    
    WebGLPacketUtilities.drawPacket(gl, phong2CubePacketSetter);

    WebGLPacketUtilities.setPacketValues(gl, skyboxPacketSetter, {
      uniforms: {
        u_viewDirectionProjectionInverse: { value: new Float32Array(viewDirectionProjectionInverse.array) }
      }
    });

    WebGLRendererUtilities.setDepthFunction(gl, TestFunction.LEQUAL);
    WebGLPacketUtilities.drawPacket(gl, skyboxPacketSetter);

    
    // Framebuffer

    WebGLFramebufferUtilities.blit(gl, framebuffer, postFramebuffer,
      [0, 0, canvas.width, canvas.height],
      [0, 0, canvas.width, canvas.height],
      BufferMaskBit.COLOR_BUFFER_BIT,
      TextureMagFilter.LINEAR
    );
    
    WebGLFramebufferUtilities.unbindFramebuffer(gl);

    WebGLProgramUtilties.useProgram(gl, texGlProgram);
    WebGLRendererUtilities.setDepthFunction(gl, TestFunction.LEQUAL);
    WebGLPacketUtilities.drawPacket(gl, texPacketSetter);

    // Framebuffer

    Input.clear();

    frameRequest = requestAnimationFrame(render);
  }

  render(0);
}

let lastPos = new Vector2();
function updateCamera(camera: Matrix4, target: Vector3, up: Vector3) {
  if (Input.getMouseButtonDown(MouseButton.RIGHT)) {
    lastPos.copy(Input.getMouseButtonPosition());
  }

  if (Input.getMouseButton(MouseButton.RIGHT)) {
    const newPos = Input.getMouseButtonPosition();
    
    if (!newPos.equals(lastPos)) {

      const angleX = (newPos.x - lastPos.x);
      const angleY = (newPos.y - lastPos.y);

      const eye = new Vector3([camera.m41, camera.m42, camera.m43]);

      camera.m41 = eye.x;
      camera.m42 = eye.y;
      camera.m43 = eye.z;

      lastPos.copy(newPos);
    }
  }
}*/