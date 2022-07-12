#version 300 es

//#define MAX_INSTANCES 2

precision highp float;

out vec4 o_outColor;
/*
uniform viewBlock {
  mat4 u_view;
  mat4 u_projection;
};

struct Model {
  mat4 u_model;
  mat4 u_modelView;
  mat4 u_normal;
};

uniform modelBlock {
  Model models[MAX_INSTANCES]; 
};*/

uniform vec3 u_color;

void main() {
  o_outColor = vec4(u_color, 1.0);
}