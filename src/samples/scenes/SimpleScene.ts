import { ArcBallControl } from "../../engine/core/controls/ArcBallControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input, MouseButton } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { IcosahedronGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/IcosahedronGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { TextureWrapMode, TextureMagFilter, TextureMinFilter, BufferDataUsage, FramebufferTextureTarget, FramebufferAttachment, Parameter, PixelFormat, Capabilities, BufferMaskBit, TestFunction } from "../../engine/core/rendering/webgl/WebGLConstants";
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

const simpleSceneDOM = /*template*/`
<link rel="stylesheet" href="../css/main.css"/>
  <div class="flex-auto flex-cols">
    <main class="flex-rows flex-auto">
        <section class="centered padded">
          <div id="ui" class="flex-cols">
            <div class="flex-auto"><span class="blue">"RigidBuddy FTW!"</span> <span class="yellow">:-)</span></div>
            <div class="flex-none">FPS: <span id="canvas-fps">-.-</span></div>
          </div>
          <canvas id="canvas" tabindex="0" tooltip="mon-canvas"></canvas>
        </section>
    </main>
  </div>`;

export async function start() {

  const template = document.createElement('template');

  template.innerHTML = simpleSceneDOM;
  document.body.insertBefore(template.content, document.body.firstChild);

  /*const imports = Array.from(document.getElementsByTagName('e-import'));
  Promise.all(imports.map((imp) => {
    return new Promise((resolve) => {
      imp.addEventListener('loaded', () => {
        resolve(true);
      }, {once: true});
    })
  })).then(function(){ */
    //editor.setup().then(() => {
      launchScene();
    //});
  //});
}
/*
function test() {
  const data = [
    {
      name: 'John Doe',
      age: 25
    },
    {
      name: 'Jane Doe',
      age: 24
    }
  ];

  const table = HTMLTableTemplate({
    headerCells: Object.keys(data[0]),
    bodyCells: data.map(data => {
      return [{type: 'header', content: data.name}, data.age.toString()];
    }),
    footerCells: [
      {type: 'header', content: 'Total age'},
      data.reduce((acc, curr) => {
        return (acc + curr.age);
      }, 0).toString()
    ]
  });

  document.querySelector('#play-panel')!.append(table);
}*/

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

  const skyboxVert = assets.get<string>('shaders/common/skybox.vert')!;
  const skyboxFrag = assets.get<string>('shaders/common/skybox.frag')!;

  const textureVert = assets.get<string>('shaders/common/texture.vert')!;
  const textureFrag = assets.get<string>('shaders/common/texture.frag')!;

  const primitiveVert = assets.get<string>('shaders/common/primitive.vert')!;
  const primitiveFrag = assets.get<string>('shaders/common/primitive.frag')!;

  // Images
  const albedoMapImg = assets.get<HTMLImageElement>('img/brickwall.jpg')!;
  const normalMapImg = assets.get<HTMLImageElement>('img/brickwall_normal.jpg')!;
  const skyboxXPosImg = assets.get<HTMLImageElement>('img/skybox_x_pos.png')!;
  const skyboxXNegImg = assets.get<HTMLImageElement>('img/skybox_x_neg.png')!;
  const skyboxYPosImg = assets.get<HTMLImageElement>('img/skybox_y_pos.png')!;
  const skyboxYNegImg = assets.get<HTMLImageElement>('img/skybox_y_neg.png')!;
  const skyboxZPosImg = assets.get<HTMLImageElement>('img/skybox_z_pos.png')!;
  const skyboxZNegImg = assets.get<HTMLImageElement>('img/skybox_z_neg.png')!;
  const wavesNormalImg = assets.get<HTMLImageElement>('img/waves_normal.png')!;

  const phongGlProg = WebGLProgramUtilties.createProgramFromSources(gl, phongVert, phongFrag)!;
  const skyboxGlProg = WebGLProgramUtilties.createProgramFromSources(gl, skyboxVert, skyboxFrag)!;
  const texGlProg = WebGLProgramUtilties.createProgramFromSources(gl, textureVert, textureFrag)!;
  const primitiveGlProg = WebGLProgramUtilties.createProgramFromSources(gl, primitiveVert, primitiveFrag)!;

  const cube = new CubeGeometry();
  const icosahedron = new IcosahedronGeometry();
  const quad = new QuadGeometry();
  
  const packetBindings = WebGLPacketUtilities.createPacketBindings(gl, {
    texturesProps: {
      albedoMap: WebGLTextureUtilities.guessTextureProperties({pixels: albedoMapImg}),
      normalMap: WebGLTextureUtilities.guessTextureProperties({pixels: normalMapImg}),
      skybox: 
        WebGLTextureUtilities.guessTextureProperties({
          pixels: {
            xPos: skyboxXPosImg, xNeg: skyboxXNegImg,
            yPos: skyboxYPosImg, yNeg: skyboxYNegImg,
            zPos: skyboxZPosImg, zNeg: skyboxZNegImg
          },
          wrapS: TextureWrapMode.CLAMP_TO_EDGE,
          wrapT: TextureWrapMode.CLAMP_TO_EDGE,
          wrapR: TextureWrapMode.CLAMP_TO_EDGE,
          mag: TextureMagFilter.LINEAR,
          min: TextureMinFilter.LINEAR
        }),
      fbColorTex:
        WebGLTextureUtilities.guessTextureProperties({
          width: canvas.width, height: canvas.height, pixels: null,
          wrapS: TextureWrapMode.CLAMP_TO_EDGE,
          wrapT: TextureWrapMode.CLAMP_TO_EDGE,
          wrapR: TextureWrapMode.CLAMP_TO_EDGE,
          mag: TextureMagFilter.LINEAR,
          min: TextureMinFilter.LINEAR
        }),
    },
    blocksProps: {
      worldViewBlock: {name: 'WorldViewBlock', usage: BufferDataUsage.DYNAMIC_COPY },
      lightsBlock: {name: 'LightsBlock', usage: BufferDataUsage.STATIC_READ },
      phongBlock: {name: 'PhongBlock', usage: BufferDataUsage.STATIC_READ }
    }
  })!;
  
  const worldViewBlock = packetBindings.blocks.worldViewBlock;
  const lightsBlock = packetBindings.blocks.lightsBlock;
  const phongBlock = packetBindings.blocks.phongBlock;

  const albedoMap = packetBindings.textures.albedoMap;
  const normalMap = packetBindings.textures.normalMap;
  const skybox = packetBindings.textures.skybox;

  const fbColorTex = packetBindings.textures.fbColorTex;

  const fov = 30 * Math.PI / 180;
  const aspect = gl.canvas.width / gl.canvas.height;
  const zNear = 1;
  const zFar = 100;
  const projection = new Matrix4().asPerspective(fov, aspect, zNear, zFar);

  //const cam = new PerspectiveCamera(fov, aspect, zNear, zFar);

  const eye: Vector3 = new Vector3([3, 3, 0]);
  const target: Vector3 = new Vector3([0, 0, 0]);
  const up: Vector3 = new Vector3([0, 1, 0]);
  const camera = new Matrix4().lookAt(eye, target, up);
  
  //const cameraTransform = new Transform();

  const viewInverse = camera.clone();
  const view = camera.clone().invert();
  const viewProjection = projection.clone().mult(view);
  const viewProjectionInverse = viewProjection.clone().invert();

  /*const cubeTransform = new Transform();
  const quadTransform = new Transform();*/
  
  const cubeWorldArr = new Float32Array(16);
  const cubeWorld = new Matrix4().setArray(cubeWorldArr).setIdentity().scaleScalar(0.5);
  const quadWorld = new Matrix4().setIdentity().scaleScalar(2);

  /*const vectorInput = document.createElement('e-vector3-input') as Vector3InputElement;
  vectorInput.vector.setArray(cubeWorldArr.subarray(12, 15));
  
  document.querySelector('#panel-3 section')!.append(vectorInput);*/

  const phongCubePacketValues: Packet = {

    attributes: {
        list: {
          a_position: { array: new Float32Array(cube.vertices.array), props: { numComponents: 3 } },
          a_normal: { array: new Float32Array(cube.verticesNormals.array), props: { numComponents: 3 } },
          a_tangent: { array: new Float32Array(cube.tangents.array), props: { numComponents: 3 } },
          a_bitangent: { array: new Float32Array(cube.bitangents.array), props: { numComponents: 3 } },
          a_color: { array:
              new Float32Array(Color.array(
                ...Array(cube.indices.length).fill(Color.BLUE)
              )), props: { numComponents: 4, normalized: true }
          },
          a_uv: { array: new Float32Array(cube.uvs.array), props: { numComponents: 2 } },
      },
      indices: new Uint16Array(cube.indices),
    },

    uniformBlocks: {
      worldViewBlock: {
        block: worldViewBlock,
        list: {
          u_world: { value: new Float32Array(cubeWorld.array) },
          u_viewInverse: { value: new Float32Array(camera.array) },
          u_worldInverseTranspose: { value: new Float32Array(cubeWorld.clone().invert().transpose().array) },
          u_worldViewProjection: { value: new Float32Array(viewProjection.clone().mult(cubeWorld).array) }
        }
      },
      lightsBlock: {
        block: lightsBlock,
        list: {
          u_lightWorldPos: { value: [1, 6, -6] },
          u_lightColor: { value: [1, 0.8, 0.8, 1] },
          u_ambient: { value: [0, 0, 0, 1] },
        }
      },
      phongBlock: {
        block: phongBlock,
        list: {
          u_specular: { value: [1, 1, 1, 1] },
          u_shininess: { value: 50 },
          u_specularFactor: { value: 1 }
        }
      }
    },

    uniforms: {
      u_diffuseMap: { value: albedoMap },
      u_normalMap: { value: normalMap }
    }
  };

  const skyboxPacketValues: Packet = {

    attributes: {
        list: {
          a_position: { array: new Float32Array(quad.vertices.array), props: { numComponents: 3 } },
      },
      indices: new Uint16Array(quad.indices),
    },
    
    uniforms: {
      u_world: { value: new Float32Array(quadWorld.array) },
      u_viewDirectionProjectionInverse: { value: new Float32Array(viewProjectionInverse.array) }, 
      u_skybox: { value: skybox },
    }
  };

  const texPacketValues: Packet = {
    attributes: {
        list: {
          a_position: { array: new Float32Array(quad.vertices.array), props: { numComponents: 3 } },
          a_uv: { array: new Float32Array(quad.uvs.array), props: { numComponents: 2 } },
      },
      indices: new Uint16Array(quad.indices),
    },

    uniforms: {
      u_world: { value: new Float32Array(new Matrix4().setIdentity().values) },
      u_tex: { value: fbColorTex }
    }
  };


  WebGLProgramUtilties.useProgram(gl, phongGlProg);
  const phongCubePacketSetter = WebGLPacketUtilities.getPacketSetter(gl, phongGlProg, phongCubePacketValues)!;
  WebGLPacketUtilities.setPacketValues(gl, phongCubePacketSetter, phongCubePacketValues);


  WebGLProgramUtilties.useProgram(gl, skyboxGlProg);
  const skyboxPacketSetter = WebGLPacketUtilities.getPacketSetter(gl, skyboxGlProg, skyboxPacketValues)!;
  WebGLPacketUtilities.setPacketValues(gl, skyboxPacketSetter, skyboxPacketValues);

  const fb = WebGLFramebufferUtilities.createFramebuffer(gl)!;

  WebGLFramebufferUtilities.attachTexture(
    gl, fb, 
      {
        texTarget: FramebufferTextureTarget.TEXTURE_2D,
        glTex: fbColorTex.glTex,
        attachment: FramebufferAttachment.COLOR_ATTACHMENT0
      }
  );

  const maxSamples = WebGLRendererUtilities.getParameter(gl, Parameter.MAX_SAMPLES);
  
  const stencilRb = WebGLRenderbufferUtilities.createRenderbuffer(gl, {
    internalFormat: PixelFormat.DEPTH24_STENCIL8,
    width: canvas.width,
    height: canvas.height,
    samples: maxSamples
  })!;

  const antialiasRb = WebGLRenderbufferUtilities.createRenderbuffer(gl, {
    internalFormat: PixelFormat.RGBA8,
    width: canvas.width,
    height: canvas.height,
    samples: maxSamples
  })!;

  WebGLFramebufferUtilities.attachRenderbuffers(
    gl, fb,
      [{
        glRb: stencilRb.glRb,
        attachment: FramebufferAttachment.DEPTH_STENCIL_ATTACHMENT
      },
      {
        glRb: antialiasRb.glRb,
        attachment: FramebufferAttachment.COLOR_ATTACHMENT0,
      }]
  );

  const postFb = WebGLFramebufferUtilities.createFramebuffer(gl)!;

  WebGLFramebufferUtilities.attachTexture(
    gl, postFb, 
      {
        texTarget: FramebufferTextureTarget.TEXTURE_2D,
        glTex: fbColorTex.glTex,
        attachment: FramebufferAttachment.COLOR_ATTACHMENT0
      }
  );


  WebGLProgramUtilties.useProgram(gl, texGlProg);
  const texPacketSetter = WebGLPacketUtilities.getPacketSetter(gl, texGlProg, texPacketValues)!;
  WebGLPacketUtilities.setPacketValues(gl, texPacketSetter, texPacketValues);


  WebGLRendererUtilities.setViewport(gl, 0, 0, gl.canvas.width, gl.canvas.height);

  WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
  WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);

  
  let lastFrameTime = 0;
  let deltaTime = 0;
    
  await Input.initialize(document.body);
  
  render = function(frameTime: number) {
    
    frameTime *= 0.001;

    deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;
    fps = 1 / deltaTime;

    //canvasFPS!.innerHTML = fps.toFixed(2);
    
    WebGLRendererUtilities.clearColor(gl, Color.GREEN.valuesNormalized());
    WebGLRendererUtilities.clear(gl, BufferMaskBit.COLOR_BUFFER_BIT | BufferMaskBit.DEPTH_BUFFER_BIT);

    updateCamera(camera, target, up);

    viewInverse.copy(camera);
    view.copy(viewInverse).invert();
    viewProjection.copy(projection).mult(view);
    viewProjectionInverse.copy(viewProjection).invert();

    //cubeWorld.rotateY(deltaTime);
    //viewProjectionInverse.rotateY(deltaTime / 2);
    //viewProjectionInverse.rotateX(deltaTime);




    // Framebuffer

    WebGLFramebufferUtilities.bindFramebuffer(gl, fb);

    // Framebuffer

    WebGLRendererUtilities.clear(gl, BufferMaskBit.COLOR_BUFFER_BIT | BufferMaskBit.DEPTH_BUFFER_BIT);
    

    WebGLProgramUtilties.useProgram(gl, phongGlProg);
    WebGLPacketUtilities.setPacketValues(gl, phongCubePacketSetter, {
      uniformBlocks: {
        worldViewBlock: {
          block: worldViewBlock,
          list: {
            u_world: { value: new Float32Array(cubeWorld.array) },
            u_viewInverse: { value: new Float32Array(viewInverse.array) },
            u_worldInverseTranspose: { value: new Float32Array(cubeWorld.clone().invert().transpose().array) },
            u_worldViewProjection: { value: new Float32Array(viewProjection.clone().mult(cubeWorld).array) }
          }
        }
      }
    });
    WebGLRendererUtilities.depthFunc(gl, TestFunction.LESS);
    WebGLPacketUtilities.drawPacket(gl, phongCubePacketSetter);


    WebGLProgramUtilties.useProgram(gl, skyboxGlProg);
    WebGLPacketUtilities.setPacketValues(gl, skyboxPacketSetter, {
      uniforms: {
        u_world: { value: new Float32Array(quadWorld.array) },
        u_viewDirectionProjectionInverse: { value: new Float32Array(viewProjectionInverse.array) }
      }
    });

    WebGLRendererUtilities.depthFunc(gl, TestFunction.LEQUAL);
    WebGLPacketUtilities.drawPacket(gl, skyboxPacketSetter);

    
    // Framebuffer

    WebGLFramebufferUtilities.blit(gl, fb, postFb,
      [0, 0, canvas.width, canvas.height],
      [0, 0, canvas.width, canvas.height],
      BufferMaskBit.COLOR_BUFFER_BIT,
      TextureMagFilter.LINEAR
    );
    
    WebGLFramebufferUtilities.unbindFramebuffer(gl);

    WebGLProgramUtilties.useProgram(gl, texGlProg);
    WebGLRendererUtilities.depthFunc(gl, TestFunction.LEQUAL);
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

      //console.log(eye.values);

      //const euler = EulerAngles.fromMatrix(new Matrix3(camera.getUpper33()));

      /*const viewVector = new Vector3([
        Math.cos(euler.yaw) * Math.cos(euler.pitch),
        Math.sin(euler.pitch),
        -Math.sin(euler.yaw) * Math.cos(euler.pitch)
      ]);

      const rightVector = viewVector.clone().cross(new Vector3([0, 1, 0]));
      const upVector = viewVector.clone().cross(rightVector);

      const quaternion = new Quaternion([viewVector.x, viewVector.y, viewVector.z, 0]);*/

      
      
      const eye = new Vector3([camera.m41, camera.m42, camera.m43]);
      const radius = eye.clone().sub(target);

      const cameraRight = new Vector3([camera.m11, camera.m12, camera.m13]).normalize();

      const quat = Quaternion.fromMatrix(new Matrix3(camera.getUpper33())).normalize();
      const xRot = new Quaternion().setFromAxisAngle(cameraRight, angleX);
      const yRot = new Quaternion().setFromAxisAngle(Space.up, angleY);

      const newQuat = yRot.clone().mult(xRot.clone().mult(quat).mult(xRot.clone().conjugate())).mult(yRot.clone().conjugate());
      const newPosition = yRot.clone().mult(xRot.clone().mult(Quaternion.fromVector(eye)).mult(xRot.clone().conjugate())).mult(yRot.clone().conjugate()).toVector();

      const newMat = newQuat.toMatrix();

      camera.m41 = newPosition.x;
      camera.m42 = newPosition.y;
      camera.m43 = newPosition.z;

      camera.m41 = newPosition.x;
      camera.m42 = newPosition.y;
      camera.m43 = newPosition.z;

      camera.m41 = newPosition.x;
      camera.m42 = newPosition.y;
      camera.m43 = newPosition.z;

      //camera.lookAt(newPosition, target, up);

      /*const cameraRight = new Vector3([camera.m11, camera.m12, camera.m13]).normalize();
      const cameraUp = new Vector3([camera.m21, camera.m22, camera.m23]).normalize();

      const rotatedX = new Matrix4().setIdentity().rotateAxis(cameraUp, -angleX);
      const rotatedY = new Matrix4().setIdentity().rotateAxis(cameraRight, -angleY);

      camera.copy(
        Matrix4.translation(
          radius.clone().negate()
        ).mult(
          rotatedX
        ).mult(
          rotatedY
        ).mult(
          Matrix4.translation(
            target.clone().negate()
          )
        )
      );
      
      //camera.lookAt(viewVector, target, upVector);

      /*const cameraRight = new Vector3([camera.m11, camera.m12, camera.m13]);
      const cameraUp = new Vector3([camera.m21, camera.m22, camera.m23]);

      eye.copy(
        Vector3.mult(
          new Matrix3(new Matrix4().setIdentity().rotateAxis(cameraUp, angleX).getUpper33()),
          eye.clone().sub(target)
        ).add(target)
      );

      eye.copy(
        Vector3.mult(
          new Matrix3(new Matrix4().setIdentity().rotateAxis(cameraRight, angleY).getUpper33()),
          eye.clone().sub(target)
        ).add(target)
      );
      
      camera.lookAt(eye, target, up);*/

      lastPos.copy(newPos);
    }
  }
}