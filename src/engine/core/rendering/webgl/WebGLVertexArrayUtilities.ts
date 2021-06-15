export { WebGLVertexArrayUtilities };

class WebGLVertexArrayUtilities {

    private constructor() {}

    public static createVertexArray(gl: WebGL2RenderingContext): WebGLBuffer | null {
        const glVao = gl.createVertexArray();

        if (glVao === null) {
            console.error('Could not create WebGLVertexArrayObject.');
        }

        return glVao;
    }
}