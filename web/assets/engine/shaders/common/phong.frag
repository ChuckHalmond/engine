#version 300 es

precision mediump float;

in vec4 v_position;
in vec2 v_texCoord;
in vec3 v_normal;
in vec4 v_color;
in vec3 v_surfaceToLight;
in vec3 v_surfaceToView;
in vec4 v_lightColor;
in vec4 v_ambient;
in mat3 v_TBN;

uniform PhongBlock {
  vec4 u_specular;
  float u_shininess;
  float u_specularFactor;
};

uniform sampler2D u_normalMap;
uniform sampler2D u_diffuseMap;

out vec4 o_outColor;

vec4 lit(float l ,float h, float m) {
  return vec4(1.0,
              max(l, 0.0),
              (l > 0.0) ? pow(max(0.0, h), m) : 0.0,
              1.0);
}

void main() {
  vec3 normal = texture(u_normalMap, v_texCoord).rgb;
  normal = normalize(normal * 2.0 - 1.0);
  //vec3 normal = v_normal;

  vec4 diffuseColor = /*mix(*/texture(u_diffuseMap, v_texCoord)/*, v_color, 0.004)*/;
  
  vec3 surfaceToLight = normalize(v_surfaceToLight);
  vec3 surfaceToView = normalize(v_surfaceToView);

  vec3 halfVector = normalize(surfaceToLight + surfaceToView);
  vec4 litR = lit(dot(normal, surfaceToLight),
                    dot(normal, halfVector), u_shininess);
  o_outColor = vec4((
    v_lightColor * (diffuseColor * litR.y + diffuseColor * v_ambient +
                u_specular * litR.z * u_specularFactor)).rgb,
    diffuseColor.a);
}