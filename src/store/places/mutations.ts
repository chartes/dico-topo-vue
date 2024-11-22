import { MutationTree } from 'vuex'
import { PlaceState, Place } from './types'
import Vue from 'vue'

export function getDefaultState (): PlaceState {
  return {
    items: new Map<string, Place>(),
    selectedItem: undefined,

    uniqueDepartments: [],
    uniqueCantons: [],

    knownYears: [],

    links: {},
    meta: { totalCount: 0, after: undefined },
    afterHistory: [],

    error: undefined,
    isLoading: false
  }
};

export const mutations: MutationTree<PlaceState> = {
  setItems (state: PlaceState, { p, links, meta }) {
    const newItems = new Map<string, Place>(p.map((i: any) => [i.id, i]))
    /* replace all items at once */
    state.items = newItems
    state.links = links
    state.meta = meta
    // state.uniqueDepartments = Object.assign([])
    // state.uniqueCantons = Object.assign([])
    state.error = undefined
  },
  setKnownYears (state: PlaceState, years) {
    state.knownYears = years
  },
  pushAfterHistory (state: PlaceState) {
    if (state.meta.after) {
      state.afterHistory.push(state.meta.after)
    }
  },
  popAfterHistory (state: PlaceState) {
    if (state.afterHistory.length > 0) {
      state.afterHistory.pop()
    }

    if (state.afterHistory.length > 0) {
      const previous = { after: state.afterHistory.pop() }
      state.meta = Object.assign({}, state.meta, previous)
      console.log('restoring', previous, state.meta)
    } else {
      console.log('going back to the first page')
      state.meta = Object.assign({}, state.meta, { after: undefined })
    }
  },
  setDepartmentList (state: PlaceState, d) {
    Vue.set(state, 'uniqueDepartments', [...d])
  },
  /*
  clearDepartment (state: PlaceState) {
    state.uniqueDepartments = Object.assign([])
  },
  */
  setCantonList (state: PlaceState, d) {
    Vue.set(state, 'uniqueCantons', [...d])
  },
  /*
  clearCanton (state: PlaceState) {
    state.uniqueCantons = Object.assign([])
  },
  */
  clearAll (state: PlaceState, { links, meta }) {
    state.items = new Map<string, Place>()
    state.links = links
    state.meta = meta
    state.afterHistory = []
    // state.uniqueDepartments = Object.assign([])
    // state.uniqueCantons = Object.assign([])
    state.knownYears = []
    state.error = undefined
  },
  selectItem (state, item) {
    state.selectedItem = item
  },
  unselectItem (state) {
    state.selectedItem = undefined
  },
  setError (state, message: string) {
    state.error = message
    console.error(message)
  },
  setLoading (state, value: boolean) {
    state.isLoading = value
  }
}
