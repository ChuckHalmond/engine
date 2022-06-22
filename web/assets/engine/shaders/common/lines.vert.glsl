#version 300 es

in vec4 a_position;

uniform viewBlock {
    mat4 u_worldViewProjection;
};

void main() {
    gl_Position = u_worldViewProjection * a_position;
}