import { Shader } from "../Shader";

export { PhongShader };

const name = 'Phong';

const vertex = /*glsl*/`#version 330 es
    uniform Model {
        uniform mat4 u_model;
        uniform mat4 u_modelInverseTranspose;
    } model;

    uniform View {
        uniform mat4 u_viewInverse;
    } view;

    uniform mat4 u_modelViewProjection;

    uniform mat4 u_viewInverse;

    #define LIGHTS_COUNT 1

    uniform Lights {
        vec3 u_lightWorldPos;
        vec4 u_lightColor;
    } lights[LIGHTS_COUNT];

    //in Geometry {
        in vec4 a_position;
        in vec3 a_normal;    
    //} geometry;

    out SurfacesToLights {
        vec3 v_surfaceToLight;
    } surfacesToLights;

    out vec4 v_position;
    out vec3 v_normal;
    out vec3 v_surfaceToLight[LIGHTS_COUNT];
    out vec3 v_surfaceToView;

    //include<empty>

    void main() {

        #ifdef USE_HEIGHTMAP
            lolcccc
            cdvdv
            kiii
            u_lightWorldPos = 'lol'
        #endif

        #pragma unroll_loop_start
        for (int i = 0; i < LIGHTS_COUNT; i++)
        {
            
        }
        #pragma unroll_loop_end

        //v_position = u_modelViewProjection * a_position;
        //v_normal = (u_modelInverseTranspose * vec4(a_normal, 0)).xyz;
        //v_surfaceToLight = u_lightWorldPos - (u_model * a_position).xyz;
        //v_surfaceToView = (u_viewInverse[3] - (u_model * a_position)).xyz;
        gl_Position = v_position;
}`;

const fragment = /*glsl*/`#version 330 es

    precision mediump float;

    uniform MeshBasicMaterial {
        uniform vec3 u_albedo;
        uniform vec4 u_ambient;
    } meshBasicMaterial;

    uniform MeshPhongMaterial {
        uniform vec4 u_specular;
        uniform float u_shininess;
        uniform float u_specularFactor;
    } meshPhongMaterial;

    in vec4 v_position;
    in vec3 v_normal;
    in vec3 v_color;
    in vec3 v_surfaceToLight;
    in vec3 v_surfaceToView;

    out vec4 outColor;

    vec4 lit(float l ,float h, float m) {
    return vec4(1.0,
                max(l, 0.0),
                (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
                1.0);
    }

    void main() {
        vec4 diffuseColor = vec4(u_albedo, 1);
        vec3 a_normal = normalize(v_normal);
        vec3 surfaceToLight = normalize(v_surfaceToLight);
        vec3 surfaceToView = normalize(v_surfaceToView);
        vec3 halfVector = normalize(surfaceToLight + surfaceToView);
        vec4 litR = lit(dot(a_normal, surfaceToLight),
                            dot(a_normal, halfVector), u_shininess);
        vec4 outColor = vec4((
        u_lightColor * (diffuseColor * litR.y + diffuseColor * u_ambient +
                        u_specular * litR.z * u_specularFactor)).rgb,
            diffuseColor.a);
}`;

class PhongShader extends Shader {

    constructor() {
        super({
            name: name,
            vertex: vertex,
            fragment: fragment
        });
    }
}