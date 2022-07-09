#version 300 es

in vec4 a_position;

uniform viewBlock {
    mat4 u_view;
    mat4 u_projection;
};

uniform basicModelBlock {
    mat4 u_model;
    vec3 u_color;
};

void main() {
    gl_Position = (u_projection * u_view  * u_model * a_position);
}