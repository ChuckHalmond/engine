#version 300 es

in vec4 a_position;
in vec3 a_normal;
in vec2 a_uv;
in vec3 a_tangent;
in vec3 a_bitangent;
in vec4 a_color;

uniform WorldViewBlock {
    mat4 u_world;
    mat4 u_worldInverseTranspose;
    mat4 u_viewInverse;
    mat4 u_worldViewProjection;
};

uniform LightsBlock {
    vec3 u_lightWorldPos;
    vec4 u_lightColor;
    vec4 u_ambient;
};

out vec4 v_position;
out vec2 v_texCoord;
out vec3 v_normal;
out vec4 v_color;
out vec3 v_surfaceToLight;
out vec3 v_surfaceToView;
out vec4 v_lightColor;
out vec4 v_ambient;
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
    v_lightColor = u_lightColor;
    v_ambient = u_ambient;
    v_color = a_color;

    gl_Position = positionViewSpace;
}