#version 300 es

uniform mat4 u_worldViewProjection;
uniform mat4 u_worldInverseTranspose;
uniform vec3 u_lightWorldPos;
uniform mat4 u_world;
uniform mat4 u_viewInverse;

in vec4 a_position;
in vec3 a_normal;
in vec2 a_uv;

out vec4 v_position;
out vec2 v_texCoord;
out vec3 v_normal;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;

in vec3 a_tangent;
in vec3 a_bitangent;

out mat3 v_TBN;

void main() {
    vec3 T = normalize((u_worldInverseTranspose * vec4(a_tangent,   0.0)).xyz);
    vec3 B = normalize((u_worldInverseTranspose * vec4(a_bitangent, 0.0)).xyz);
    vec3 N = normalize((u_worldInverseTranspose * vec4(a_normal,    0.0)).xyz);
    v_TBN = transpose(mat3(T, B, N));
    
    vec4 positionViewSpace = u_worldViewProjection * a_position;

    v_position = positionViewSpace;
    v_normal = (u_worldInverseTranspose * vec4(a_normal, 0)).xyz;
    v_surfaceToLight = v_TBN * u_lightWorldPos /** positionViewSpace.xyz*/;
    v_surfaceToView = v_TBN * u_viewInverse[3].xyz /** positionViewSpace.xyz*/;
    v_texCoord = a_uv;

    gl_Position = positionViewSpace;
}