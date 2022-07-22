#version 300 es

in vec4 a_position;
in vec2 a_uv;

out vec2 v_uv;

uniform mat4 u_depthWorld;

void main() {
  vec4 position = u_depthWorld * a_position;
  v_uv = a_uv;
  gl_Position = vec4(position.xy, 0, 1);
}