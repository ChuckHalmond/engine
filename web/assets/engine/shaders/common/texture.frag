#version 300 es

precision highp float;

in vec2 v_uv;

uniform sampler2D u_tex;

out vec4 outColor;

void main()
{
    vec4 tex = texture(u_tex, v_uv);
    outColor = vec4(1.0 - tex.r, 1.0 - tex.g, 1.0 - tex.b, 1.0);
}