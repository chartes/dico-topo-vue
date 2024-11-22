<template>
  <v-app-bar app>
    <v-toolbar-title
      class="headline text-uppercase mr-5"
      @click="$router.push({ name: 'landing' })"
      style="cursor: pointer; "
    >
      <img
        src="@/assets/logo-dicotopo-cut.png"
        height="55px"
        style="padding-top: 8px; padding-left: 18px"
      />
    </v-toolbar-title>

    <v-text-field
      type="text"
      placeholder="Ex. Saint-Simon"
      v-model="inputTerm"
      style="min-width: 80px; width: 360px; max-width: 360px; padding-top: 26px; margin-left: 10px "
      class="search-input"
      color="rgb(211, 47, 47)"
      @keyup.enter.native="onSearchEventPressEnter"
      :disabled="tableResultIsLoading || mapIsLoading"
      :loading="tableResultIsLoading || mapIsLoading"
      :autofocus="autofocusOnCurrentRoute"
      dense
      filled
      clearable
    >
      <template v-slot:append>
        <v-icon  @click="onSearchEventPressEnter" color="rgb(211, 47, 47)" class="search-icon">search</v-icon>
      </template>
    </v-text-field>

    <span v-if="showFilters" class="toolbar-buttons">

      <group-by-widget />
      <fuzziness-widget />
      <!--
      <department-filter-menu />
      -->
       <v-chip
      v-show="!!meta && $router.currentRoute.name === 'home'"
      class="total-count subheading grey--text text--darken-2 ml-3 mr-2"
    >
      {{ meta.totalCount }}
    </v-chip>
    </span>

    <v-spacer></v-spacer>

    <v-btn text to="/contact" class="mr-2 menu-btn"  color="grey darken-2">
      <span class="pr-2 pl-2">Contact</span>
    </v-btn>

    <v-btn text to="/documentation" class="menu-btn" color="grey darken-2">
      <span class="pr-2 pl-2" >API</span>
      <v-icon>mdi-code-braces</v-icon>
    </v-btn>

    <v-navigation-drawer
      v-model="drawer"
      absolute
      right
      temporary
    >
      <v-list
        nav
        dense
        class="fill-height"
      >
        <v-list-item>
          <v-list-item-title>
            <v-btn text to="/contact" class="mr-2"  color="grey darken-2">
              <span class="pr-2 pl-2">Contact</span>
            </v-btn>
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>
            <v-btn text to="/documentation" color="grey darken-2">
              <span class="pr-2 pl-2" >API</span>
              <v-icon>mdi-code-braces</v-icon>
            </v-btn>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>

  </v-app-bar>
</template>text

<script>
import { mapState, mapGetters, mapActions } from 'vuex'
// import DepartmentFilterMenu from '../DepartmentFilterMenu'
import GroupByWidget from '../ui/GroupByWidget'
import FuzzinessWidget from '../ui/FuzzinessWidget'

export default {
  name: 'MainToolbar',
  props: {
    showTimeRange: { type: Boolean, default: false },
    showFilters: { type: Boolean, default: false }
  },
  components: { GroupByWidget, FuzzinessWidget },
  data () {
    return {
      inputTerm: undefined,
      showDepartmentFilterMenu: false,
      selectedTimeRange: [],
      drawer: false
    }
  },
  mounted () {
    this.inputTerm = this.term
  },
  methods: {
    ...mapActions('searchParameters', ['searchCallback']),
    onSearchEventPressEnter () {
      if (this.inputTerm) {
        if (!this.search) {
          if (this.$router.currentRoute.name !== 'home') {
            this.$router.push({ name: 'home' })
          }
        }
      }
      this.setTerm(this.inputTerm)
      if (this.inputTerm && this.inputTerm.length > 2) { this.searchCallback() }
    },
    ...mapActions('searchParameters', [
      'setTerm',
      'setRange',
      'removeRange'
    ])
  },
  watch: {
    term () {
      this.searchCallback()
    },
    computedFilterParam () {
      this.searchCallback()
    },
    fuzziness () {
      this.searchCallback()
    },
    selectedTimeRange () {
      if (this.$props.showTimeRange && this.selectedTimeRange.length === 2) {
        const newRange = {
          key: 'text-date',
          operators: [
            `gte:${this.selectedTimeRange[0]}`,
            `lte:${this.selectedTimeRange[1]}`
          ]
        }
        this.setRange(newRange)
      }
    },
    knownYears () {
      if (this.selectedTimeRange.length === 0 && this.knownYears.length >= 2) {
        console.log('KY', this.knownYears)
        const lowerBound = this.knownYears[0].year
        const upperBound = this.knownYears[this.knownYears.length - 1].year
        this.selectedTimeRange = [lowerBound, upperBound]
      }
    },
    range (oldVal, newVal) {
      if (this.$props.showTimeRange) {
        if (
          oldVal !== newVal &&
          !!this.inputTerm &&
          this.inputTerm.length > 2
        ) {
          this.searchCallback()
        }
      }
    },
    group () {
      this.drawer = false
    }
  },
  computed: {
    ...mapState('places', {
      meta: 'meta',
      knownYears: 'knownYears',
      tableResultIsLoading: 'isLoading'
    }),
    ...mapState('mapmarkers', {
      mapIsLoading: 'isLoading'
    }),
    ...mapState('searchParameters', [
      'term',
      'minTermLength',
      'range',
      'fuzziness'
    ]),
    ...mapGetters('searchParameters', [
      'computedFilterParam',
      'computedRangeParam'
    ]),
    timeFilterData () {
      const lowerBound = this.knownYears[0].year
      const upperBound = this.knownYears[this.knownYears.length - 1].year

      return {
        labels: this.knownYears.map(() => ''),
        datasets: [
          {
            backgroundColor: '#d32f2f',
            data: this.knownYears.map(y => y.count),
            _meta: {
              start: lowerBound,
              end: upperBound,
              selectionStart: this.selectedTimeRange[0],
              selectionEnd: this.selectedTimeRange[1]
            }
          }
        ]
      }
    },
    autofocusOnCurrentRoute () {
      return this.$route.name === 'home'
    }
  }
}
</script>

