#version 300 es

#extension GL_ANGLE_multi_draw : require

#define MAX_INSTANCE_COUNT 640

in vec4 a_position;
in vec3 a_color;

out vec3 v_color;
out vec3 v_position;

uniform viewBlock {
  mat4 u_model;
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
  //#ifdef PER_VERTEX_COLOR
    v_color = length(color) == 0.0 ? a_color : color;
  /*#else
    v_color = instances[gl_InstanceID].u_color;
  #endif*/
  vec4 position = u_projection * u_view * model * a_position;
  gl_Position = position;
  v_position = (model * a_position).xyz;
}
