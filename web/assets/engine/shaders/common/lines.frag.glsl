#version 300 es

precision mediump float;

out vec4 o_outColor;

uniform linesBlock {
  vec3 u_color;
};

void main() {
  o_outColor = vec4(u_color, 1.0);
}