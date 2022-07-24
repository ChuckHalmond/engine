#version 300 es

#extension GL_ANGLE_multi_draw : require

#define MAX_DRAW_COUNT 10

in vec4 a_position;

flat out int v_DrawID;

uniform viewBlock {
    mat4 u_view;
    mat4 u_projection;
};

struct BasicModel {
  mat4 u_model;
  vec3 u_color;
};

uniform basicModelBlock {
  BasicModel models[MAX_DRAW_COUNT];
};

void main() {
    BasicModel basicModel = models[gl_DrawID];
    mat4 model = basicModel.u_model;
    gl_Position = u_projection * u_view  * model * a_position;
    v_DrawID = gl_DrawID;
}