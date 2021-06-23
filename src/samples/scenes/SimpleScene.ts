import { Transform } from "engine/core/general/Transform";
import { HotKey, Input, Key, KeyModifier, MouseButton } from "engine/core/input/Input";
import { PerspectiveCamera } from "engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { CubeGeometry } from "engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { IcosahedronGeometry } from "engine/core/rendering/scenes/geometries/lib/polyhedron/IcosahedronGeometry";
import { QuadGeometry } from "engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { TextureWrapMode, TextureMagFilter, TextureMinFilter, BufferDataUsage, Capabilities, BufferMaskBit, TestFunction, FramebufferTarget, FramebufferAttachment, FramebufferTextureTarget, PixelFormat, PixelType, RenderbufferTarget, Parameter } from "engine/core/rendering/webgl/WebGLConstants";
import { WebGLFramebufferUtilities } from "engine/core/rendering/webgl/WebGLFramebufferUtilities";
import { WebGLPacketUtilities, Packet } from "engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilties } from "engine/core/rendering/webgl/WebGLProgramUtilities";
import { WebGLRenderbufferUtilities } from "engine/core/rendering/webgl/WebGLRenderbuffersUtilities";
import { WebGLRendererUtilities } from "engine/core/rendering/webgl/WebGLRendererUtilities";
import { WebGLTextureUtilities } from "engine/core/rendering/webgl/WebGLTextureUtilities";
import { HTMLEMenubarTemplate } from "engine/editor/templates/menus/MenubarTemplate";
import { editor } from "engine/editor/Editor";
import { FormState, getFormState, setFormState } from "engine/editor/elements/forms/Snippets";
import { HTMLElementTemplate } from "engine/editor/elements/HTMLElement";
import { ButtonStateElement } from "engine/editor/elements/lib/containers/buttons/ButtonState";
import { StatefulButtonElement } from "engine/editor/elements/lib/containers/buttons/StatefulButton";
import { HTMLEMenuElement } from "engine/editor/elements/lib/containers/menus/Menu";
import { HTMLEMenuBarElement } from "engine/editor/elements/lib/containers/menus/MenuBar";
import { HTMLEMenuItemElement } from "engine/editor/elements/lib/containers/menus/MenuItem";
import { PanelElement } from "engine/editor/elements/lib/containers/panels/Panel";
import { PanelGroupElement } from "engine/editor/elements/lib/containers/panels/PanelGroup";
import { TabElement } from "engine/editor/elements/lib/containers/tabs/Tab";
import { TabListElement } from "engine/editor/elements/lib/containers/tabs/TabList";
import { TabPanelElement } from "engine/editor/elements/lib/containers/tabs/TabPanel";
import { RangeElement } from "engine/editor/elements/lib/controls/Range";
import { ImportElement } from "engine/editor/elements/lib/utils/Import";
import { handleTabIndexes } from "engine/editor/elements/Snippets";
import { Color } from "engine/libs/graphics/colors/Color";
import { Matrix4 } from "engine/libs/maths/algebra/matrices/Matrix4";
import { Vector2 } from "engine/libs/maths/algebra/vectors/Vector2";
import { Vector3 } from "engine/libs/maths/algebra/vectors/Vector3";
import { clamp } from "engine/libs/maths/Snippets";
import { Command } from "engine/libs/patterns/commands/Command";
//import { Event } from "engine/libs/patterns/messaging/events/EventDispatcher";
import { Resources } from "engine/resources/Resources";
import { HTMLFormTemplate } from "engine/editor/templates/form/FormTemplate";
import { HTMLTableTemplate } from "engine/editor/templates/table/TableTemplate";
import { HTMLEStatusBarElement } from "engine/editor/elements/lib/containers/status/StatusBar";
import { HTMLEDropdownElement } from "engine/editor/elements/lib/containers/dropdown/Dropdown";
import { formatDiagnostic } from "typescript";
import { HTMLEStatusItemElement } from "engine/editor/elements/lib/containers/status/StatusItem";
import { HTMLEMenuItemTemplate } from "engine/editor/templates/menus/MenuItemTemplate";
import { HTMLEMenuItemGroupElement } from "engine/editor/elements/lib/containers/menus/MenuItemGroup";
import { HTMLEMenuButtonElement } from "engine/editor/elements/lib/containers/menus/MenuButton";
import { PaletteElement } from "engine/editor/elements/lib/misc/Palette";
import { HTMLEBreadcrumbTrailElement } from "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbTrail";
import { HTMLEBreadcrumbItemElement } from "engine/editor/elements/lib/controls/breadcrumb/BreadcrumbItem";
import { HTMLEDraggableElement } from "engine/editor/elements/lib/controls/draganddrop/Draggable";
import { HTMLEDropzoneElement } from "engine/editor/elements/lib/controls/draganddrop/Dropzone";


