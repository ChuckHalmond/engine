#version 300 es

#define MAX_INSTANCE_COUNT 10

in vec4 a_position;
in vec3 a_normal;

out vec3 v_position;
out vec3 v_normal;
out vec3 v_color;

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
  mat4 model = instances[gl_InstanceID].u_model;
  vec3 color = instances[gl_InstanceID].u_color;
  vec4 position = u_projection * u_view  * model * a_position;
  gl_Position = position;
  v_normal = a_normal;
  v_position = position.xyz;
  v_color = vec3(1.0, 0.0, 0.0);
}