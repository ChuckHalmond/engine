#version 300 es

precision highp float;

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

//uniform sampler2D u_normalMap;
//uniform sampler2D u_albedo;

out vec4 o_outColor;

void main() {
  vec3 albedo = vec3(1.0, 0.0, 0.0);
  vec3 N = normalize(v_normal);
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