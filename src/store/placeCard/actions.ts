import { ActionTree } from 'vuex'
import { PlaceCardState, PlaceOldLabel } from './types'
import { Place } from '@/store/places/types'
import { RootState } from '../types'
import { api } from '@/utils/http-common'

// const index = `${process.env.VUE_APP_PLACE_INDEX}`

function buildPlace (obj: any) {
  console.log('inha', obj)
  const inhaUuidIndex = obj.attributes['inha-uri'] ? obj.attributes['inha-uri'].lastIndexOf('/') : null
  return {
    id: obj.id,
    type: obj.type,
    label: obj.attributes.label,
    // num_start_page: obj.attributes['num-start-page'],
    descriptions: [],
    comments: [],
    responsibility: null,

    insee_code: obj.attributes['localization-insee-code'],
    department: obj.attributes.dpt,
    region: obj.attributes.region,

    // coordinates: coords,
    geoname_id: obj.attributes['geoname-id'],
    wikidata_item_id: obj.attributes['wikidata-item-id'],
    wikipedia_url: obj.attributes['wikipedia-url'],
    databnf_ark: obj.attributes['databnf-ark'],
    viaf_id: obj.attributes['viaf-id'],
    siaf_id: obj.attributes['siaf-id'],
    inha_id: inhaUuidIndex ? obj.attributes['inha-uri'].slice(inhaUuidIndex + 1) : null,
    osm_id: obj.attributes['osm-id']
  }
}

export const actions: ActionTree<PlaceCardState, RootState> = {
  clearPlaceCard ({ commit }) {
    commit('clearAll')
  },
  async fetchPlaceCard ({ commit }, id: any) {
    commit('setLoading', true)

    const response = await api.get(`/places/${id}?without-relationships&include=responsibility@flat-resp,linked-places@lp,old-labels@flat-old-label,descriptions@flat-place-desc,comments@flat-place-comment`)
    const data = response.data
    const obj = data.data

    if (obj) {
      const p = buildPlace(obj)
      // add descriptions and comments from included resources
      p.descriptions = data.included.filter((i: any) => i.type === 'place-description') || []
      p.comments = data.included.filter((i: any) => i.type === 'place-comment') || []
      // add responsibility from included resources
      p.responsibility = data.included.find((i: any) => i.type === 'responsibility') || null

      // commit the place item
      commit('setItem', p)

      const oldLabelData = data.included.filter((i: any) => i.type === 'place-old-label')
      const oldLabelItems: Array<PlaceOldLabel> = oldLabelData.map((p: any) => {
        return {
          id: p.id,
          type: p.type,
          label: p.attributes['rich-label'],
          date: p.attributes['rich-date'],
          reference: p.attributes['rich-reference']
        }
      })
      commit('setOldLabels', oldLabelItems)

      const lpData = data.included.filter((i: any) => i.type === 'place')
      const lpItems: Array<Place> = lpData.map((obj: any) => {
        // TODO: pas de coords car pas de champ longlat dans ces objets (pas retournés par l'api search)
        // const coords = buildCoords(obj)
        return {
          id: obj.id,
          type: obj.type,
          label: obj.attributes['place-label'],
          descriptions: obj.attributes.descriptions
          // comment: obj.attributes['comment'],

          // insee_code: obj.attributes['localization-insee-code']
          // coordinates: coords
        }
      })
      commit('setLinkedPlaces', lpItems)
    }

    commit('setLoading', false)
  }
}
