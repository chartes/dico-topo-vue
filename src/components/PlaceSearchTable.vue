<template>
  <v-data-table
    class="search-table fixed-header v-table__overflow elevation-2"
    :class="tableFullscreen ? 'fullscreen-table' : 'normal-table'"
    hide-default-header
    hide-default-footer
    fixed-header
    :headers="headers"
    :items="items"
    :server-items-length="totalItems"
    color="rgb(211, 47, 47)"
    dense
    loading="tableResultIsLoading"
    loading-text="Chargement en cours... Merci de patienter"
    no-data-text="Aucun résultat ne correspond à votre recherche."
  >
    <template v-slot:header="{ props: { headers } }">
      <div class="toggle-table-down elevation-5 grey lighten-3 text-center">
        <slot></slot>
      </div>
      <thead>
        <tr>
          <th
            v-for="(h, index) in headers"
            :key="index"
            class="overline font-weight-regular grey lighten-3"
            :class="tableFullscreen ? `fullscreen-table-th ${h.class}` : h.class"
          >
            <v-icon small v-if="h.prependIcon">{{ h.prependIcon }}</v-icon>

            <span class="mr-1">{{ h.text }}</span>
            <!--
            <group-by-widget v-if="index === 1" />
            -->
            <sort-button
              v-if="!!h.sortable"
              desc-icon="arrow_downward"
              asc-icon="arrow_upward"
              :sort-state="h.sorted"
              :action="value => toggleSortField(index, value)"
              :key="h.sorted"
            >
            </sort-button>
            <span
              v-if="!!h.sortable && h.sorted !== 'NONE'"
              small
              :ripple="false"
              text-color="primary"
              class="sortOrderNum"
              :key="h.sortKey"
            >
              {{getSortOrderOfSort(h.sortKey)}}
            </span>

            <span v-if="!!h.filter">
              <v-btn
                icon
                small
                @click="filterStates[h.value] = !filterStates[h.value]"
              >
                <v-icon
                  small
                  color="blue"
                  v-if="h.filtered"
                  >mdi-filter-menu</v-icon
                >
                <v-icon small v-else>mdi-filter</v-icon>
              </v-btn>
              <filter-result
                v-show="!!filterStates[h.value]"
                :items="h.filter"
                :on-change="h.filterCallback"
                :selection="h.filterSelection"
                :key="query + h.filter.map(f => f.value).join(',') + h.filterSelection.join(',')"
              ></filter-result>
            </span>

            <v-btn
              small
              icon
              text
              class="fullscreen-table-btn mr-3"
              v-if="index === headers.length - 1"
              @click="toggleFullscreen"
            >
              <v-icon>mdi-arrow-expand</v-icon>
            </v-btn>
          </th>
        </tr>
      </thead>
    </template>

    <template v-slot:body="{ items }">
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td class="text-center">
            <v-btn
              icon
              fab
              class="blue--text very-small"
              @click="() => selectItemWrapper(item)"
              :disabled="!item.coordinates"
            >
              <v-icon>location_on</v-icon>
            </v-btn>
          </td>
          <td v-if="!groupbyPlace" class="text-xs-left">
            <span v-html="clean(item.label)"></span>
          </td>
          <td class="text-xs-left">
            <router-link
              :to="`/places/${item.type === 'place' ? item.id : item.placeId}`"
            >
              {{ clean(item.type === "place" ? item.label : item.placeLabel) }}
            </router-link>
          </td>
          <td v-if="groupbyPlace" class="text-xs-left">
            <span v-html="clean(item.oldLabels.join(' ; '))"></span>
          </td>
          <td class="text-center">{{ item.department }}</td>
          <td class="text-xs-left">{{ item.canton }}</td>
          <td class="text-xs-left">
            <span v-html="clean(item.communeLabel)"></span>
          </td>
          <td class="text-xs-left">
            <div v-for="(description, idx) in item.descriptions" :key="idx">
              <div v-html="description"></div>
            </div>
          </td>
        </tr>
      </tbody>
    </template>

    <template v-slot:footer>
      <div v-show="!!showTable" class="fixed-agg-footer grey lighten-3">
        <span
          class="overline font-weight-regular text-xs-right d-flex justify-end mr-5"
        >
          <span v-if="!!groupbyPlace">
            <span v-show="meta.totalCount">
              Lieux {{ numAggPage * pagination.rowsPerPage + 1 }} -
              {{ numAggPage * pagination.rowsPerPage + items.length }} sur
              {{ totalItems }}
            </span>
            <v-btn icon @click="goToPageBefore" :disabled="numAggPage === 0">
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="goToPageAfter"
              :disabled="
                !meta.after ||
                  numAggPage * pagination.rowsPerPage + items.length >=
                    totalItems
              "
            >
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </span>

          <span v-else>
            <span v-show="meta.totalCount">
              Toponymes
              {{ (pagination.page - 1) * pagination.rowsPerPage + 1 }} -
              {{
                (pagination.page - 1) * pagination.rowsPerPage + items.length
              }}
              sur {{ totalItems }}
            </span>
            <v-btn
              icon
              @click="goToPageBefore"
              :disabled="pagination.page <= 1"
            >
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
            <v-btn
              icon
              @click="goToPageAfter"
              :disabled="
                (pagination.page - 1) * pagination.rowsPerPage + items.length >=
                  totalItems
              "
            >
              <v-icon>keyboard_arrow_right</v-icon>
            </v-btn>
          </span>
        </span>
      </div>
    </template>
  </v-data-table>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import SortButton from './ui/SortButton'
