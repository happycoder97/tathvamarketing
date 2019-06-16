varying vec2 vUv;
uniform float time;
uniform float width;
uniform float height; 

varying float now;
varying float vWidth;
varying float vHeight;

void main()
{
    now = time;
    vUv = uv;
    vWidth = width;
    vHeight = height;

    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}