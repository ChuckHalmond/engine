#version 300 es

precision mediump float;

in vec2 v_barycentric;

uniform wireframeBlock {
  vec3 u_color;
  float u_maxAlpha;
  float u_lineWidth;
};

out vec4 o_outColor;

/**
 * Computes the transparency of the wireframe for the given barycentric coordinates.
 * Returns 0.0 on the grid lines and 1.0 on the rest of the trianglen.
 * @param vBC {vec2} is the varying vec2 barycentric coordinate.
 * @param width {float} is the width of the grid lines in pixels.
 * @returns {float} the transparency of the wireframe
 */
float wireframeTransparency(vec2 vBC, float width) {
  vec3 bary = vec3(vBC.x, vBC.y, 1.0 - vBC.x - vBC.y);
  vec3 d = fwidth(bary);
  vec3 a3 = smoothstep(d * (width - 0.5), d * (width + 0.5), bary);
  return min(min(a3.x, a3.y), a3.z);
}

void main() {
  float transparency = wireframeTransparency(v_barycentric, u_lineWidth);
  float alpha = 1.0 - transparency;
  o_outColor = vec4(alpha * u_color, min(alpha, u_maxAlpha));
  //o_outColor = vec4(u_color, 1);
}