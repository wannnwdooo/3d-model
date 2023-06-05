import * as THREE from 'three';

export const addGridHelper = (scene: THREE.Scene) => {
  const size = 200;
  const divisions = 10;
  const gridHelper = new THREE.GridHelper(size, divisions, 0x000000, 0x000000);
  gridHelper.position.y = 0.01;
  gridHelper.layers.disable(1);
  scene.add(gridHelper);
};
