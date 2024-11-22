import { ActionTree } from 'vuex'
import { MapMarkerState } from './types'
import { RootState } from '../types'
import { api } from '@/utils/http-common'

export const actions: ActionTree<MapMarkerState, RootState> = {
  setMarkersLoading ({ commit }, loading: Boolean) {
    commit('setLoading', loading)
  },
  setFlyToItem ({ commit }, item) {
    commit('setFlyToItem', item)
  },
  clearMapMarkers ({ commit }) : any {
    commit('setLoading', true)
    commit('clearAll')
    commit('setLoading', false)
  },
  searchMapMarker ({ commit, state }, { query, filterParam, rangeParam, pageSize, pageNumber, nextLink }): any {
    let url: any = null

    if (nextLink) {
      url = nextLink
    } else {
      // const index = `${process.env.VUE_APP_PLACE_INDEX}`
      const maxPageSize: number = process.env.VUE_APP_PLACE_INDEX_MAP_PAGE_SIZE
      const searchPageSize = pageSize > maxPageSize || pageSize === -1 ? maxPageSize : pageSize
      const searchPageNumber = pageNumber || 1

      const filteredQuery = filterParam ? `${query} AND ${filterParam}` : query
      const range = rangeParam ? `&${rangeParam}` : ''

      url = `/search?query=${filteredQuery}${range}&page[size]=${searchPageSize}&page[number]=${searchPageNumber}&facade=map&filter[longlat]`
    }
    commit('setLoading', true)

    return new Promise((resolve, reject) => {
      api.get(url)
        .then((response) => {
          /* parse marker items */
          const items: string[] = response.data.data.map((m: any) => {
            const longlat: any = m.attributes.longlat
            const coords: [string, string] = longlat ? longlat.substr(1, longlat.length - 2).split(',') : null
            return {
              id: m.type === 'place' ? m.id : m.attributes['place-id'],
              label: m.attributes['place-label'],
              coordinates: [parseFloat(coords[1]), parseFloat(coords[0])]
            }
          })

          const newItems = items.filter((thing: any, index, self) =>
            index === self.findIndex((t :any) => (t.id === thing.id))
          )
          /* save marker items */
          commit('setItems', { m: [...newItems], links: response.data.data.links, meta: { totalCount: response.data.meta['total-count'] } })

          resolve(response.data.meta)
          commit('setLoading', false)
        })
        .catch((error: any) => {
          commit('clearAll')
          commit('setError', error.message)
          reject(state.error)
        })
    })
  }
}
