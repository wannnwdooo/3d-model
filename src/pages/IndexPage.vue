<template>
  <div ref="rendererContainer">
    <canvas ref="rendererCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { onMounted, ref } from 'vue';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

const rendererContainer = ref<HTMLElement | null>(null);
const rendererCanvas = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let currentObject: THREE.Object3D | null = null;
let transformControls: TransformControls;
let composer: EffectComposer;
let outlinePass: OutlinePass;
let selectableObjects: THREE.Object3D[] = [];

onMounted(() => {
  init();
});

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xadd8e6);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );

  camera.position.x = -50;
  camera.position.y = 75;
  camera.position.z = 50;
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({
    canvas: rendererCanvas.value ?? undefined,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;

  if (rendererContainer.value) {
    rendererContainer.value.appendChild(renderer.domElement);
  }

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.addEventListener('change', () => {
    composer.render();
  });

  transformControls = new TransformControls(camera, renderer.domElement);
  scene.add(transformControls);

  transformControls.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
  });

  let light = new THREE.AmbientLight(0xffffff, 2);
  light.position.set(0, 0, 10);
  scene.add(light);

  let light2 = new THREE.AmbientLight(0x404040, 2);
  light2.position.set(0, 0, -10);
  scene.add(light2);

  let light3 = new THREE.PointLight(0xffffff);
  light3.position.set(0, 100, 0);
  scene.add(light3);

  let light4 = new THREE.PointLight(0xffffff, 1, 100);
  light4.position.set(50, 50, 50);
  light4.castShadow = true;
  scene.add(light4);

  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x808080,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = Math.PI / 2;
  plane.layers.disable(1);
  scene.add(plane);

  const size = 200;
  const divisions = 10;
  const gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);
  gridHelper.position.y = 0.01;
  gridHelper.layers.disable(1);
  scene.add(gridHelper);

  composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  outlinePass = new OutlinePass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    scene,
    camera
  );
  composer.addPass(outlinePass);

  // outlinePass.visibleEdgeColor.set('#ffffff');
  // outlinePass.hiddenEdgeColor.set('#190a05');
  // outlinePass.edgeStrength = 2;
  // outlinePass.edgeGlow = 0;

  if (currentObject !== null) {
    scene.add(currentObject);
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  // renderer.render(scene, camera);
  composer.render();
}

let loader = new ThreeMFLoader();

loader.load(
  '/models/STE520F_STESF_2-вилка PA6 CF.3mf',
  (group: THREE.Group) => {
    group.position.set(0, 0, 0);
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.castShadow = true;
        if (
          object.material instanceof THREE.MeshBasicMaterial ||
          object.material instanceof THREE.MeshLambertMaterial ||
          object.material instanceof THREE.MeshPhongMaterial
        ) {
          object.material.color.setHex(0x2d5d9c);
        } else if (Array.isArray(object.material)) {
          for (const material of object.material) {
            material.color.setHex(0x2d5d9c);
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());

    group.position.x += group.position.x - center.x;
    group.position.y += group.position.y - center.y;
    group.position.z += group.position.z - center.z;

    const boundingBox = new THREE.Box3().setFromObject(group);
    const height = boundingBox.max.y - boundingBox.min.y;
    group.position.y += height / 2;

    group.scale.set(1, 1, 1);

    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.layers.enable(1);
      }
    });

    currentObject = group;
    selectableObjects.push(group);
    scene.add(currentObject);
    init();
  },
  (progress) => {
    console.log('Loading progress: ', progress.loaded / progress.total);
  },
  (error) => {
    console.error('An error happened: ', error);
  }
);

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

function onMouseClick(event: MouseEvent) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  let intersects = raycaster.intersectObjects(selectableObjects, true);

  if (intersects.length > 0) {
    let selectedObject = intersects[0].object;
    outlinePass.selectedObjects = [selectedObject];
    transformControls.attach(selectedObject);
  } else {
    outlinePass.selectedObjects = [];
    transformControls.detach();
  }
}

window.addEventListener('click', onMouseClick, false);
</script>
