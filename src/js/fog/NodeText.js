const THREE = require('three');
const MathEx = require('js-util/MathEx');

export default class Node {
  constructor() {
    this.durationTransform = 0.5;
    this.uniforms = {
      time: {
        type: 'f',
        value: 0
      },
      timeTransform: {
        type: 'f',
        value: this.durationTransform*2
      },
      durationTransform: {
        type: 'f',
        value: this.durationTransform
      },
      prevIndex: {
        type: 'f',
        value: 3
      },
      nextIndex: {
        type: 'f',
        value: 0
      },
    };
    this.isTransform = false;
    this.obj;
    this.objWire = null;
    this.objPoints = null;
  }
  createObj(font) {
    // Define Geometry
    const optTextGeometry = {
      font: font,
      size: Math.log(innerWidth)*5.0 + 20.0,
      height: 0,
      curveSegments: 1,
    };
    const baseGeometries = [
      new THREE.TextBufferGeometry('4 DAYS', optTextGeometry),
      new THREE.TextBufferGeometry('60+ EVENTS', optTextGeometry),
      new THREE.TextBufferGeometry('300K+ WEBSITE HITS', optTextGeometry),
      new THREE.TextBufferGeometry('1200+ COLLEGES', optTextGeometry),
      new THREE.TextBufferGeometry('35K+ FOOTFALL', optTextGeometry),
    ];
    const geometry = new THREE.BufferGeometry();
    let maxCount = 0;

    baseGeometries.map((g, i) => {
      g.center();
      //g.mergeVertices();
      if (g.attributes.position.count > maxCount) {
        maxCount = g.attributes.position.count;
      }
    });
    baseGeometries.map((g, i) => {
      const index = (i > 0) ? i + 1 : '';
      if (g.attributes.position.count < maxCount) {
        const basePosition = g.attributes.position.array;
        const position = [];
        const opacity = [];
        for (var j = 0; j < maxCount * 3; j += 3) {
          if (j < (maxCount * 3 - basePosition.length) / 2) {
            position[j] = (Math.random() * 2 - 1) * 200;
            position[j + 1] = (Math.random() * 2 - 1) * 150;
            position[j + 2] = (Math.random() * 2 - 1) * 150;
            opacity[j / 3] = 0;
          } else if (j >= basePosition.length + (maxCount * 3 - basePosition.length) / 2) {
            position[j] = (Math.random() * 2 - 1) * 200;
            position[j + 1] = (Math.random() * 2 - 1) * 150;
            position[j + 2] = (Math.random() * 2 - 1) * 150;
            opacity[j / 3] = 0;
          } else {
            const k = j - (maxCount * 3 - basePosition.length) / 2;
            position[j] = g.attributes.position.array[k];
            position[j + 1] = g.attributes.position.array[k + 1];
            position[j + 2] = g.attributes.position.array[k + 2];
            opacity[j / 3] = 1;
          }
        }
        geometry.addAttribute(`position${index}`, new THREE.Float32BufferAttribute(position, 3, 1));
        geometry.addAttribute(`opacity${index}`, new THREE.Float32BufferAttribute(opacity, 1, 1));
      } else {
        const opacity = [];
        for (var j = 0; j < maxCount ; j++) {
          opacity[j] = 1;
        }
        geometry.addAttribute(`position${index}`, g.attributes.position);
        geometry.addAttribute(`opacity${index}`, new THREE.Float32BufferAttribute(opacity, 1, 1));
        geometry.addAttribute('normal', g.attributes.normal);
        geometry.addAttribute(`uv`, g.attributes.uv);
        geometry.setIndex(g.index);
      }
    });

    // Define Material
    const material = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/nodeText.vs').default,
      fragmentShader: require('./glsl/nodeText.fs').default,
      depthWrite: false,
      transparent: true,
      flatShading: true,
    });
    const materialWire = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/nodeText.vs').default,
      fragmentShader: require('./glsl/nodeTextWire.fs').default,
      depthWrite: false,
      transparent: true,
      wireframe: true,
    });
    const materialPoints = new THREE.RawShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: require('./glsl/nodeTextPoints.vs').default,
      fragmentShader: require('./glsl/nodeTextPoints.fs').default,
      depthWrite: false,
      transparent: true,
    });

    // Create Object3D
    this.obj = new THREE.Mesh(geometry, material);
    this.objWire = new THREE.Mesh(geometry, materialWire);
    this.objPoints = new THREE.Points(geometry, materialPoints);
  }
  transform() {
    const max = 4;
    this.isTransform = true;
    this.uniforms.timeTransform.value = 0;
    this.uniforms.prevIndex.value = (this.uniforms.prevIndex.value < max) ? this.uniforms.prevIndex.value + 1 : 0;
    this.uniforms.nextIndex.value = (this.uniforms.nextIndex.value < max) ? this.uniforms.nextIndex.value + 1 : 0;
  }
  render(time) {
    this.uniforms.time.value += time;
    if (this.isTransform) {
      this.uniforms.timeTransform.value = MathEx.clamp(
        this.uniforms.timeTransform.value + time,
        0,
        this.durationTransform
      );
    }
    if (this.uniforms.timeTransform.value === this.durationTransform) {
      this.isTransform = false;
    }
  }
}