HTMLEMenuButtonElement;
HTMLEStatusBarElement;
HTMLEStatusItemElement;
ImportElement;

HTMLEMenuBarElement;
HTMLEMenuElement;
HTMLEMenuItemElement;

PanelElement;
PanelGroupElement;

TabElement;
TabListElement;
TabPanelElement;

RangeElement;

StatefulButtonElement;
ButtonStateElement;

HTMLEDropdownElement;
HTMLEBreadcrumbTrailElement;
HTMLEBreadcrumbItemElement;
PaletteElement;

HTMLEDraggableElement;
HTMLEDropzoneElement;

const simpleSceneDOM = /*template*/`
<link rel="stylesheet" href="../css/main.css"/>
  <div>

    <div class="flex-rows">

      <e-import src="html/samples/menus.html"></e-import>
      <nav class="flex-cols">
          <div id="menubar-container"></div>
        <!--<button data-command="get">get</button>
        <button data-command="set">set</button>-->
      </nav>

      <div class="flex-auto flex-cols">

        <!--<e-window title="My window">-->
<!--

        </e-window>-->

        <e-panel id="panel-1" class="flex-rows flex-none" state="opened" label="L.Panel">

            <e-tab-list id="list">
              <e-tab name="play" controls="play-panel">Play tab</e-tab>
              <e-tab name="pause" controls="pause-panel" active>Pause Tab</e-tab>
            </e-tab-list>
            <e-tab-panel id="play-panel">assets/editor/icons/play.svg</e-tab-panel>
            <e-tab-panel id="pause-panel">
              <!--<e-palette cols="5" colors='[
                "var(--theme-color-50)",
                "var(--theme-color-100)",
                "var(--theme-color-200)",
                "var(--theme-color-300)",
                "var(--theme-color-400)",
                "var(--theme-color-500)",
                "var(--theme-color-600)",
                "var(--theme-color-700)",
                "var(--theme-color-800)",
                "var(--theme-color-900)",
                "var(--theme-palette-color-1)",
                "var(--theme-palette-color-2)",
                "var(--theme-palette-color-3)"
              ]'></e-palette>-->
              <e-breadcrumbtrail>
                <e-breadcrumbitem label="label 1"></e-breadcrumbitem>
                <e-breadcrumbitem label="label 2"></e-breadcrumbitem>
              </e-breadcrumbtrail>
              <e-draggable id="draggableA" tabindex="-1" type="A">A</e-draggable>
              <e-draggable id="draggableB" tabindex="-1" type="B">B</e-draggable>
              <e-draggable tabindex="-1" type="C">B bis</e-draggable>
              <e-dropzone id="dropzone1" tabindex="-1" allowedtypes="A">1</e-dropzone>
              <e-dropzone tabindex="-1">2</e-dropzone>
            </e-tab-panel>

            <section>
              <form id="test-form" novalidate>
                <input name="number-input" type="number" value="10"></input><br/>
                <input type="text" name="text-input"  value="Test"></input><br/>
                <select>
                  <option>Kek</option>
                  <option>Kikou</option>
                </select>
                <input type="range" name="range-input" min="10" max="20" step="5"></input>
                <progress id="file" max="100" value="70"> 70% </progress>
                <br/>
                <input type="radio" name="temp-radio" value="1"></input>
                <input type="radio" name="temp-radio" value="2"></input><br/>
                <textarea name="textarea-input">This is my tyext area.</textarea>
                <a href="#">Follow this link</a>
              </form>
              <e-dropdown>
                <button slot="button">My button</button>
                <div slot="content">
                  <ul>
                    <li>1</li>
                    <li>2</li>
                  </ul>
                  <input id="range" type="range" min="10" max="20" step="5"></input>
                </div>
              </e-dropdown>

              <button data-button-role="dropdown" data-button-dropdown-target="dropdown">My button</button>
              <div slot="content">
                <ul>
                  <li>1</li>
                  <li>2</li>
                </ul>
                <input id="range" type="range" min="10" max="20" step="5"></input>
              </div>
              <!--<details>
                <summary>Sum</summary>
                <p>Requires a computer running an operating system.</p>
              </details>-->
            </section>
        </e-panel>

        <main class="flex-rows flex-auto">
            <header class="centered">Toolbar</header>
            <section class="centered padded">
    
              <div id="ui" class="flex-cols">
                <div class="flex-auto"><span class="blue">"RigidBuddy FTW!"</span> <span class="yellow">:-)</span></div>
                <div class="flex-none">FPS: <span id="canvas-fps">-.-</span></div>
              </div>

              <canvas id="canvas" tabindex="0" tooltip="mon-canvas"></canvas>
              <e-logs-feed></e-logs-feed>

            </section>

            <footer class="centered">
              <p id="status-bar"></p>
            </footer>
        </main>
        
        <e-panel id="panel-3" class="flex-rows flex-none" style="margin-left: 6px;" state="closed" label="R.Panel">
            <section>
              <e-panel-group label="My group" state="closed">
                <div>My content</div>
              </e-panel-group>
            </section>
        </e-panel>
      </div>

      <e-statusbar>
        <e-statusitem name="show-fps-status"></e-statusitem>
        <e-statusitem name="letter-status"></e-statusitem>
        <!--<output>125</output>
        <output>Kek</output>
        <button id="play" data-lol="" data-kek="kek">Play</button>
        <button id="pause" data-command-lol="pause-canvas">Pause</button>
        <progress max="100" value="100" style="height: 100%">100%</progress>-->
        <!--<e-dropdown class="statusbar-dropdown">
          <button slot="button">My button</button>
          <div slot="content">
            <ul>
              <li>1</li>
              <li>2</li>
            </ul>
            <input id="range" type="range" min="10" max="20" step="5"></input>
          </div>
        </e-dropdown>-->
      </e-statusbar>
    </div>
  </div>`;