import FilterResult from './ui/FilterResult'
// import GroupByWidget from './ui/GroupByWidget'

import { cleanStr } from '../utils/helpers'

import Vue from 'vue'
import _ from 'lodash'

export default {
  name: 'PlaceSearchTable',
  components: { SortButton, FilterResult },
  props: {
    selectItemCallback: { type: Function }
  },
  data () {
    return {
      loading: true,
      showTable: true,

      numAggPage: 0,

      filterStates: {
        department: this.depFilter && this.depFilter.length > 0,
        canton: this.ctnFilter && this.ctnFilter.length > 0
      }
    }
  },
  mounted () {
    console.log('search table mounted')
  },
  watch: {
    term () {
      console.log('term changed')
      this.clearAll()
      this.numAggPage = 0
      this.pagination.page = 1

      this.fetchTableResults()
    },
    computedSortParam () {
      this.pagination.page = 1
      this.fetchTableResults()
    },
    computedFilterParam () {
      this.pagination.page = 1
      console.log('computed filter param', this.computedFilterParam)
      this.fetchTableResults()
    },
    groupbyPlace () {
      this.numAggPage = 0
      this.pagination.page = 1
      this.fetchTableResults()
    },
    fuzziness () {
      this.numAggPage = 0
      this.pagination.page = 1
      this.fetchTableResults()
    },
    range () {
      if (!!this.query && this.query.length > 2) {
        this.fetchTableResults()
      }
    }
  },

  methods: {
    ...mapActions('searchParameters', ['searchCallback', 'fetchTableResults']),
    clean (str) {
      return cleanStr(str)
    },
    goToPageAfter () {
      if (this.groupbyPlace) {
        if (this.meta.after) {
          console.log('goto page after', this.afterKey)
          this.fetchTableResults(this.afterKey)
          this.numAggPage += 1
        }
      } else {
        this.pagination.page += 1
        this.fetchTableResults()
      }
    },
    goToPageBefore () {
      if (this.groupbyPlace) {
        this.selectPreviousAggPage()
        console.log('goto page before', this.afterKey)
        this.fetchTableResults(this.afterKey)
        this.numAggPage += -1
      } else {
        this.pagination.page += -1
        this.fetchTableResults()
      }
    },
    selectItemWrapper (obj) {
      if (this.selectItemCallback) {
        const item = {
          id: obj.type === 'place' ? obj.id : obj.placeId,
          coordinates: [
            parseFloat(obj.coordinates[1]),
            parseFloat(obj.coordinates[0])
          ]
        }
        this.selectItemCallback(item)
        this.setFlyToItem(item)
      }
    },

    toggleSortField (headerIndex, value) {
      const header = this.headers[headerIndex]
      console.log(header, value)
      if (header.sortable) {
        if (value !== 'ASC' && value !== 'DESC') {
          this.removeSortField(header.sortKey)
        } else {
          const p = this.getSortOrder(header.sortKey)
          const sortField = {
            field: header.sortKey,
            order: value
          }
          if (p !== null) {
            this.updateSortField(sortField)
          } else {
            this.addSortField(sortField)
          }
        }
      }
    },
    async filterDepChanged (selected) {
      this.setDepFilter(selected || [])
      // await this.fetchUniqueLists()
    },
    filterCtnChanged (selected) {
      this.setCtnFilter(selected || [])
      // add the adequate department if not already present
      let newDeps = [...this.depFilter]
      let thereIsNewDep = false
      for (let ctn of selected) {
        const newDep = this.uniqueDepartments.find(d => d.id === ctn.depId)
        console.log('must add new dep ?', this.uniqueDepartments)
        // if already selected, continue
        if (newDeps.find(d => d.id === newDep.id)) {
          console.log('must add dep already present', this.depFilter, this.depFilter.find(d => d.id === newDep.id))
        } else {
          // else add it to the list
          console.log('must add !', this.depFilter, newDep)
          newDeps.push({
            ...newDep, text: newDep.label, value: newDep.id
          })
          thereIsNewDep = true
        }
      }
      if (thereIsNewDep) {
        console.log('must add dep', newDeps)
        this.filterStates.department = true
        this.filterDepChanged(newDeps)
      }
    },
    toggleFullscreen () {
      // this.unselectPlace()
      this.setTableFullscreen(!this.tableFullscreen)
    },
    ...mapActions('mapmarkers', ['setFlyToItem']),
    ...mapActions('places', [
      'fetchPlace',
      'searchPlace',
      'clearAll',
      'selectPreviousAggPage',
      'recordCurrentAggPage',
      'unselectPlace'
    ]),
    ...mapActions('searchParameters', [
      'addSortField',
      'updateSortField',
      'removeSortField',
      'setDepFilter',
      'setCtnFilter',
      'setPagination',
      'fetchUniqueLists',
      'setTableFullscreen'
    ])
  },
  computed: {
    headers () {
      const localisation = {
        text: '',
        prependIcon: 'location_on',
        align: 'center',
        value: 'icon',
        sortable: false,
        class: 'localisation-header'
      }

      const toponym = {
        text: 'Forme ancienne',
        align: 'left',
        value: 'label',
        sortable: true,
        sortKey: 'label.keyword',
        sorted: this.getSortOrder('label.keyword') || 'NONE',
        class: 'place-header'
      }
      const article = {
        text: 'Lieu',
        align: 'left',
        value: 'lieu',
        sortable: true,
        sortKey: 'place-label.keyword',
        sorted: this.getSortOrder('place-label.keyword') || 'NONE',
        class: 'place-header'
      }
      const oldLabels = {
        text: 'Formes anciennes',
        value: 'old-labels',
        align: 'left',
        sortable: false,
        class: 'old-labels-header'
      }
      const dep = {
        text: 'Dép.',
        value: 'department',
        align: 'left',
        sortable: true,
        sortKey: 'dep-id.keyword',
        sorted: this.getSortOrder('dep-id.keyword') || 'NONE',
        filter: this.uniqueDepartments,
        filtered: this.depFilter && this.depFilter.length > 0,
        filterSelection: this.depFilter,
        filterCallback: _.debounce(this.filterDepChanged, 200),
        class: 'departement-header'
      }
      const canton = {
        text: 'Canton',
        value: 'canton',
        align: 'left',
        sortable: true,
        sortKey: 'ctn-label.keyword',
        sorted: this.getSortOrder('ctn-label.keyword') || 'NONE',
        // filter cantons if deps are selected else display the full list
        filter: this.depFilter && this.depFilter.length > 0 ? this.uniqueCantons.filter(c => this.depFilter.filter(d => d.id === c.depId).length > 0) : this.uniqueCantons,
        filtered: this.ctnFilter && this.ctnFilter.length > 0,
        filterSelection: this.ctnFilter,
        filterCallback: _.debounce(this.filterCtnChanged, 200),
        class: 'canton-header'
      }
      // console.log('@@debug', this.depFilter.length > 0, this.depFilter.map(d => d.id), this.uniqueCantons.map(c => c.depId), canton.filter.map(f => f.depId))
      const commune = {
        text: 'Commune',
        align: 'left',
        value: 'commune',
        sortable: true,
        sortKey: 'commune-label.keyword',
        sorted: this.getSortOrder('commune-label.keyword') || 'NONE',
        class: 'commune-header'
      }
      const desc = {
        text: 'Description',
        value: 'description',
        align: 'left',
        sortable: false,
        class: 'description-header'
      }
      if (this.groupbyPlace) {
        return [localisation, article, oldLabels, dep, canton, commune, desc]
      } else {
        return [localisation, toponym, article, dep, canton, commune, desc]
      }
    },
    items () {
      return this.placeItems ? Array.from(this.placeItems.values()) : []
    },
    totalItems () {
      return this.meta && this.meta.totalCount ? this.meta.totalCount : 0
    },

    afterKey () {
      return this.meta.after ? Object.values(this.meta.after).join(',') : null
    },
    ...mapState('places', {
      placeItems: 'items',
      meta: 'meta',
      selectedPlace: 'selectedItem',
      afterHistory: 'afterHistory',
      uniqueDepartments: 'uniqueDepartments',
      uniqueCantons: 'uniqueCantons',
      tableResultIsLoading: 'isLoading'
    }),
    ...mapState('searchParameters', [
      'sortFields',
      'fuzziness',
      'groupbyPlace',
      'depFilter',
      'ctnFilter',
      'range',
      'term',
      'tableFullscreen'
    ]),
    ...mapState('searchParameters', { storedPagination: 'pagination' }),
    ...mapGetters('searchParameters', [
      'computedSortParam',
      'computedRangeParam',
      'computedFilterParam',
      'getSortOrder',
      'getSortOrderOfSort',
      'query'
    ]),
    pagination: {
      get () {
        return this.storedPagination
      },
      set (value) {
        this.setPagination(value)
      }
    }
  }
}
</script>

