#version 300 es

precision highp float;
precision highp sampler2DArray;
//EXTS
//ENDEXTS

//DEFS
#define USE_ALBEDO_MAP
#define USE_NORMAL_MAP
#define MAX_INSTANCES 2
#define MAX_LIGHTS 2
//ENDDEFS

in vec4 v_position;
in vec3 v_normal;
in vec2 v_uv;

in vec3 v_lightPos;
in vec3 v_fragPos;
in vec3 v_lightPos2;
in vec3 v_fragPos2;

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
};

struct Light {
  vec3 u_lightWorldPos;
  vec3 u_lightColor;
  vec3 u_lightDirection;
  float u_cutOff;
};

uniform lightsBlock {
  Light lights[MAX_LIGHTS];
};

uniform phongBlock {
  vec3 u_ambientColor;
  vec3 u_diffuseColor;
  vec3 u_specularColor;
  float u_ambientFactor;
  float u_diffuseFactor;
  float u_specularFactor;
  float u_shininess;
  float u_constant;
  float u_linear;
  float u_quadratic;
};

#ifdef USE_NORMAL_MAP
  uniform sampler2D u_normalMap;
#endif
#ifdef USE_ALBEDO_MAP
  uniform sampler2DArray u_albedoMap;
#endif

out vec4 o_outColor;

void main() {

  Light currentLight = lights[0];
  vec3 lightWorldPos = currentLight.u_lightWorldPos;
  vec3 lightColor = currentLight.u_lightColor;
  vec3 lightDirection = currentLight.u_lightDirection;
  float cutOff = currentLight.u_cutOff;

  float i = 1.0;
  #ifdef USE_ALBEDO_MAP
    vec3 albedo = texture(u_albedoMap, vec3(v_uv, i)).rgb;
  #else
    vec3 albedo = vec3(0.0, 1.0, 0.0);
  #endif

  #ifdef USE_NORMAL_MAP
    vec3 normal = texture(u_normalMap, v_uv).rgb;
    normal = normal * 2.0 - 1.0;
    vec3 N = normalize(normal);
  #else
    vec3 N = normalize(v_normal);
  #endif

  vec3 L = normalize(v_lightPos - v_fragPos);
  
  /*float theta = dot(normalize(v_lightPos2 - v_fragPos2), normalize(-lightDirection));
  if (theta > cutOff) {*/

    // Lambert's cosine law
    float specular = 0.0;
    float lambertian = max(dot(N, L), 0.0);
    if (lambertian > 0.0) {
      vec3 R = reflect(-L, N);
      vec3 V = normalize(-v_fragPos);
      float specularAngle = max(dot(V, R), 0.0);
      float shininess = max(u_shininess, 1.0);
      specular = pow(specularAngle, shininess);
      // Blinn
      // vec3 halfDir = normalize(L + V);
      // float specularAngle = max(dot(halfDir, N), 0.0);
      // specular = pow(specularAngle, u_shininess);
    }

    /*float ambientFactor = u_ambientFactor; 
    float diffuseFactor = u_diffuseFactor;
    float specularFactor = u_specularFactor;*/

    float dist = length(v_lightPos - v_fragPos);
    float attenuation = 1.0 / (u_constant + u_linear * dist + u_quadratic * (dist * dist));    
    float ambientFactor = u_ambientFactor * attenuation; 
    float diffuseFactor = u_diffuseFactor * attenuation;
    float specularFactor = u_specularFactor * attenuation;

    o_outColor = vec4(
      ambientFactor * u_ambientColor +
      diffuseFactor * lambertian * albedo +
      specularFactor * specular * u_specularColor,
      1.0
    );
  /*}
  else {
    o_outColor = vec4(
      u_ambientFactor * u_ambientColor,
      1.0
    );
  }*/
}
/*#version 300 es

precision highp float;

in vec2 v_uv;
in vec4 v_position;
in vec3 v_normal;

in vec3 v_lightPos;
in vec3 v_fragPos;

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

uniform phongBlock {
  vec3 u_ambientColor;
  vec3 u_diffuseColor;
  vec3 u_specularColor;
  float u_ambientFactor;
  float u_diffuseFactor;
  float u_specularFactor;
  float u_shininess;
};

uniform sampler2D u_normalMap;
uniform sampler2D u_albedo;

out vec4 o_outColor;

void main() {
  vec3 albedo = texture(u_albedo, v_uv).rgb;
  vec3 normal = texture(u_normalMap, v_uv).rgb;

  // normal = normal * 2.0 - 1.0;
  // vec3 N = normal;
  normal = normalize(normal) * 2.0 - 1.0;
  vec3 N = normalize(normal);
  // vec3 N = normalize(v_normal);
  vec3 L = normalize(v_lightPos - v_fragPos);
  
  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);
  float specular = 0.0;

  if (lambertian > 0.0) {
    vec3 R = reflect(-L, N);
    vec3 V = normalize(-v_fragPos);
    float specularAngle = max(dot(V, R), 0.0);
    float shininess = max(u_shininess, 1.0);
    specular = pow(specularAngle, shininess);
    // vec3 halfDir = normalize(L + V);
    // float specularAngle = max(dot(halfDir, N), 0.0);
    // specular = pow(specularAngle, u_shininess);
  }
  
  o_outColor = vec4(
    u_ambientFactor * u_ambientColor +
    u_diffuseFactor * lambertian * u_diffuseColor +
    u_specularFactor * specular * u_specularColor,
    1.0
  );
}*/