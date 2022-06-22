#version 300 es

in vec4 a_position;
in vec2 a_barycentric;

out vec2 v_barycentric;

uniform viewBlock {
    mat4 u_worldViewProjection;
};

void main() {
    vec4 position = u_worldViewProjection * a_position;
    v_barycentric = a_barycentric;
    gl_Position = position;
}