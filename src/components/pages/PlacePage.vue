<template>
  <default-layout>
    <section class="mb-10">
      <v-container fluid grid-list-md>

        <v-row class="place-page-layout" dense>
          <v-col>
            <place-card
              v-show="placeItem"
              :place-id="placeId"
              :key="placeId"
              :popup="false"
            >
            </place-card>
            <v-card v-if="placeItem" class="mt-4">
              <div
                v-if="
                  placeItem.databnf_ark ||
                    placeItem.geoname_id ||
                    placeItem.viaf_id ||
                    placeItem.inha_id ||
                    placeItem.wikidata_item_id ||
                    placeItem.wikipedia_url ||
                    placeItem.osm_id
                "
                class="mb-2"
              >
                <v-card-title class="headline  grey lighten-4">
                  Sur le web
                </v-card-title>

                <ul class="pa-8">
                  <li class="d-flex justify-space-between  mb-4">
                    <span class="overline">Site</span>
                    <span class="overline">Identifiant</span>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.databnf_ark"
                  >
                    <a
                      :href="`https://data.bnf.fr/${placeItem.databnf_ark}`"
                      target="_blank"
                      >data.bnf.fr</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.databnf_ark
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.insee_code"
                  >
                    <a
                      :href="`https://www.insee.fr/fr/recherche/recherche-geographique?geo=COM-${placeItem.insee_code}`"
                      target="_blank"
                      >Insee</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.insee_code
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between mt-2 mb-4"
                    v-if="placeItem.geoname_id"
                  >
                    <a
                      :href="`http://www.geonames.org/${placeItem.geoname_id}`"
                      target="_blank"
                      >GeoNames</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.geoname_id
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.viaf_id"
                  >
                    <a
                      :href="`https://viaf.org/viaf/${placeItem.viaf_id}`"
                      target="_blank"
                      >VIAF</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.viaf_id
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.wikipedia_url"
                  >
                    <a :href="placeItem.wikipedia_url" target="_blank"
                      >Wikipédia</a
                    >
                    <v-chip small label class="ml-4">{{
                      decodeURI(placeItem.wikipedia_url)
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.wikidata_item_id"
                  >
                    <a
                      :href="
                        `https://www.wikidata.org/wiki/${placeItem.wikidata_item_id}`
                      "
                      target="_blank"
                      >Wikidata</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.wikidata_item_id
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.siaf_id"
                  >
                    <a
                      :href="
                        `https://francearchives.fr/fr/location/${placeItem.siaf_id}`
                      "
                      target="_blank"
                      >France Archives</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.siaf_id
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.inha_id"
                  >
                    <a
                      :href="
                        `https://agorha.inha.fr/recherche?terms=concept_lieu:%22${placeItem.inha_id}%22`
                      "
                      target="_blank"
                      >Agorha</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.inha_id
                    }}</v-chip>
                  </li>
                  <li
                    class="d-flex justify-space-between  mb-4"
                    v-if="placeItem.osm_id"
                  >
                    <a
                      :href="
                        `https://www.openstreetmap.org/relation/${placeItem.osm_id}`
                      "
                      target="_blank"
                      >OpenStreetMap</a
                    >
                    <v-chip small label class="ml-4">{{
                      placeItem.osm_id
                    }}</v-chip>
                  </li>
                </ul>
              </div>

              <v-card-title class="headline grey lighten-4 mb-5">
                Partager
              </v-card-title>

              <p class="pa-5 pb-0">
                 Vous pouvez citer ce lieu dans vos travaux en copiant le permalien ci-dessous ou exporter les données en utilisant les boutons suivants :
              </p>

              <v-row class="share pa-8 pt-0">
                <v-col class="mb-2" md="auto">
                  <span class="overline">Citer</span>
                  <div>
                     <v-tooltip top v-model="showCopyTooltip" :open-on-hover="false" :open-on-click="false" :close-delay="1500">
                      <template v-slot:activator>
                        <v-btn text depressed
                          class="share-link mt-3"

                          v-clipboard:copy="`${shareLink}`"
                          v-clipboard:success="copyLink"
                        >
                          {{shareLink}}
                        </v-btn>
                      </template>
                      <span
                        >Lien copié !</span
                      >
                    </v-tooltip>

                  </div>
                </v-col>
                <v-col class="mb-2 download">
                    <span class="overline">Télécharger</span>
                    <div class="mb-2  mt-3">
                      <v-btn
                        depressed
                        :href="`${apiUrl}/places/${placeId}`"
                      >
                        Au format <a href="https://jsonapi.org/format/1.0/">JSON API 1.0</a>
                        <v-icon class="ml-3">get_app</v-icon>
                      </v-btn>
                    </div>
                    <div class="mb-2 ml-5">
                      <v-btn
                        depressed
                        :href="
                          `${apiUrl}/places/${placeItem.id}?export=linkedplaces`
                        "
                      >
                        Au format  <a href="https://github.com/LinkedPasts/linked-places">LinkedPlaces</a>
                         <v-icon class="ml-3">get_app</v-icon>
                      </v-btn>
                    </div>
                 </v-col>
              </v-row>
            </v-card>
          </v-col>

          <v-col v-if="(IIIFAvailability && showIIIFViewer) || coordinates.length > 0">
            <transition name="scroll-x-transition">
              <v-card class="mb-2 map-container" v-if="commune && coordinates.length > 0" v-show="!showIIIFViewer || !IIIFAvailability">
                <my-awesome-map
                  min-height="800px"
                  :use-heatmap="false"
                  :use-markers="true"
                  :initial-zoom="10"
                  :initial-center="{ lat: coordinates[0], lng: coordinates[1] }"
                  :save-position="false"
                  :mapmarker-items="mapItems"
                  :full-map="false"
                />
              </v-card>
            </transition>
            <transition name="scroll-x-transition">
              <mirador-viewer
                class="mirador-container"
                v-if="IIIFAvailability && showIIIFViewer"
                :manifest-url="manifestUrl"
                :canvasIndex="canvasIndex"
              />
            </transition>
          </v-col>
        </v-row>
      </v-container>
    </section>
  </default-layout>
