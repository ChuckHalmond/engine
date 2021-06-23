#version 300 es

in vec4 a_position;

uniform mat4 u_viewProjection;

void main() {
  vec4 positionViewSpace = u_viewProjection * a_position;
  gl_Position = positionViewSpace;
}