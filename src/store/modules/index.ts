import { InjectionKey } from 'vue';
import { createStore, useStore as baseUseStore, Store } from 'vuex';
import { ModelsStateInterface, state } from './state';
import { mutations } from './mutations';

const models = {
  namespaced: true,
  state,
  mutations,
  // actions and getters can be added here as well
  // actions,
  // getters,
};

export { models };
export type { ModelsStateInterface };
