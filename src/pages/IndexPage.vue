<template>
  <div ref="rendererContainer">
    <canvas ref="rendererCanvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { onMounted, ref } from 'vue';

const rendererContainer = ref<HTMLElement | null>(null);
const rendererCanvas = ref<HTMLCanvasElement | null>(null);

let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let currentObject: THREE.Object3D | null = null;

onMounted(() => {
  init();
});

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x2a003b);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    10000
  );
  camera.position.z = 10;
  camera.position.y = 45;

  renderer = new THREE.WebGLRenderer({
    canvas: rendererCanvas.value ?? undefined,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  if (rendererContainer.value) {
    rendererContainer.value.appendChild(renderer.domElement);
  }

  controls = new OrbitControls(camera, renderer.domElement);

  let light = new THREE.PointLight(0xffffff, 1);
  light.position.set(0, 0, 10);
  scene.add(light);

  let light2 = new THREE.DirectionalLight(0xffffff);
  light2.position.set(0, 0, -10);
  scene.add(light2);

  let light3 = new THREE.DirectionalLight(0xffffff);
  light3.position.set(0, 100, 0);
  scene.add(light3);

  const size = 200; // Размер сетки
  const divisions = 10; // Количество делений на сетке
  const gridHelper = new THREE.GridHelper(size, divisions);
  scene.add(gridHelper);

  if (currentObject !== null) {
    scene.add(currentObject);
  }

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

let loader = new ThreeMFLoader();

loader.load(
  '/models/STE520F_STESF_2-вилка PA6 CF.3mf',
  (group: THREE.Group) => {
    group.position.set(0, 0, 0);
    group.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        // object.material = new THREE.MeshBasicMaterial();
        // group.rotation.x = Math.PI / 3;
        scene.add(group);
      }
    });

    const box = new THREE.Box3().setFromObject(group);
    const center = box.getCenter(new THREE.Vector3());

    group.position.x += group.position.x - center.x;
    group.position.y += group.position.y - center.y;
    group.position.z += group.position.z - center.z;

    group.scale.set(1, 1, 1); // Уменьшение масштаба модели

    currentObject = group;
    init();
  },
  // Опционально: Функция для отслеживания прогресса загрузки
  (progress) => {
    console.log('Loading progress: ', progress.loaded / progress.total);
  },
  // Функция обработки ошибок
  (error) => {
    console.error('An error happened: ', error);
  }
);
</script>
