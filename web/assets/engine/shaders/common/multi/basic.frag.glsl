#version 300 es

#extension GL_ANGLE_multi_draw : require

precision highp float;

#define MAX_DRAW_COUNT 10

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

flat in int v_DrawID;

out vec4 o_outColor;

void main() {
  BasicModel basicModel = models[v_DrawID];
  vec3 color = basicModel.u_color;
  o_outColor = vec4(color, 1.0);
}