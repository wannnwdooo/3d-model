import { store } from 'quasar/wrappers';
import { InjectionKey } from 'vue';
import { Router } from 'vue-router';
import {
  createStore,
  Store as VuexStore,
  useStore as vuexUseStore,
} from 'vuex';
import { models, ModelsStateInterface } from 'src/store/modules/models';

export interface StateInterface {
  models: ModelsStateInterface;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: VuexStore<StateInterface>;
  }
}

export const storeKey: InjectionKey<VuexStore<StateInterface>> =
  Symbol('vuex-key');

declare module 'vuex' {
  export interface Store<S> {
    readonly $router: Router;
  }
}

export default store(function () {
  return createStore<StateInterface>({
    modules: {
      models,
    },

    strict: !!process.env.DEBUGGING,
  });
});

export function useStore() {
  return vuexUseStore(storeKey);
}
