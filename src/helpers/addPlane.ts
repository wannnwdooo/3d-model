import * as THREE from 'three';

export const addPlane = (scene: THREE.Scene) => {
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
};
