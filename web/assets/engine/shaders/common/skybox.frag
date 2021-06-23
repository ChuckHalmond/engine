#version 300 es

precision highp float;

in vec4 v_position;

uniform samplerCube u_skybox;

uniform mat4 u_viewDirectionProjectionInverse;

out vec4 outColor;

void main() {
  vec4 t = u_viewDirectionProjectionInverse * v_position;
  outColor = texture(u_skybox, normalize(t.xyz / t.w));
}