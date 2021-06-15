export { WebGLBufferUtilities };

class WebGLBufferUtilities {

    public static createBuffer(gl: WebGL2RenderingContext): WebGLBuffer | null {
        const glBuff = gl.createBuffer();

        if (glBuff == null) {
            console.error('Could not create WebGLBuffer.');
        }

        return glBuff;
    }
}