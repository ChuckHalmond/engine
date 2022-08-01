#version 300 es

precision highp float;

in vec3 v_position;
in vec3 v_normal;
in vec3 v_color;

layout(location = 0) out vec3 o_position;
layout(location = 1) out vec3 o_normal;
layout(location = 2) out vec3 o_color;

void main() {
    o_position = v_position;
    o_normal = v_normal;
    o_color = v_color;
}