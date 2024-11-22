import { ActionTree } from 'vuex'
import { QueryState } from './types'
import { RootState } from '../types'
import * as _ from 'lodash'

export const actions: ActionTree<QueryState, RootState> = {
  setTerm ({ commit }, t): any {
    commit('setTerm', t)
  },
  setGroupbyPlace ({ commit }, t): any {
    commit('setGroupbyPlace', t)
  },
  setRange ({ commit }, { key, operators }): any {
    commit('setRange', { key, operators })
  },
  setFuzziness ({ commit }, value): any {
    commit('setFuzziness', value)
  },
  removeRange ({ commit }): any {
    commit('removeRange')
  },
  setPagination ({ commit }, t): any {
    commit('setPagination', t)
  },
  setTableFullscreen ({ commit }, t): any {
    commit('setTableFullscreen', t)
  },
  setTableMinimized ({ commit }, t): any {
    commit('setTableMinimized', t)
  },
  saveZoom ({ commit }, { zoom, center }): any {
    commit('saveZoom', { zoom, center })
  },
  addSortField ({ commit }, { field, order }): any {
    commit('addSortField', { field, order })
  },
  updateSortField ({ commit }, { field, order }): any {
    commit('updateSortField', { field, order })
  },
  removeSortField ({ commit }, field): any {
    commit('removeSortField', field)
  },
  setCtnFilter ({ commit }, value): any {
    commit('setCtnFilter', value)
  },
  setDepFilter ({ commit }, value): any {
    commit('setDepFilter', value)
  },
  toggleIIIFViewerVisibility ({ commit }) : any {
    commit('toggleIIIFViewer')
  },
  setIIIFViewerVisibility ({ commit }, t) : any {
    commit('setIIIFViewer', t)
  },
  searchCallback: ({ dispatch }) => {
    console.log('fullsearch')
    // start the search from here
    dispatch('fetchMapResults')
    dispatch('fetchUniqueLists')
    dispatch('fetchTableResults')
  },
  fetchUniqueLists: _.debounce(async ({ getters, dispatch }: any) => {
    dispatch('places/fetchUniqueLists', {
      query: getters.query
    },
    { root: true })
  }, 25),
  fetchMapResults: _.debounce(async ({ rootState, getters, dispatch }: any) => {
    // send a fake query just to get the total count
    const meta = await dispatch('mapmarkers/searchMapMarker', {
      query: getters.query,
      filterParam: getters.computedFilterParam,
      rangeParam: getters.computedRangeParam,
      pageSize: 1
    }, { root: true })
    // currently does not handle larger result sets
    const max = 10000
    if (rootState.places.meta['total-count'] > max) {
      console.error('result is too large: ', meta['total-count'])
      return
    }
    dispatch('mapmarkers/clearMapMarkers', null, { root: true })
    const nbPages = rootState.places.meta['total-count'] >= max / 2 ? 2 : 1
    const pPromises = [...Array(nbPages).keys()].map(k => {
      return dispatch('mapmarkers/searchMapMarker', {
        query: getters.query,
        filterParam: getters.computedFilterParam,
        rangeParam: getters.computedRangeParam,
        pageSize: Math.ceil(max / nbPages),
        pageNumber: k + 1
      }, { root: true })
    })
    await Promise.all(pPromises)
  }, 25),
  fetchTableResults: _.debounce(async ({ state, getters, dispatch }: any, after: any) => {
    if (state.groupbyPlace) {
      dispatch('places/recordCurrentAggPage', null, { root: true })
    }
    dispatch('places/searchPlace', {
      query: getters.query,
      rangeParam: getters.computedRangeParam,
      filterParam: getters.computedFilterParam,
      groupbyPlace: state.groupbyPlace,
      sortParam: getters.computedSortParam,
      pageNumber: state.pagination.page,
      pageSize: state.pagination.rowsPerPage,
      after
    },
    { root: true })
  }, 25)
}