</template>

<script>

import { mapState, mapActions, mapGetters } from 'vuex'
import DefaultLayout from '../DefaultLayout'
import { cleanStr } from '../../utils/helpers'
import MiradorViewer from '../MiradorViewer'

export default {
  name: 'PlacePage',
  props: ['placeId'],
  components: {
    DefaultLayout,
    MiradorViewer,
    MyAwesomeMap: () => import(/* webpackChunkName: "map-component" */ '../MyAwesomeMap'),
    PlaceCard: () => import(/* webpackChunkName: "card-component" */ '../PlaceCard')
  },
  data: () => {
    return {
      showCopyTooltip: false
    }
  },
  created () {
    this.setIIIFViewerVisibility(false)
  },
  mounted () {
    if (this.IIIFAvailability && this.coordinates.length === 0) {
      this.setIIIFViewerVisibility(true)
    }
  },
  methods: {
    ...mapActions('places', ['selectPlace', 'unselectPlace']),
    ...mapActions('searchParameters', ['setIIIFViewerVisibility']),

    clean (str) {
      return cleanStr(str)
    },
    buildCoords (obj) {
      const longlat = obj.attributes.longlat
      const srcCoords = longlat
        ? longlat.substr(1, longlat.length - 2).split(',')
        : []

      if (srcCoords.length > 0) {
        return [parseFloat(srcCoords[1].trim()), parseFloat(srcCoords[0].trim())]
      }
      return []
    },
    copyLink () {
      this.showCopyTooltip = !this.showCopyTooltip
    }
  },
  watch: {

  },
  computed: {
    ...mapState('PlaceCard', ['placeItem', 'placeOldLabels', 'linkedPlaces']),
    ...mapState('commune', { commune: 'commune' }),
    ...mapState('bibls', { biblItem: 'bibl' }),
    ...mapState('searchParameters', ['showIIIFViewer']),
    ...mapGetters('PlaceCard', ['canvasIndex', 'IIIFAvailability', 'manifestUrl']),
    shareLink () {
      return window.location.href
    },
    coordinates () {
      return this.commune && this.commune.data
        ? this.buildCoords(this.commune.data)
        : []
    },
    mapItems () {
      return this.placeItem
        ? [
            {
              id: this.placeItem.id,
              coordinates: this.coordinates,
              active: true
            }
          ]
        : []
    },
    apiUrl () {
      return process.env.VUE_APP_API_BASE_URL
    }
  }
}
</script>

<style scoped lang="scss">
.map-container {
  width: 100%;
  height: 100%;
  max-height: 1200px;
}
.mirador-container {
  min-height: 800px;
  max-height: 1200px;
}
.place-page-layout {
  min-height: 1000px;
}

.share {
  .v-btn {
    font-weight: normal;
    text-transform: initial;
    width: 250px;
  }
  .share-link {
    color: black;
    padding: 6px;
    padding-left: 10px;
    padding-right: 10px;
    width: 100%;
    font-family: monospace, monospace;
    font-weight: normal !important;
    display: inline-block;
    border-radius: 3px;
    background-color: #f5f5f5;
  }
  .download {
    text-align: right;
  }
}

@media screen and (max-width: 760px) {
  .v-main.v-content {
    .row.place-page-layout {
      flex-direction: column-reverse !important;
      margin-top: 20px !important;
      .headline {
        font-size: 1.25em !important;
      }
    }
    .row.place-page-layout .map-container {
      height: 40vh !important;
    }
    .share-link {
      white-space: normal;
      text-align: left;
      line-height: 1.2;
      font-size: 0.75rem;
    }
  }
}

</style>
