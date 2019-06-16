precision highp float;

varying float vWidth;
varying float vHeight;

varying vec2 vUv;
varying float now;

void main() {
  vec3 red = vec3(0.8, 0.05, 0.05);
  vec3 black = vec3(0.1);

  float threshold = step(50.0*sin((vUv.x+now*10.0)/400.0) + 70.0*sin((vUv.x+now*50.0)/200.0), vUv.y - vHeight/2.0);
  vec3 color = red*threshold + black*(1.0 - threshold);

  gl_FragColor = vec4(color, 1.0);
}

