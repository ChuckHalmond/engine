#version 300 es

precision highp float;

flat in vec3 v_color;

out vec4 o_outColor;

void main() {
  vec3 color = v_color;
  o_outColor = vec4(color, 1.0);
}