import { PixelFormat } from "engine/core/rendering/webgl/WebGLConstants";

export { WebGLRenderbufferUtilities };

type Renderbuffer = {
    glRb: WebGLRenderbuffer;
}

type RenderbufferProperties = {
    internalFormat: PixelFormat;
    width: number;
    height: number;
    samples?: number
}

class WebGLRenderbufferUtilities {

    private constructor() {}

    public static createRenderbuffer(gl: WebGL2RenderingContext, props: RenderbufferProperties): Renderbuffer | null {
        const glRb = gl.createRenderbuffer();
    
        if (glRb === null) {
            console.error('Could not create WebGLRenderbuffer.');
            return null;
        }

        gl.bindRenderbuffer(gl.RENDERBUFFER, glRb);

        if (typeof props.samples !== 'undefined') {
            gl.renderbufferStorageMultisample(gl.RENDERBUFFER, props.samples, props.internalFormat, props.width, props.height);
        }
        else {
            gl.renderbufferStorage(gl.RENDERBUFFER, props.internalFormat, props.width, props.height);
        }
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);

        return {
            ...props,
            glRb: glRb
        };
    }
}