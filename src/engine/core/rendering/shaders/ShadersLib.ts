import { PhongShader } from "./lib/PhongShader";

export { ShadersLib };

const ShadersLib = Object.freeze({

    shaders: {
        Phong: PhongShader
    },

    chunks: new Map<string, string>([
        ['empty', 'empty.glsl'],
    ])
});