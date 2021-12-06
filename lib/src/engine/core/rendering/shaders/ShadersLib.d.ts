import { PhongShader } from "./lib/PhongShader";
export { ShadersLib };
declare const ShadersLib: Readonly<{
    shaders: {
        Phong: typeof PhongShader;
    };
    chunks: Map<string, string>;
}>;