<style >
html {
  background: lightgrey;
}

/*
body:after {
  z-index: 100000;
  content: "beta";
  position: fixed;
  width: 100px;
  height: 28px;
  background: #ee8e4a;
  top: 7px;
  left: -28px;
  text-align: center;
  font-size: 13px;
  font-family: sans-serif;
  text-transform: uppercase;
  font-weight: bold;
  color: #fff;
  line-height: 30px;
  -ms-transform: rotate(-45deg);
  -webkit-transform: rotate(-45deg);
  transform: rotate(-45deg);
}

.toolbar-buttons {
  display: flex;
  line-height: 32px;
  position: relative;
  left: 30px;
}
*/

.toolbar-buttons span {
  display: inline-block;
  vertical-align: middle;
}

.toolbar-buttons span.fuzziness {
  margin-right: 0;
}

.search-bar {
  cursor: pointer;
  color:brown;
}

.v-btn.v-app-bar__nav-icon {
  display: none !important;
}

/* Burger + menu */
.v-navigation-drawer,
.v-overlay--absolute {
  display: none;
}

@media screen and (max-width: 1160px) {
  /* Burger + menu */
  .v-btn.v-app-bar__nav-icon {
    display: inline-block !important;
    margin-right: 10px !important;
  }
  .v-navigation-drawer--temporary {
    z-index: 12;
  }
  .v-navigation-drawer,
  .v-overlay--absolute {
    display: block;
    margin-top: 65px;
    height: calc( 100vh - 65px ) !important;
  }
  .home-page .v-navigation-drawer,
  .home-page .v-overlay--absolute {
    margin-top: 65px;
    height: calc( 100vh - 65px ) !important;
  }
  .v-btn.menu-btn {
    display: none !important;
  }
}

@media screen and (max-width: 1000px) {
  .v-app-bar {
    height: auto !important;
    max-width: 100vw !important;
  }
  .v-app-bar > div {
    z-index: 100;
    flex-wrap: wrap;
    height: auto !important;
    padding: 4px 0 !important;
  }
  .v-app-bar > div > *:last-child {
    margin-right: 20px;
  }
  .toolbar-buttons {
    width: 100%;
    order: 5;
  }
  .toolbar-buttons span.groupBy {
    margin-right: 30px;
  }
  .fuzziness .v-label {
    margin-left: 2px !important;
    margin-right: 2px !important;
  }
  .total-count {
    display: none;
    order: 6;
  }
  .v-label {
    font-size: 13px;
  }
  .v-chip.v-size--default {
    font-size: 10px;
  }
  .search-input {
    margin: 5px 0 0 !important;
    padding-top: 0 !important;
    width: calc( 100% - 180px ) !important;
    max-width: 100% !important;
  }
  .v-text-field.v-text-field--enclosed .v-text-field__details {
    display: none;
    margin-bottom: 0 !important;
  }
  /* Burger + menu */
  .v-navigation-drawer,
  .v-overlay--absolute {
    margin-top: 72px;
    height: calc( 100vh - 72px ) !important;
  }
  .home-page .v-navigation-drawer,
  .home-page .v-overlay--absolute {
    margin-top: 110px;
    height: calc( 100vh - 110px ) !important;
  }
}

@media screen and (max-width: 760px) {
  /* Burger + menu */
  .v-navigation-drawer,
  .v-overlay--absolute {
    margin-top: 69px;
    height: calc( 100vh - 69px ) !important;
  }
  .home-page .v-navigation-drawer,
  .home-page .v-overlay--absolute {
    margin-top: 108px;
    height: calc( 100vh - 108px ) !important;
  }
}

@media screen and (max-width: 400px) {
  .toolbar-buttons {
    display: flex;
  }
  .toolbar-buttons span {
    line-height: 1.1;
  }
  .toolbar-buttons span.groupBy {
    margin-right: 26px;
  }
  .fuzziness .v-input__slot {
    min-width: 100px;
  }

}

</style>
