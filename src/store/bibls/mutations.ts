import { MutationTree } from 'vuex'

import { BiblState } from '@/store/bibls/types'
export function getDefaultState (): BiblState {
  return {
    bibls: []
  }
};

export const mutations: MutationTree<BiblState> = {
  clear (state: BiblState) {
    Object.assign(state, getDefaultState())
  }
}
