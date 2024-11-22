<template>
    <div id="vue-mirador-container" />
</template><!-- v-show="viewer -->

<script>
import { mapActions } from 'vuex'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import MiradorApp from 'mirador/dist/es/src/components/App'
import createPluggableStore from 'mirador/dist/es/src/state/createPluggableStore'

export default {
  name: 'MiradorViewer',
  components: {},
  props: {
    manifestUrl: { type: String, required: true },
    canvasIndex: { type: Number, default: 0 }
  },
  data () {
    return {
      reactRoot: null,
      miradorStore: null
      // viewer: null
    }
  },
  created () {

  },
  async mounted () {
    await this.initialize()
  },
  beforeDestroy () {
    this.reactRoot.unmount()
  },
  methods: {
    ...mapActions('searchParameters', ['setIIIFViewerAvailability']),
    async initialize () {
      try {
        const viewerContainerId = 'vue-mirador-container'
        const viewerConfig = {
          id: viewerContainerId,
          windows: [
            {
              id: 'viewerContainerId',
              loadedManifest: this.manifestUrl,
              canvasIndex: this.canvasIndex
            }
          ],
          window: {
            allowClose: false,
            allowFullscreen: false,
            allowMaximize: false,
            defaultSideBarPanel: 'info',
            defaultView: 'single',
            sideBarOpenByDefault: false,
            hideWindowTitle: true,
            maximizedByDefault: false
          },
          workspace: {
            showZoomControls: true,
            type: 'mosaic' // Which workspace type to load by default. Other possible values are "elastic"
          },
          workspaceControlPanel: {
            enabled: false
          },
          selectedTheme: 'light',
          themes: {
            light: {
              palette: {
                type: 'light',
                primary: {
                  main: '#D32F2F'
                },
                secondary: {
                  main: '#D32F2F'
                }
              }
            }
          }
        }
        this.reactRoot = ReactDOM.createRoot(document.getElementById(viewerContainerId))
        this.miradorStore = createPluggableStore(viewerConfig)
        this.reactRoot.render(
          React.createElement(
            Provider,
            { store: this.miradorStore },
            React.createElement(
              MiradorApp,
              { plugins: [] }
            )
          )
        )
        // const action = Mirador.actions.setCanvas(this.windowId, this.canvasId)
        // await this.dispatchMiradorAction(action)
      } catch (e) {
        console.warn('Mirador viewer: ', e)
      }
    },
    async dispatchMiradorAction (action) {
      this.miradorStore.dispatch(action)
    }
  },
  computed: {},
  watch: {}
}
</script>

<style lang="scss">
  #vue-mirador-container {
    height: 100%;
    position: relative;
  }
  .mosaic-tile {
    margin: 0 !important;
  }
  .mirador-window-top-bar {
    border-top: none !important;
  }
</style>
