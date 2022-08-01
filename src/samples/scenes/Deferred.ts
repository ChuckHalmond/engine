import { ArcballCameraControl } from "../../engine/core/controls/ArcballCameraControl";
import { FreeCameraControl } from "../../engine/core/controls/FreeCameraControl";
import { Transform } from "../../engine/core/general/Transform";
import { Input } from "../../engine/core/input/Input";
import { PerspectiveCamera } from "../../engine/core/rendering/scenes/cameras/PerspectiveCamera";
import { CubeGeometry } from "../../engine/core/rendering/scenes/geometries/lib/polyhedron/CubeGeometry";
import { QuadGeometry } from "../../engine/core/rendering/scenes/geometries/lib/QuadGeometry";
import { DrawBuffer, FramebufferAttachment, FramebufferTextureTarget, WebGLFramebufferUtilities } from "../../engine/core/rendering/webgl/WebGLFramebufferUtilities";
import { WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BlendingMode, BufferMask, Capabilities, TestFunction, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { TextureInternalPixelFormat, TextureMagFilter, TextureMinFilter, TexturePixelFormat, TexturePixelType, TextureTarget, TextureWrapMode } from "../../engine/core/rendering/webgl/WebGLTextureUtilities";
import { AttributeDataType, DrawMode, WebGLVertexArrayUtilities } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";
import { Color } from "../../engine/libs/graphics/colors/Color";
import { Matrix4 } from "../../engine/libs/maths/algebra/matrices/Matrix4";
import { Vector3 } from "../../engine/libs/maths/algebra/vectors/Vector3";
import { Space } from "../../engine/libs/maths/geometry/space/Space";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 500;

export async function deferred() {
    const canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.tabIndex = 0;
    canvas.oncontextmenu = () => {
        return false;
    };
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    const gl = canvas.getContext("webgl2");
    if (gl == null) {
        return;
    }

    WebGLPacketUtilities.enableMultidrawExtension(gl);
    gl.getExtension('OES_texture_float_linear');
    gl.getExtension('EXT_color_buffer_float');

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

    const textures = WebGLPacketUtilities.createTextures(gl, {
        normalMap: {
            pixels: null,
            width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
            target: TextureTarget.TEXTURE_2D,
            type: TexturePixelType.FLOAT,
            format: TexturePixelFormat.RGBA,
            internalFormat: TextureInternalPixelFormat.RGBA16F,
            mag: TextureMagFilter.LINEAR,
            min: TextureMinFilter.LINEAR,
            wrapS: TextureWrapMode.CLAMP_TO_EDGE,
            wrapT: TextureWrapMode.CLAMP_TO_EDGE,
            wrapR: TextureWrapMode.CLAMP_TO_EDGE,
        },
        positionMap: {
            pixels: null,
            width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
            target: TextureTarget.TEXTURE_2D,
            type: TexturePixelType.FLOAT,
            format: TexturePixelFormat.RGBA,
            internalFormat: TextureInternalPixelFormat.RGBA16F,
            mag: TextureMagFilter.LINEAR,
            min: TextureMinFilter.LINEAR,
            wrapS: TextureWrapMode.CLAMP_TO_EDGE,
            wrapT: TextureWrapMode.CLAMP_TO_EDGE,
            wrapR: TextureWrapMode.CLAMP_TO_EDGE,
        },
        colorMap: {
            pixels: null,
            width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
            target: TextureTarget.TEXTURE_2D,
            type: TexturePixelType.FLOAT,
            format: TexturePixelFormat.RGBA,
            internalFormat: TextureInternalPixelFormat.RGBA16F,
            mag: TextureMagFilter.LINEAR,
            min: TextureMinFilter.LINEAR,
            wrapS: TextureWrapMode.CLAMP_TO_EDGE,
            wrapT: TextureWrapMode.CLAMP_TO_EDGE,
            wrapR: TextureWrapMode.CLAMP_TO_EDGE,
        },
        depthTex: {
          width: CANVAS_WIDTH, height: CANVAS_HEIGHT,
          pixels: null,
          target: TextureTarget.TEXTURE_2D,
          type: TexturePixelType.UNSIGNED_SHORT,
          format: TexturePixelFormat.DEPTH_COMPONENT,
          internalFormat: TextureInternalPixelFormat.DEPTH_COMPONENT16,
          wrapS: TextureWrapMode.CLAMP_TO_EDGE,
          wrapT: TextureWrapMode.CLAMP_TO_EDGE,
          wrapR: TextureWrapMode.CLAMP_TO_EDGE,
          mag: TextureMagFilter.NEAREST,
          min: TextureMinFilter.NEAREST,
        }
    })!;
    
    const {normalMap, positionMap, colorMap, depthTex} = textures;

    document.body.append(playpause, canvas);

    const geometryVert = await fetch("assets/engine/shaders/common/deferred/geometry.vert").then(resp => resp.text());
    const geometryFrag = await fetch("assets/engine/shaders/common/deferred/geometry.frag").then(resp => resp.text());
    const geometryProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: geometryVert, fragmentSource: geometryFrag});
    if (geometryProgram === null) return;

    const finalVert = await fetch("assets/engine/shaders/common/deferred/final.vert").then(resp => resp.text());
    const finalFrag = await fetch("assets/engine/shaders/common/deferred/final.frag").then(resp => resp.text());
    const finalProgram = WebGLProgramUtilities.createProgram(gl, {vertexSource: finalVert, fragmentSource: finalFrag});
    if (finalProgram === null) return;

    const fov = (1 / 3) * Math.PI;
    const aspect = canvas.width / canvas.height;
    const zNear = 0.1;
    const zFar = 100;

    const camera = new PerspectiveCamera(fov, aspect, zNear, zFar);
    camera.transform.setTranslation(new Vector3([1, 0, 0]));
    const cameraControl = new FreeCameraControl(camera)
    
    const cubeTransform = new Transform();
    cubeTransform.setTranslation(camera.getFront(new Vector3()).scale(4));

    const cube2Transform = new Transform();
    cube2Transform.setTranslation(cubeTransform.getTranslation(new Vector3()).scale(2));

    const cubeGeometry = new CubeGeometry();
    const cubeGeometryBuilder = cubeGeometry.toBuilder();
    const cubeVerticesArray = cubeGeometryBuilder.verticesArray();
    const cubeNormalsArray = cubeGeometryBuilder.normalsArray();
    const cubeTrianglesIndicesArray = cubeGeometryBuilder.trianglesIndicesArray();

    const quadGeometry = new QuadGeometry({
        width: 2, height: 2
    });
    const quadWorld = new Matrix4().setIdentity();
    const quadGeometryBuilder = quadGeometry.toBuilder();
    const quadVerticesArray = quadGeometryBuilder.verticesArray();
    const quadUvsArray = quadGeometryBuilder.uvsArray();
    const quadTrianglesIndicesArray = quadGeometryBuilder.trianglesIndicesArray();
    
    const geometryPacket = WebGLPacketUtilities.createPacket(gl, {
        program: geometryProgram,
        vertexArray: {
            vertexAttributes: {
                a_position: { array: cubeVerticesArray, type: AttributeDataType.VEC3 },
                a_normal: { array: cubeNormalsArray, type: AttributeDataType.VEC3 }
            },
            elementIndices: cubeTrianglesIndicesArray
        },
        uniformBlocks: {
            basicModelBlock: {
                uniforms: {
                    "instances[0].u_model": { value: cubeTransform.array },
                    "instances[0].u_color": { value: [1, 0, 0] },
                    "instances[1].u_model": { value: cube2Transform.array },
                    "instances[1].u_color": { value: [0, 1, 0] },
                }
            },
            viewBlock: {
                uniforms: {
                    u_view: { value: camera.view.array },
                    u_projection: { value: camera.projection.array }
                }
            }
        },
        drawCommand: {
            mode: DrawMode.TRIANGLES,
            elementsCount: cubeTrianglesIndicesArray.length,
            instanceCount: 2
        }
    });
    if (geometryPacket === null) return;

    const gBuffer = WebGLFramebufferUtilities.createFramebuffer(gl)!;
    WebGLFramebufferUtilities.attachTexture(
        gl, gBuffer, 
        {
            textureTarget: FramebufferTextureTarget.TEXTURE_2D,
            texture: positionMap,
            attachment: FramebufferAttachment.COLOR_ATTACHMENT0,
        }, 
        {
            textureTarget: FramebufferTextureTarget.TEXTURE_2D,
            texture: normalMap,
            attachment: FramebufferAttachment.COLOR_ATTACHMENT1,
        }, 
        {
            textureTarget: FramebufferTextureTarget.TEXTURE_2D,
            texture: colorMap,
            attachment: FramebufferAttachment.COLOR_ATTACHMENT2,
        },
        {
            textureTarget: FramebufferTextureTarget.TEXTURE_2D,
            texture: depthTex,
            attachment: FramebufferAttachment.DEPTH_ATTACHMENT
        }
    );
    WebGLFramebufferUtilities.drawBuffers(gl, gBuffer, [
        DrawBuffer.COLOR_ATTACHMENT0, DrawBuffer.COLOR_ATTACHMENT1, DrawBuffer.COLOR_ATTACHMENT2
    ]);

    const finalPacket = WebGLPacketUtilities.createPacket(gl, {
        program: finalProgram,
        vertexArray: {
            vertexAttributes: {
                a_position: { array: quadVerticesArray, type: AttributeDataType.VEC3 },
                a_uv: { array: quadUvsArray, type: AttributeDataType.VEC3 },
            },
            elementIndices: quadTrianglesIndicesArray
        },
        uniforms: {
            u_world: { value: quadWorld.array },
            u_positionMap: { value: positionMap },
            u_normalMap: { value: normalMap },
            u_colorMap: { value: colorMap }
        },
        drawCommand: {
            mode: DrawMode.TRIANGLES,
            elementsCount: quadTrianglesIndicesArray.length
        }
    });
    if (finalPacket === null) return;

    WebGLRendererUtilities.viewport(gl, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);
    WebGLRendererUtilities.enable(gl, Capabilities.DEPTH_TEST);
    WebGLRendererUtilities.depthFunction(gl, TestFunction.LEQUAL);
    //WebGLRendererUtilities.disable(gl, Capabilities.BLEND);
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

        cameraControl.update(deltaTime);

        WebGLPacketUtilities.setPacketValues(gl, geometryPacket, {
            uniformBlocks: {
                viewBlock: {
                    uniforms: {
                        u_view: { value: camera.view.array },
                        u_projection: { value: camera.projection.array }
                    }
                }
            }
        });

        WebGLFramebufferUtilities.bindFramebuffer(gl, gBuffer);

        WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);

        WebGLPacketUtilities.drawPacket(gl, geometryPacket);

        WebGLFramebufferUtilities.unbindFramebuffer(gl);
        
        WebGLRendererUtilities.clear(gl, BufferMask.COLOR_BUFFER_BIT | BufferMask.DEPTH_BUFFER_BIT);

        WebGLPacketUtilities.drawPacket(gl, finalPacket);
        
        Input.clear();

        requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
}