<style lang="scss">
.sortOrderNum {
  color: rgb(38, 123, 219);
  font-weight: bold;
  position: relative;
  left: -10px;
  top: 6px
}

.localisation-header {
   min-width: 60px;
  text-align: center !important;
}
.place-header {
  width: 230px;
  min-width: 170px;
}
.old-labels-header {
  min-width: 200px;
  width: 550px;
}
.departement-header {
  min-width: 145px !important;
}
.canton-header {
  min-width: 170px;
}
.commune-header {
  min-width: 150px;
}
.description-header {
  width: 480px;
  min-width: 240px;
}
.very-small {
  height: 26px !important;
  width: 26px !important;
}
dfn {
  font-style: normal !important;
}
.fullscreen-table-btn {
  position: absolute;
  right: 0px;
  clear: both;
  top: 2px;
}

.fullscreen-table {
  position: absolute;
  height: 100% !important;
  width: 100%;
}

.fullscreen-table-th {
  height: 64px !important;
}
.normal-table {
  position: fixed;
  bottom: 0;
  height: 40%;
  width: 100%;
}

.search-table tr:nth-of-type(odd) {
   background-color: rgba(0, 0, 0, .02);
 }

.search-table tr td{
  padding-top: 1px !important;
  padding-bottom: 3px !important;
 }

