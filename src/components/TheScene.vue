<template>
  <div ref="container" class="renderer-container">
    <canvas
      ref="canvas"
      @click.prevent="onMouseClick"
      class="renderer-canvas"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';
import { onMounted, ref, watchEffect } from 'vue';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { useElementSize } from 'src/hooks/useElementSize';
import { useStore } from 'src/store';
import { GetterTypes as ModelsGetterTypes } from 'src/store/modules/models/getters';
import { loadModelComposition } from 'src/compositions/loadModelComposition';
import { addLights } from 'src/helpers/addLights';
import { addPlane } from 'src/helpers/addPlane';
import { addGridHelper } from 'src/helpers/addGridHelper';

const store = useStore();

const container = ref<HTMLElement | null>(null);
const canvas = ref<HTMLCanvasElement | null>(null);

const scene = new THREE.Scene();
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let currentObject: THREE.Object3D | null = null;
let transformControls: TransformControls;
let composer: EffectComposer;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

const { windowWidth, windowHeight } = useElementSize(container);

const { selectableObjects, loadModel } = loadModelComposition(scene);

onMounted(() => {
  init();
});

function init() {
  createScene();
  createCamera();
  createRenderer();
  createControls();
  createTransformControls();
  addLights(scene);
  addPlane(scene);
  addGridHelper(scene);
  createComposer();
  animate();
}

function createScene() {
  scene.background = new THREE.Color(0xadd8e6);
}

function createCamera() {
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 10000);
  camera.position.set(-50, 75, 50);
  camera.lookAt(0, 0, 0);
}

function createRenderer() {
  renderer = new THREE.WebGLRenderer({
    canvas: canvas.value ?? undefined,
    antialias: true,
  });

  if (container.value) {
    renderer.setSize(windowWidth.value, windowHeight.value);
    renderer.shadowMap.enabled = true;
    container.value.appendChild(renderer.domElement);
  }
}

function createControls() {
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.addEventListener('change', () => {
    composer.render();
  });
}

function createTransformControls() {
  transformControls = new TransformControls(camera, renderer.domElement);
  scene.add(transformControls);
  transformControls.addEventListener('dragging-changed', function (event) {
    controls.enabled = !event.value;
  });
}

function createComposer() {
  composer = new EffectComposer(renderer);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);
}

function loadNewModel() {
  const newModel = store.getters[ModelsGetterTypes.GET_LOADED_MODEL];
  loadModel(newModel);
}

function handleWindowResize() {
  if (container.value) {
    camera.aspect = windowWidth.value / windowHeight.value;
    camera.updateProjectionMatrix();
    renderer.setSize(windowWidth.value, windowHeight.value);
  }
}

function onMouseClick(event: MouseEvent) {
  if (container.value) {
    const offsetLeft = container.value.offsetLeft;
    const offsetTop = container.value.offsetTop;
    mouse.x = ((event.clientX - offsetLeft) / windowWidth.value) * 2 - 1;
    mouse.y = -((event.clientY - offsetTop) / windowHeight.value) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(selectableObjects, true);

    if (intersects.length > 0) {
      let selectedObject = intersects[0].object;
      if (selectedObject !== currentObject) {
        currentObject = selectedObject;
        transformControls.attach(selectedObject);
      }
    } else {
      currentObject = null;
      transformControls.detach();
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

watchEffect(() => {
  handleWindowResize();
  loadNewModel();
});
</script>

<style lang="scss" scoped>
.renderer-container {
  flex: 1;
  overflow: hidden;
  display: flex;
  align-items: stretch;
}

.renderer-canvas {
  width: 100%;
  height: auto;
  display: block;
}
</style>
