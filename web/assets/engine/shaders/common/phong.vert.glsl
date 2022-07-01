#version 300 es

//EXTS
//ENDEXTS

//DEFS
#define USE_NORMAL_MAP
#define USE_HEIGHT_MAP
//ENDDEFS

in vec2 a_uv;
in vec3 a_tangent;
in vec3 a_position;
in vec3 a_normal;

uniform worldViewBlock {
    mat4 u_model;
    mat4 u_view;
    mat4 u_camera;
    mat4 u_modelView;
    mat4 u_normal;
    mat4 u_projection;
};

uniform lightsBlock {
    vec3 u_lightWorldPos;
    vec3 u_lightColor;
};

out vec4 v_position;
out vec3 v_normal;

out vec3 v_lightPos;
out vec3 v_fragPos;
out vec2 v_uv;

#ifdef USE_HEIGHT_MAP
    uniform sampler2D u_heightMap;
#endif

void main() {
    vec4 vertPos = u_modelView * vec4(a_position, 1.0);
    vec3 fragPos = vec3(vertPos);
    vec3 lightPos = (u_view * vec4(u_lightWorldPos, 1.0)).xyz;

    #ifdef USE_HEIGHT_MAP
        float displacementScale = 0.5;
        float displacement = texture(u_heightMap, a_uv).r * displacementScale;
        vec3 displacedPos = a_position + vec3(0.0, 0.0, displacement);
        vertPos = u_modelView * vec4(displacedPos, 1.0);
        fragPos = vec3(vertPos);
    #endif

    #ifdef USE_NORMAL_MAP
        vec3 T = normalize((u_normal * vec4(a_tangent, 0.0)).xyz);
        vec3 N = normalize((u_normal * vec4(a_normal, 0.0)).xyz);
        vec3 B = normalize(cross(T, N));
        mat3 TBN = transpose(mat3(T, B, N));
        v_position = vertPos;
        v_lightPos = TBN * lightPos;
        v_fragPos = TBN * fragPos;
    #else
        v_position = vertPos;
        v_lightPos = lightPos;
        v_fragPos = fragPos;
    #endif

    v_normal = vec3(u_normal * vec4(a_normal, 0.0));
    gl_Position = u_projection * vertPos;
    v_uv = a_uv;
}
/*#version 300 es

in vec3 a_position;
in vec3 a_normal;
in vec2 a_uv;
in vec3 a_tangent;

uniform worldViewBlock {
    mat4 u_model;
    mat4 u_view;
    mat4 u_camera;
    mat4 u_modelView;
    mat4 u_normal;
    mat4 u_projection;
};

uniform lightsBlock {
    vec3 u_lightWorldPos;
    vec3 u_lightColor;
};

out vec4 v_position;
out vec2 v_uv;
out vec3 v_normal;

out vec3 v_lightPos;
out vec3 v_fragPos;

uniform sampler2D u_heightMap;

void main() {
    vec3 T = normalize((u_normal * vec4(a_tangent, 0.0)).xyz);
    vec3 N = normalize((u_normal * vec4(a_normal, 0.0)).xyz);
    vec3 B = normalize(cross(T, N));
    mat3 TBN = transpose(mat3(T, B, N));

    float displacementScale = 0.5;
    float displacement = texture(u_heightMap, a_uv).r * displacementScale;
    vec3 displacedPos = a_position + vec3(0.0, 0.0, displacement);

    vec4 vertPos = u_modelView * vec4(displacedPos, 1.0);
    
    vec3 fragPos = vec3(vertPos);
    vec3 lightPos = (u_view * vec4(u_lightWorldPos, 1.0)).xyz;

    v_position = vertPos;
    v_lightPos = TBN * lightPos;
    v_fragPos = TBN * fragPos;
    // v_lightPos = lightPos;
    // v_fragPos = fragPos;

    v_normal = vec3(u_normal * vec4(a_normal, 0.0));
    v_uv = a_uv;
    
    gl_Position = u_projection * vertPos;
}*/