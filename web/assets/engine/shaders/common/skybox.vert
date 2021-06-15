#version 300 es

in vec4 a_position;

uniform mat4 u_world;

out vec4 v_position;

void main() {
  vec4 position = u_world * a_position;
  v_position = position;
  gl_Position = vec4(position.xy, 1, 1);
}