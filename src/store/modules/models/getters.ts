import { GetterTree } from 'vuex';
import { ModelsStateInterface, IModel } from './state';
import { StateInterface } from 'src/store';

export enum GetterTypes {
  GET_LOADED_MODEL = 'GET_LOADED_MODEL',
}

export type Getters = {
  [GetterTypes.GET_LOADED_MODEL](state: ModelsStateInterface): IModel | null;
};

export const getters: GetterTree<ModelsStateInterface, StateInterface> &
  Getters = {
  [GetterTypes.GET_LOADED_MODEL]: (state) => {
    const model = state.model;
    if (model && model.size) {
      return { ...model, size: { ...model.size } };
    }
    return model;
  },
};
