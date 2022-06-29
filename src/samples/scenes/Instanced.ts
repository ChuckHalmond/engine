import { BufferDataUsage } from "../../engine/core/rendering/webgl/WebGLBufferUtilities";
import { Packet, PacketProperties, WebGLPacketUtilities } from "../../engine/core/rendering/webgl/WebGLPacketUtilities";
import { WebGLProgramUtilities } from "../../engine/core/rendering/webgl/WebGLProgramUtilities";
import { BufferMask, Capabilities, WindingOrder, WebGLRendererUtilities } from "../../engine/core/rendering/webgl/WebGLRendererUtilities";
import { AttributeDataType, DrawMode } from "../../engine/core/rendering/webgl/WebGLVertexArrayUtilities";

function glsl(strings: TemplateStringsArray, ...args: any[]): string {
    const strs = Array.from(strings);
    if (strs.length > 0) {
        strs[0] = strs[0].trimStart();
    }
    return strs.join("");
}

export async function instanced() {
    const canvas = document.createElement("canvas");
    document.body.append(canvas);
    scene(canvas);
}

function scene(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext("webgl2");
    if (!gl) {
        console.error("webgl2 not available.");
        return;
    }

    gl.canvas.width = 600;
    gl.canvas.height = 600;

    const program = WebGLProgramUtilities.createProgram(gl, 
        glsl`
            #version 300 es

            in vec3 a_position;
            in vec3 a_color;

            in vec3 a_translation;
            
            out vec4 v_color;

            #define MAX_ALPHA 64

            struct Data {
                vec3 rgb;
            };

            uniform commonBlock {
                Data my_data [MAX_ALPHA];
            };
            
            void main() {
                v_color = vec4(my_data[gl_InstanceID].rgb, 1);
                gl_Position = vec4(a_position + a_translation, 1.0);
            }
        `,
        glsl`
            #version 300 es

            precision mediump float;
            
            in vec4 v_color;
            
            out vec4 outColor;
            
            void main() {
                outColor = v_color;
            }
        `
    );

    if (program == null) {
        console.error("program null.");
        return;
    }

    const bindings = WebGLPacketUtilities.createBindings(gl, {
        program: program,
        uniformBlocks: ["commonBlock"]
    });
    if (bindings == null) {
        console.error("bindings null.");
        return;
    }

    const packetProperties: PacketProperties = {
        vertexArray: {
            attributes: {
                a_translation: {
                    array: new Float32Array([
                        0, 0, 0,
                        0.5, 0.5, 0.5,
                    ]),
                    divisor: 1,
                    type: AttributeDataType.VEC3
                },
                a_position: {
                    array: new Float32Array([
                        -0.5, 0, 0,
                        0, 0.5, 0,
                        0, 0, 0
                    ]),
                    type: AttributeDataType.VEC3
                },
                a_color: {
                    array: new Float32Array([
                        255, 0, 0,
                        0, 255, 0,
                        255, 0, 0
                    ]),
                    type: AttributeDataType.VEC3,
                    normalize: true
                },
                /*a_position: {
                    array: {
                        byteLength: numElements * numComponents * Float32Array.BYTES_PER_ELEMENT,
                        dataType: DataType.FLOAT
                    },
                    stride: numComponents * Float32Array.BYTES_PER_ELEMENT * 2,
                    numComponents: numComponents,
                },
                a_color: {
                    array: {
                        byteLength: numElements * numComponents * Float32Array.BYTES_PER_ELEMENT,
                        dataType: DataType.FLOAT
                    },
                    offset: numComponents * Float32Array.BYTES_PER_ELEMENT,
                    numComponents: numComponents,
                    stride: numComponents * Float32Array.BYTES_PER_ELEMENT * 2,
                    normalize: true
                }*/
            },
            elementsCount: 3
        },
        uniformBlocks: [
            {
                block: bindings.uniformBlocks.commonBlock,
                uniforms: {
                    my_data: {
                        value: new Float32Array([1, 0, 0, 0, 0, 1, 0, 0]),
                    }
                }
            }
        ],
        options: {
            drawMode: DrawMode.TRIANGLES,
            instanceCount: 2
        }
    };
    
    WebGLRendererUtilities.frontFace(gl, WindingOrder.CW);
    WebGLRendererUtilities.viewport(gl, 0, 0, gl.canvas.width, gl.canvas.height);
    WebGLRendererUtilities.enable(gl, Capabilities.CULL_FACE);

    const packet = WebGLPacketUtilities.createPacket(gl, program, packetProperties);
    if (packet == null) {
        console.error("packet null.");
        return;
    }

    function render() {
        WebGLRendererUtilities.clear(gl!, BufferMask.COLOR_BUFFER_BIT);
        WebGLPacketUtilities.drawPacket(gl!, packet!);
        requestAnimationFrame(render);
    }

    render();
}