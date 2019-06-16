const THREE = require('three');
const OrbitControls = require('three-orbitcontrols')
const debounce = require('js-util/debounce');
const NodeText = require('./NodeText').default;
const BackgroundSphere = require('./BackgroundSphere').default;
const TathvaText = require('./TathvaText').default;
const DescText = require('./DescText').default;
const loadTexs = require('../loadTexs').default;
const Fog = require('./Fog').default;

// ==========
// Define common variables
//
const resolution = new THREE.Vector2();
const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const clock = new THREE.Clock();
const loader = new THREE.FontLoader();

camera.far = 50000;
camera.setFocalLength(27);

// ==========
// Define unique variables
//
const texsSrc = {
  fog: './img/fog/fog.png'
};
const fog = new Fog();
const tathvaText = new TathvaText();
const descText = new DescText();
const nodeText = new NodeText();
const bg = new BackgroundSphere();

//======Camera movement==========
var scale = 5;
var mouseX = 0;
var mouseY = 0;

camera.rotation.order = "YXZ";
function mouseMove(event) {
  if(event.clientX) {
    mouseX = - (event.clientX / renderer.domElement.clientWidth) * 2 + 1;
    mouseY = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  }
  if(event.touches) {
    let touch = event.touches.item(0);

    mouseX = - (touch.clientX / renderer.domElement.clientWidth) * 2 + 1;
    mouseY = 0;
  }
  // console.log(camera.rotation.x + " " + camera.rotation.y);
  camera.rotation.x = mouseY / scale;
  camera.rotation.y = mouseX / scale;
}

// ==========
// Define functions
//
const render = () => {
  const time = clock.getDelta();
  fog.render(time);
  nodeText.render(time);
  tathvaText.render(time);
  renderer.render(scene, camera);

};
const renderLoop = () => {
  render();
  requestAnimationFrame(renderLoop);
};
const resizeCamera = () => {
  camera.aspect = resolution.x / resolution.y;
  camera.updateProjectionMatrix();
};
const resizeWindow = () => {
  resolution.set(document.body.clientWidth, window.innerHeight);
  canvas.width = resolution.x;
  canvas.height = resolution.y;
  resizeCamera();
  renderer.setSize(resolution.x, resolution.y);
};
const on = () => {
  window.addEventListener('resize', debounce(resizeWindow, 1000));
  window.setInterval(() => {
    nodeText.transform();
  }, 2000);
  window.addEventListener('click', () => {
    nodeText.transform();
  });
};

// ==========
// Initialize
//

const init = () => {
  let light = new THREE.PointLight(0xffffff, 0.2);
  light.position.z = 1000;
  light.position.x = 800;
  // scene.add(light);

  loadTexs(texsSrc, (loadedTexs) => {
    fog.createObj(loadedTexs.fog);

    scene.add(fog.obj);

    renderer.setClearColor(0xffeecc, 1.0);
    camera.position.set(0, 0, 1000);
    camera.lookAt(new THREE.Vector3());
    clock.start();

    document.addEventListener('mousemove', mouseMove, false);
    document.addEventListener('touchmove', mouseMove, false);
    loader.load('./font/Lato.json', (font) => {
      nodeText.createObj(font);

      let elems = [nodeText.obj];
      elems.map((e, i) => {
        scene.add(e);
        if (innerWidth / innerHeight > 4 / 3) {
          var box = new THREE.Box3().setFromObject(e);
          let t = new THREE.Vector3();
          box.getCenter(t);
          let x =  - innerWidth*0.59;
          let y = - innerHeight * 0.2;
          e.position.set(x, y, -15)
        } else {
          var vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
          var dist = distanceVector(camera.position, e.position);
          var height = 2 * Math.tan( vFOV / 2 ) * dist; // visible height

          var box = new THREE.Box3().setFromObject(e);
          let y = - height*0.3;
          e.position.set(-box.getCenter().x, y, -15)
        }
      });

    });

    let loader1 = new THREE.FontLoader();
    loader1.load('./font/Lato.json',
      function (font) {
        tathvaText.create_text(font);
        scene.add(tathvaText.obj);

        descText.create_text(font);
        scene.add(descText.obj);

        if (innerWidth / innerHeight > 4 / 3) {
          let x_pos = innerWidth / 1.2;
          let y_pos = innerHeight / 20.0;
          tathvaText.obj.position.set(-x_pos, y_pos, 20.0);
          tathvaText.obj.rotateY(0.1);

          descText.obj.rotateY(-0.1);
          descText.obj.position.x = innerWidth / 3.5 - 150.0;
          descText.obj.position.y = innerHeight / 3.5 - 10.0;
          descText.obj.position.z = 2;
        } else {
          {
            var vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
            var dist = distanceVector(camera.position, tathvaText.obj.position);
            var height = 2 * Math.tan( vFOV / 2 ) * dist; // visible height

            var tathvaTextBox = new THREE.Box3().setFromObject(tathvaText.obj);
            let x_pos = 0.0 - tathvaTextBox.getCenter().x;
            let y_pos = 0.0 - tathvaTextBox.getCenter().y + height * 0.25;
            tathvaText.obj.position.set(x_pos, y_pos, 20.0);
          }
          {
            var vFOV = THREE.Math.degToRad( camera.fov ); // convert vertical fov to radians
            var dist = distanceVector(camera.position, descText.obj.position);
            var height = 2 * Math.tan( vFOV / 2 ) * dist; // visible height

            var descTextBox = new THREE.Box3().setFromObject(descText.obj);
            let x_pos = 0.0 - descTextBox.getCenter().x;
            let y_pos = 0.0 - descTextBox.getCenter().y + height * 0.03;
            descText.obj.position.set(x_pos, y_pos, 20.0);
          }
        }
      }

    );

    on();
    resizeWindow();
    renderLoop();
  });
}

function distanceVector( v1, v2 )
{
    var dx = v1.x - v2.x;
    var dy = v1.y - v2.y;
    var dz = v1.z - v2.z;

    return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

init();

