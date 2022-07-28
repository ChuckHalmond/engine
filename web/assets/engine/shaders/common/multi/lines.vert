#version 300 es

#extension GL_ANGLE_multi_draw : require

#define MAX_DRAW_COUNT 10
#define MAX_INSTANCE_COUNT 40

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

struct BasicModel {
  BasicModelInstance instances[MAX_INSTANCE_COUNT];
};

uniform basicModelBlock {
  BasicModel models[MAX_DRAW_COUNT];
};

void main() {
  BasicModelInstance basicModel = models[gl_DrawID].instances[gl_InstanceID];
  mat4 model = basicModel.u_model;
  vec3 color = basicModel.u_color;
  gl_Position = u_projection * u_view  * model * a_position;
  v_color = color;
}