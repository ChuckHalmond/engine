#version 300 es

precision highp float;
precision highp sampler2DArray;

in vec2 v_uv;

uniform sampler2D u_positionMap;
uniform sampler2D u_normalMap;
uniform sampler2D u_colorMap;

out vec4 o_fragColor;

void main() {  ivec2 fragCoord = ivec2(gl_FragCoord.xy);
  vec3 color = texelFetch(u_colorMap, fragCoord, 0).rgb;
  vec3 normal = (texelFetch(u_normalMap, fragCoord, 0).rgb + vec3(1.0)) / 2.0;
  vec3 position = texelFetch(u_positionMap, fragCoord, 0).rgb;
  o_fragColor = vec4(normal, 1.0);
}