.fixed-agg-footer {
  position: initial;
  bottom: 0;
  width: 100%;
  border: 1px solid grey;
  box-sizing: border-box !important;
  -moz-box-sizing: border-box !important;
  -webkit-box-sizing: border-box !important;
}

.toggle-table-down {
  position: absolute;
  top: -26px;
  left: calc(50% - 35px);
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
}

.sc {
  font-variant: small-caps;
}

/* Theme */
.fixed-header {
  display: flex;
  flex-direction: column;
}

.fixed-header th {
  position: sticky;
  top: 0;
  z-index: 5;
  color: black !important;
}

.fixed-header th:after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
}

.fixed-header tr.v-datatable__progress th {
  height: 1px;
}

.v-data-table__empty-wrapper {
  height: 250px;
}

.fixed-header .v-table__overflow {
  flex-grow: 1;
  flex-shrink: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
.v-data-table--fixed-header .v-data-table__wrapper {
  height: 100%;
}

.fixed-header .v-datatable.v-table {
  flex-grow: 0;
  flex-shrink: 1;
}

.fixed-header .v-datatable.v-table .v-datatable__actions {
  flex-wrap: nowrap;
}

.fixed-header
  .v-datatable.v-table
  .v-datatable__actions
  .v-datatable__actions__pagination {
  white-space: nowrap;
}

.two-columns {
  margin-left: 10px;
  columns: 3;
  -webkit-columns: 3;
  -moz-columns: 3;
}
</style>
