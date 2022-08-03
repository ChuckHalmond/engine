#version 300 es

precision highp float;

in vec4 v_color;
in float v_distance;

uniform viewBlock {
  mat4 u_model;
  mat4 u_view;
  mat4 u_projection;
};

out vec4 o_outColor;
in vec3 v_position;

void main() {
	float dist = distance(u_model[3].xyz, v_position);
	float opacity = clamp(dist / 100.0, 0.0, 1.0);
  o_outColor =  v_color * vec4(1.0, 1.0, 1.0, 1.0 - opacity);
}