(window as {[key: string]: any})["editor"] = editor;

export async function start() {

  const template = document.createElement('template');

  template.innerHTML = simpleSceneDOM;
  document.body.insertBefore(template.content, document.body.firstChild);

  const imports = Array.from(document.getElementsByTagName('e-import'));
  Promise.all(imports.map((imp) => {
    return new Promise((resolve) => {
      imp.addEventListener('loaded', () => {
        resolve(true);
      }, {once: true});
    })
  })).then(function(){ 
    editor.setup().then(() => {
      //handleTabIndexes();

      //test();
      
      launchScene();
    });
  });
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

  editor.registerCommand("play-canvas", {
    exec(): void {
      cancelAnimationFrame(frameRequest);
      frameRequest = requestAnimationFrame(render);
      canvas.focus();
    },
    context: 'default'
  });

  editor.registerCommand("pause-canvas", {
    exec(): void {
      cancelAnimationFrame(frameRequest);
      canvas.focus();
    },
    context: 'default'
  });
  
  const showFpsMenuItem = editor.menubar?.findItem((item) => item.name === "show-fps-item");
  const canvasFPS = document.getElementById("canvas-fps");

  if (showFpsMenuItem) {
    showFpsMenuItem.command = "toggle-show-fps";
    editor.addStateListener("show-fps", (showFps) => {
      showFpsMenuItem.checked = showFps;
    });
  }

  if (canvasFPS) {
    editor.registerCommand('toggle-show-fps', {
      exec(): void {
        editor.setState("show-fps", true);
        canvasFPS.parentElement!.classList.remove('hidden');
      },
      undo(): void {
        editor.setState("show-fps", false);
        canvasFPS.parentElement!.classList.add('hidden');
      },
      context: 'default'
    });
  }

  const showFpsStatusItem = editor.statusbar?.findItem((item) => item.name === "show-fps-status");

  if (showFpsStatusItem) {
    showFpsStatusItem.stateMap = (showFps: boolean) => {
      return {
        content: `${showFps ? "FPS" : "--"}`
      };
    };
    //showFpsStatusItem.update(editor.getState("show-fps"));
    editor.addStateListener("show-fps", (showFps) => {
      showFpsStatusItem.update(showFps);
    });
    showFpsStatusItem.command = "toggle-show-fps";
  }


  editor.registerCommand('change-favorite-letter', {
    exec(value: string): void {
      editor.setState("favorite-letter", value);
    },
    undo(value: string): void {
    },
    context: 'default'
  });

  const radiosGroup = document.querySelector<HTMLEMenuItemGroupElement>("e-menuitemgroup[name='favorite-letter']");
  if (radiosGroup) {
    editor.addStateListener("favorite-letter", (favoriteLetter: string) => {
      let radioToCheck = radiosGroup.items.find(
        (item) => item.type === "radio" && item.value === favoriteLetter
      );
      if (radioToCheck) {
        radioToCheck.checked = true;
      }
    });

    radiosGroup.items.filter(item => item.type === "radio").forEach((item) => {
      item.command = "change-favorite-letter";
      item.commandArgs = item.value;
    });
  }

  const letterStatus = editor.statusbar?.findItem((item) => item.name === "letter-status");

  if (letterStatus) {
    letterStatus.stateMap = (letter: string) => {
      return {
        content: `U like ${letter.toUpperCase()}`
      };
    };
    //letterStatus.update(editor.getState("favorite-letter"));
    editor.addStateListener("favorite-letter", (favoriteLetter: string) => {
      letterStatus.update(favoriteLetter);
    });
  }

  await editor.reloadState();

  /*const showFPSAction = (showFPS: boolean) => {
    if (showFPS) {
      canvasFPS.parentElement!.classList.remove('hidden');
    }
    else {
      canvasFPS.parentElement!.classList.add('hidden');
    }
  };*/

  /*showFPSAction(showFpsCheckbox.checked);

  if (showFpsCheckbox && canvasFPS) {
    showFpsCheckbox.addEventListener('click', () => {
      showFPSAction(showFpsCheckbox.checked);
    });
  }*/




  const dropzone1 = document.querySelector<HTMLEDropzoneElement>("e-dropzone#dropzone1");
  dropzone1?.addEventListener("datatransfer", ((event: CustomEvent<{data: any, success: boolean}>) => {
    console.log(event.detail.data);
    console.log(event.detail.success);
  }) as EventListener);

  const draggableA = document.querySelector<HTMLEDraggableElement>("e-draggable#draggableA");
  if (draggableA) {
    draggableA.data = "A";
  }

  const draggableB = document.querySelector<HTMLEDraggableElement>("e-draggable#draggableB");
  if (draggableB) {
    draggableB.data = "B";
  }




















  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  if (!canvas) {
    return;
  }
  
  canvas.width = 1200;
  canvas.height = 800;
  
  
  const gl = canvas.getContext('webgl2', {antialias: true})!;

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

  const cam = new PerspectiveCamera(fov, aspect, zNear, zFar);

  const eye: Vector3 = new Vector3([3, 3, 0]);
  const target: Vector3 = new Vector3([0, 0, 0]);
  const up: Vector3 = new Vector3([0, 1, 0]);
  const camera = new Matrix4().lookAt(eye, target, up);

  const viewInverse = camera.clone();
  const view = camera.clone().invert();
  const viewProjection = projection.clone().mult(view);
  const viewProjectionInverse = viewProjection.clone().invert();

  const cubeTransform = new Transform();
  const quadTransform = new Transform();
  
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

  let lastPos: Vector2 = new Vector2();
  await Input.initialize(canvas);

  render = function(frameTime: number) {
    
    frameTime *= 0.001;

    deltaTime = frameTime - lastFrameTime;
    lastFrameTime = frameTime;
    fps = 1 / deltaTime;

    canvasFPS!.innerHTML = fps.toFixed(2);
    
    WebGLRendererUtilities.clearColor(gl, Color.GREEN.valuesNormalized());
    WebGLRendererUtilities.clear(gl, BufferMaskBit.COLOR_BUFFER_BIT | BufferMaskBit.DEPTH_BUFFER_BIT);

    if (Input.getMouseButtonDown(MouseButton.RIGHT)) {
      lastPos.copy(Input.getMouseButtonPosition());
    }
    
    if (Input.getMouseButton(MouseButton.RIGHT)) {
      const newPos = Input.getMouseButtonPosition();
      
      if (!newPos.equals(lastPos)) {

        const cameraPos = new Vector3().setValues([camera.getAt(12), camera.getAt(13), camera.getAt(14)]);

        //console.log(`cameraPos ${cameraPos.x.toFixed(4)} ${cameraPos.y.toFixed(4)} ${cameraPos.z.toFixed(4)}`);

        const cameraTarget = target.clone();

        const deltaX = lastPos.y - newPos.y;
        const deltaY = newPos.x - lastPos.x;

        const deltaPhi = (Math.PI / canvas.clientWidth) * deltaX * 1000;
        const deltaTheta = (Math.PI / canvas.clientHeight) * deltaY * 1000;

        const cameraToTarget = cameraPos.clone().sub(cameraTarget);
        const radius = cameraToTarget.len();

        //console.log(`cameraToTarget ${cameraToTarget.x.toFixed(4)} ${cameraToTarget.y.toFixed(4)} ${cameraToTarget.z.toFixed(4)}`);
        
        let theta = Math.acos(cameraToTarget.z / radius);
        let phi = Math.atan2(cameraToTarget.y, cameraToTarget.x);

        theta = clamp(theta - deltaTheta, 0, Math.PI);
        phi -= deltaPhi;

        //console.log(`theta ${theta.toFixed(4)} phi ${phi.toFixed(4)}`);
      
        // Turn back into Cartesian coordinates
        const newCameraPos = new Vector3(
          [
            radius * Math.sin(theta) * Math.cos(phi),
            radius * Math.sin(theta) * Math.sin(phi),
            radius * Math.cos(theta)
          ]
        );
        
        camera.setAt(12, newCameraPos.x);
        camera.setAt(13, newCameraPos.y);
        camera.setAt(14, newCameraPos.z);

        //console.log(`newCameraPos ${newCameraPos.x.toFixed(4)} ${newCameraPos.y.toFixed(4)} ${newCameraPos.z.toFixed(4)}`);
        
        camera.lookAt(newCameraPos, target, up);
        
        lastPos.copy(newPos);
      }
    }
    
    viewInverse.copy(camera);
    view.copy(viewInverse).invert();
    viewProjection.copy(projection).mult(view);
    viewProjectionInverse.copy(viewProjection).invert();

    //cubeWorld.rotateY(deltaTime);
    //viewProjectionInverse.rotateY(deltaTime / 2);
    //viewProjectionInverse.rotateX(deltaTime);

    WebGLFramebufferUtilities.bindFramebuffer(gl, fb);
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

    
    
    //WebGLFramebufferUtilities.unbindFramebuffer(gl, stencilFb);

    WebGLFramebufferUtilities.blit(gl, fb, postFb,
      [0, 0, canvas.width, canvas.height],
      [0, 0, canvas.width, canvas.height],
      BufferMaskBit.COLOR_BUFFER_BIT,
      TextureMagFilter.LINEAR
    );
    //WebGLFramebufferUtilities.clearColor(gl, fb, [1, 1, 1, 1]);
    
    WebGLFramebufferUtilities.unbindFramebuffer(gl);



    /*WebGLFramebufferUtilities.blit(gl, postFb, null,
      [0, 0, canvas.width, canvas.height],
      [0, 0, canvas.width, canvas.height],
      BufferMaskBit.COLOR_BUFFER_BIT,
      TextureMagFilter.LINEAR
    );*/
    //WebGLFramebufferUtilities.clearColor(gl, postFb, [1, 1, 1, 1]);

    WebGLProgramUtilties.useProgram(gl, texGlProg);
    WebGLRendererUtilities.depthFunc(gl, TestFunction.LEQUAL);
    WebGLPacketUtilities.drawPacket(gl, texPacketSetter);

    Input.clear();

    frameRequest = requestAnimationFrame(render);
  }
}
