attribute vec3 position;
attribute vec3 position2;
attribute vec3 position3;
attribute vec3 position4;
attribute vec3 position5;
attribute vec2 uv;
attribute float opacity;
attribute float opacity2;
attribute float opacity3;
attribute float opacity4;
attribute float opacity5;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
uniform float time;
uniform float timeTransform;
uniform float durationTransform;
uniform float prevIndex;
uniform float nextIndex;

varying vec3 vPosition;
varying vec2 vUv;
varying float vOpacity;

#pragma glslify: easeExpoOut = require(glsl-easings/exponential-out)
#pragma glslify: calcRotateMat4 = require(glsl-matrix/calcRotateMat4);

void main(void) {
  // transform
  vec3 prevPosition =
    position * (1.0 - step(1.0, prevIndex))
    + position2 * step(1.0, prevIndex) * (1.0 - step(2.0, prevIndex))
    + position3 * step(2.0, prevIndex) * (1.0 - step(3.0, prevIndex))
    + position4 * step(3.0, prevIndex) * (1.0 - step(4.0, prevIndex))
    + position5 * step(4.0, prevIndex) * (1.0 - step(5.0, prevIndex));
  vec3 nextPosition =
    position * (1.0 - step(1.0, nextIndex))
    + position2 * step(1.0, nextIndex) * (1.0 - step(2.0, nextIndex))
    + position3 * step(2.0, nextIndex) * (1.0 - step(3.0, nextIndex))
    + position4 * step(3.0, nextIndex) * (1.0 - step(4.0, nextIndex))
    + position5 * step(4.0, nextIndex) * (1.0 - step(5.0, nextIndex));
  float prevOpacity =
    opacity * (1.0 - step(1.0, prevIndex))
    + opacity2 * step(1.0, prevIndex) * (1.0 - step(2.0, prevIndex))
    + opacity3 * step(2.0, prevIndex) * (1.0 - step(3.0, prevIndex))
    + opacity4 * step(3.0, prevIndex) * (1.0 - step(4.0, prevIndex))
    + opacity5 * step(4.0, prevIndex) * (1.0 - step(5.0, prevIndex));
  float nextOpacity =
    opacity * (1.0 - step(1.0, nextIndex))
    + opacity2 * step(1.0, nextIndex) * (1.0 - step(2.0, nextIndex))
    + opacity3 * step(2.0, nextIndex) * (1.0 - step(3.0, nextIndex))
    + opacity4 * step(3.0, nextIndex) * (1.0 - step(4.0, nextIndex))
    + opacity5 * step(4.0, nextIndex) * (1.0 - step(5.0, nextIndex));
  float ease = easeExpoOut(min(timeTransform / 1.0, durationTransform) / durationTransform);
  vec3 mixPosition = mix(prevPosition, nextPosition, ease);
  float mixOpacity = mix(prevOpacity, nextOpacity, ease);

  // calculate shake moving.
  float now = time * 10.0 + length(mixPosition);
  mat4 rotateMat = calcRotateMat4(vec3(now));
  vec3 shake = (rotateMat * vec4(vec3(0.0, sin(now) * 5.0, 0.0), 1.0)).xyz;

  // coordinate transformation
  vec4 mvPosition = modelViewMatrix * vec4(mixPosition, 1.0);

  vPosition = mixPosition;
  vUv = uv;
  vOpacity = mixOpacity;

  gl_Position = projectionMatrix * mvPosition;
}
