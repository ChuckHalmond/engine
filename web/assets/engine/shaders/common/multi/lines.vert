#version 300 es

#extension GL_ANGLE_multi_draw : require

#define MAX_INSTANCE_COUNT 640

in vec4 a_position;

flat out vec3 v_color;

uniform viewBlock {
  mat4 u_view;
  mat4 u_projection;
};

struct BasicModelInstance {
  mat4 u_model;
  vec3 u_color;
};

uniform basicModelBlock {
  BasicModelInstance instances[MAX_INSTANCE_COUNT];
};

void main() {
  // see Uniform Block to StructuredBuffer Translation in chrome
  mat4 model = instances[gl_InstanceID].u_model;
  vec3 color = instances[gl_InstanceID].u_color;
  gl_Position = u_projection * u_view * model * a_position;
  v_color = color;
}