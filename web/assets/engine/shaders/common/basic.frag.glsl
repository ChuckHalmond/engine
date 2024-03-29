#version 300 es

precision highp float;

uniform viewBlock {
  mat4 u_view;
  mat4 u_projection;
};

uniform basicModelBlock {
  mat4 u_model;
  vec3 u_color;
};

out vec4 o_outColor;

void main() {
  o_outColor = vec4(u_color, 1.0);
}