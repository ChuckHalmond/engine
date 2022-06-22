#version 300 es

in vec4 a_position;

uniform basicBlock {
    mat4 u_model;
    mat4 u_viewProjection;
    vec3 u_color;
};

void main() {
    gl_Position = (u_viewProjection * u_model * a_position);
}