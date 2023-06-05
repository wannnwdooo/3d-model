import { ModelsStateInterface, state } from './state';
import { mutations } from './mutations';
import { getters } from './getters';
import { Module } from 'vuex';
import { StateInterface } from 'src/store';

export const models: Module<ModelsStateInterface, StateInterface> = {
  state,
  mutations,
  getters,
};

export type { ModelsStateInterface };
