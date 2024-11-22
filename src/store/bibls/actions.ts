import { ActionTree } from 'vuex'
import { BiblState } from './types'
import { RootState } from '../types'

export const actions: ActionTree<BiblState, RootState> = {
  clear ({ commit }) {
    commit('clear')
  }
}
