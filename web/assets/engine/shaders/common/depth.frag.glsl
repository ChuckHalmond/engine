#version 300 es

precision highp float;

in vec2 v_uv;

uniform sampler2D u_tex;

out vec4 o_outColor;

float near = 0.1; 
float far  = 100.0; 

float linearizeDepth(float depth) {
  float z = depth * 2.0 - 1.0;
  return (2.0 * near * far) / (far + near - z * (far - near));	
}

void main() {
    float z = texture(u_tex, v_uv).r;
    float depth = linearizeDepth(z) / far;
    o_outColor = vec4(
        vec3(1.0 - depth),
        1.0
    );
}