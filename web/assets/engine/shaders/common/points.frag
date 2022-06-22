#version 300 es

in vec3 v_color;

out vec4 o_outColor;

void main() {
  o_outColor = vec4(v_color, 1.0);
}