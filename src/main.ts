/* eslint-disable no-new */
import Vue from 'vue'

import store from './store/index'

// import 'leaflet/dist/leaflet.css'
import { createRouter } from '@/router'

import vuetify from './plugins/vuetify'
import VueClipboard from 'vue-clipboard2'
import VueHighlightJS from 'vue-highlightjs'
import VueMatomo from 'vue-matomo'

Vue.config.productionTip = true

Vue.use(VueClipboard)
Vue.use(VueHighlightJS)

const router = createRouter()

const matomoUrl = process.env.VUE_APP_MATOMO_URL
const matomoSiteId = process.env.VUE_APP_MATOMO_SITE_ID
if (matomoUrl && matomoSiteId) {
  Vue.use(VueMatomo, {
    host: matomoUrl,
    siteId: parseInt(matomoSiteId, 10),
    router,
    enableLinkTracking: true
  })
}

new Vue({
  el: '#app',
  store,
  vuetify,
  router
})
