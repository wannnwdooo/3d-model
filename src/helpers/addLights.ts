import * as THREE from 'three';

export const addLights = (scene: THREE.Scene) => {
  const ambientLight = new THREE.AmbientLight(0x404040, 2);
  ambientLight.position.set(0, 0, -10);
  scene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff);
  pointLight.position.set(0, 100, 0);
  scene.add(pointLight);
};
