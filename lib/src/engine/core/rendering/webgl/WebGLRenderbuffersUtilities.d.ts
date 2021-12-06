import { PixelFormat } from "./WebGLConstants";
export { WebGLRenderbufferUtilities };
declare type Renderbuffer = {
    glRb: WebGLRenderbuffer;
};
declare type RenderbufferProperties = {
    internalFormat: PixelFormat;
    width: number;
    height: number;
    samples?: number;
};
declare class WebGLRenderbufferUtilities {
    private constructor();
    static createRenderbuffer(gl: WebGL2RenderingContext, props: RenderbufferProperties): Renderbuffer | null;
}
