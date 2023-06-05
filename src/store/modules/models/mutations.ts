import { MutationTree } from 'vuex';
import { ModelsStateInterface, IModel, IModelSize } from './state';

export enum MutationTypes {
  ADD_MODEL = 'ADD_MODEL',
  REMOVE_MODEL = 'REMOVE_MODEL',
  UPDATE_SIZE_MODEL = 'UPDATE_SIZE_MODEL',
}

export type Mutations = {
  [MutationTypes.ADD_MODEL](state: ModelsStateInterface, payload: IModel): void;
  [MutationTypes.REMOVE_MODEL](state: ModelsStateInterface): void;
  [MutationTypes.UPDATE_SIZE_MODEL](
    state: ModelsStateInterface,
    size: IModelSize
  ): void;
};

export const mutations: MutationTree<ModelsStateInterface> & Mutations = {
  [MutationTypes.ADD_MODEL](state, payload) {
    state.model = payload;
  },

  [MutationTypes.REMOVE_MODEL](state) {
    if (state.model) {
      state.model = null;
    }
  },

  [MutationTypes.UPDATE_SIZE_MODEL](state, size) {
    if (state.model) {
      state.model.size = size;
    }
  },
};
