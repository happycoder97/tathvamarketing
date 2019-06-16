const THREE = require('three');
const MathEx = require('js-util/MathEx');

// Standard Normal variate using Box-Muller transform.
function randn_bm() {
    var u = 0, v = 0;
    while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
    while(v === 0) v = Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

export default class Fog {
  constructor() {
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      tex: {
        type: 't',
        value: null
      }
    };
    this.num = 5;
    this.obj;
  }
  createObj(tex) {
    // Define Geometries
    const geometry = new THREE.InstancedBufferGeometry();
    const baseGeometry = new THREE.PlaneBufferGeometry(2100, 2100, 20, 20);

    // Copy attributes of the base Geometry to the instancing Geometry
    geometry.copy(baseGeometry);

    // Define attributes of the instancing geometry
    const instancePositions = new THREE.InstancedBufferAttribute(new Float32Array(this.num * 3), 3);
    const delays = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);
    const rotates = new THREE.InstancedBufferAttribute(new Float32Array(this.num), 1);
    for ( var i = 0, ul = this.num; i < ul; i++ ) {
      let x = (Math.random() - 0.5)*500;
      let y = randn_bm()*50;
      let z = randn_bm()*10-100.0;

      instancePositions.setXYZ(
        i,
        x, y, z
      );
      delays.setXYZ(i, randn_bm() + 0.5);
      rotates.setXYZ(i, randn_bm() + 1);
    }
    geometry.addAttribute('instancePosition', instancePositions);
    geometry.addAttribute('delay', delays);
    geometry.addAttribute('rotate', rotates);

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/fog.vs').default,
      fragmentShader: require('./glsl/fog.fs').default,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending
    });
    this.uniforms.tex.value = tex;

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.obj.position.setZ(-50.0);
  }
  render(time) {
    this.uniforms.time.value += time;
  }
}
