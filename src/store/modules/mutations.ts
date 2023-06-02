import { MutationTree } from 'vuex';
import { ModelsStateInterface } from './state';

export enum MutationTypes {
  ADD_MODEL = 'ADD_MODEL',
  REMOVE_MODEL = 'REMOVE_MODEL',
}

export type Mutations<S = ModelsStateInterface> = {
  [MutationTypes.ADD_MODEL](state: S, model: THREE.Mesh): void;
  [MutationTypes.REMOVE_MODEL](state: S, model: THREE.Mesh): void;
};

export const mutations: MutationTree<ModelsStateInterface> & Mutations = {
  [MutationTypes.ADD_MODEL](state, model) {
    state.models.push({
      id: model.uuid,
      mesh: model,
    });
  },

  [MutationTypes.REMOVE_MODEL](state, model) {
    state.models = state.models.filter((m) => m.id !== model.uuid);
  },
};
