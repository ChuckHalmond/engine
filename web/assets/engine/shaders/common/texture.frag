#version 300 es

precision highp float;

in vec2 v_uv;

uniform sampler2D u_tex;

out vec4 o_outColor;

void main() {
  o_outColor = texture(u_tex, v_uv);
}