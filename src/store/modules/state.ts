export interface Model {
  id: string;
  mesh: THREE.Mesh;
}

export interface ModelsStateInterface {
  models: Model[];
}

export const state: ModelsStateInterface = {
  models: [],
};
