/* eslint-disable no-new */
import Vue from 'vue'

import store from './store/index'

// import 'leaflet/dist/leaflet.css'
import { createRouter } from '@/router'

import vuetify from './plugins/vuetify'
import VueClipboard from 'vue-clipboard2'
import VueHighlightJS from 'vue-highlightjs'

Vue.config.productionTip = true

Vue.use(VueClipboard)
Vue.use(VueHighlightJS)

new Vue({
  el: '#app',
  store,
  vuetify,
  router: createRouter()
})
