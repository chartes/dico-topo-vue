import { MutationTree } from 'vuex'
import Vue from 'vue'
import { QueryState, RangeParameter } from '@/store/searchParameters/types'

export function getDefaultState (): QueryState {
  return {
    term: '',
    groupbyPlace: true,
    sortFields: [{
      key: 'place-label.keyword',
      order: 'DESC'
    }],
    range: { key: '', operators: [] },
    fuzziness: 0,
    tableFullscreen: false,
    tableMinimized: false,
    depFilter: [],
    ctnFilter: [],
    minTermLength: 2,
    pagination: { rowsPerPage: 200, page: 1 },
    zoom: 6,
    center: { lat: 46.453806, lng: 2.65392 },
    showIIIFViewer: false
  }
};

export const mutations: MutationTree<QueryState> = {
  setTerm (state: QueryState, t) {
    state.term = t
  },
  setGroupbyPlace (state: QueryState, b) {
    state.groupbyPlace = b
  },
  addSortField (state: QueryState, { field, order }) {
    console.log('add sort field', { key: field, order })
    state.sortFields.push({ key: field, order })
  },
  updateSortField (state: QueryState, { field, order }) {
    console.log(field, state.sortFields)
    const idx = state.sortFields.findIndex((f) => f.key === field)
    console.log('update sort field ->', idx, state.sortFields)
    if (idx > -1) {
      Vue.set(state.sortFields, idx, { key: field, order })
      console.log('sort field updated ->', state.sortFields)
    }
  },
  removeSortField (state: QueryState, field) {
    console.log(field, state.sortFields)
    const idx = state.sortFields.findIndex((f) => f.key === field)
    console.log('remove sort field ->', idx, state.sortFields)
    if (idx > -1) {
      state.sortFields.splice(idx, 1)
      console.log('sort field removed ->', state.sortFields)
    }
  },
  setRange (state: QueryState, range: RangeParameter) {
    state.range = Object.assign({}, state.range, range)
  },
  setFuzziness (state: QueryState, value) {
    state.fuzziness = value
  },
  removeRange (state: QueryState) {
    console.log('remove range')
    state.range = Object.assign({}, state.range, { key: '', operators: [] })
  },
  setDepFilter (state: QueryState, value) {
    state.depFilter = [...value]
  },
  setCtnFilter (state: QueryState, value) {
    state.ctnFilter = [...value]
  },
  setPagination (state: QueryState, value) {
    state.pagination = Object.assign({}, state.pagination, value)
  },
  setTableFullscreen (state: QueryState, value) {
    state.tableFullscreen = value
  },
  setTableMinimized (state: QueryState, value) {
    state.tableMinimized = value
  },
  saveZoom (state: QueryState, { zoom, center }) {
    state.zoom = zoom
    state.center = center
  },
  toggleIIIFViewer (state: QueryState) {
    state.showIIIFViewer = !state.showIIIFViewer
  },
  setIIIFViewer (state: QueryState, t) {
    state.showIIIFViewer = t
  }
}
