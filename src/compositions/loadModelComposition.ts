import * as THREE from 'three';
import { ThreeMFLoader } from 'three/examples/jsm/loaders/3MFLoader';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { IModel } from 'src/store/modules/models/state';
import { ref } from 'vue';

interface ILoadingError {
  message: string;
  xhr?: XMLHttpRequest;
}

interface ILoadingProgress {
  loaded: number;
  total: number;
}

const selectableObjects: THREE.Object3D[] = [];
let currentModel: IModel | null = null;

export const loadModelComposition = (scene: THREE.Scene | null) => {
  const currentModelSize = ref({ x: 1, y: 1, z: 1 });
  let loader: STLLoader | ThreeMFLoader = new STLLoader();

  function loadModel(model: IModel) {
    if (!model) {
      clearCurrentModel();
      return;
    }

    if (model?.size) {
      currentModelSize.value = model.size;
      applyModelSize(currentModelSize.value);
    }

    if (model && model.name === currentModel?.name) {
      return;
    }

    clearCurrentModel();

    currentModel = model;
    if (currentModel) {
      loader =
        currentModel.type === '3mf' ? new ThreeMFLoader() : new STLLoader();

      loader.load(
        currentModel.link,
        function (object: THREE.Group | THREE.BufferGeometry) {
          object instanceof THREE.Group
            ? handleGroupObject(object)
            : handleBufferGeometry(object);
        },
        function (progress: ILoadingProgress) {
          console.log('Loading progress:', progress.loaded / progress.total);
        },
        function (error: ILoadingError) {
          console.error('An error happened:', error.message);
        }
      );
    }
  }

  function handleGroupObject(object: THREE.Group) {
    object.name = 'obj';
    object.position.set(0, 0, 0);

    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        if (
          child.material instanceof THREE.MeshBasicMaterial ||
          child.material instanceof THREE.MeshLambertMaterial ||
          child.material instanceof THREE.MeshPhongMaterial
        ) {
          child.material.color.setHex(0x2d5d9c);
        } else if (Array.isArray(child.material)) {
          for (const material of child.material) {
            material.color.setHex(0x2d5d9c);
          }
        }
      }
    });

    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());

    object.position.x += object.position.x - center.x;
    object.position.y += object.position.y - center.y;
    object.position.z += object.position.z - center.z;

    const boundingBox = new THREE.Box3().setFromObject(object);
    const height = boundingBox.max.y - boundingBox.min.y;
    object.position.y += height / 2;

    object.scale.set(
      currentModelSize.value.x,
      currentModelSize.value.y,
      currentModelSize.value.z
    );

    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.layers.enable(1);
        selectableObjects.push(child);
      }
    });

    if (scene) {
      scene.add(object);
    }
  }

  function handleBufferGeometry(geometry: THREE.BufferGeometry) {
    geometry.name = 'obj';
    const mesh = new THREE.Mesh(
      geometry,
      new THREE.MeshLambertMaterial({ color: 0x2d5d9c })
    );
    mesh.scale.set(
      currentModelSize.value.x,
      currentModelSize.value.y,
      currentModelSize.value.z
    );
    mesh.position.set(0, 0, 0);
    mesh.rotation.x = -Math.PI / 2;

    if (scene) {
      scene.add(mesh);
      mesh.layers.enable(1);
      selectableObjects.push(mesh);
    }
  }
  function applyModelSize(
    size: { x: number; y: number; z: number } | undefined
  ) {
    if (size) {
      selectableObjects.forEach((object) => {
        object.scale.set(size.x, size.y, size.z);
      });
    }
  }

  function clearCurrentModel() {
    if (scene && currentModel) {
      selectableObjects.forEach((object) => {
        scene.remove(object);
        object.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.geometry.dispose();
            child.material.dispose();
          }
        });
      });
      const obj = scene.getObjectByName('obj');
      if (obj) scene.remove(obj);
      selectableObjects.length = 0;
      currentModel = null;
    }
  }

  return {
    selectableObjects,
    loadModel,
  };
};
