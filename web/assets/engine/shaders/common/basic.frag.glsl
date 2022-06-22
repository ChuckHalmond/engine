#version 300 es

precision highp float;

uniform basicBlock {
    mat4 u_model;
    mat4 u_viewProjection;
    vec3 u_color;
};

out vec4 o_outColor;

void main() {
  o_outColor = vec4(u_color, 1.0);
}