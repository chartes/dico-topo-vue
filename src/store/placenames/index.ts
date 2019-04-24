import {Module} from 'vuex';
import {getters} from './getters';
import {actions} from './actions';
import {mutations} from './mutations';
import {PlacenameState} from './types';
import {RootState} from '../types';

export const state: PlacenameState = {
  user: undefined,
  error: false
};

const namespaced: boolean = true;

export const placenames: Module<PlacenameState, RootState> = {
  namespaced,
  state,
  getters,
  actions,
  mutations
};
