<template>
  <l-map
    v-resize="onResize"
    class="l-map"
    ref="map"
    :options="options"
  >
  </l-map>
</template>

<script>
import { mapState } from 'vuex'
import { LMap } from 'vue2-leaflet'
import 'geoportal-extensions-leaflet'

import 'leaflet/dist/leaflet.css'

import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'

import iconIdle from '../../src/assets/marker-icon-2x-blue.png'
import iconRed from '../../src/assets/marker-icon-2x-red.png'
import iconShadow from '../../src/assets/marker-shadow.png'

const idleIcon = new L.Icon({
  iconUrl: iconIdle,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

const redIcon = new L.Icon({
  iconUrl: iconRed,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
})

require('leaflet.heat')

export default {
  name: 'MyAwesomeMap',
  components: {
    LMap
  },
  props: {
    mapmarkerItems: { type: Array, default: () => [] },
    onMarkerClick: { type: Function },
    onMapClick: { type: Function },
    useMarkers: { type: Boolean, default: true },
    useHeatmap: { type: Boolean, default: true },
    useFlyAnimation: { type: Boolean, default: false },
    minHeight: { type: String, default: '100px' },
    minWidth: { type: String, default: '100px' },
    /* now set in each map layer options :
    maxZoom: { type: Number, default: 17 },
    minZoom: { type: Number, default: 6 }, */
    initialZoom: { type: Number, default: 6 },
    initialCenter: { type: Object, default: undefined },
    savePosition: { type: Boolean, default: false },
    fullMap: { type: Boolean, default: true }
  },
  data () {
    return {
      switchableControl: null,
      markerLayer: null,
      heatLayer: null,
      options: {
        zoomSnap: 0,
        zoomDelta: 1.0
      }
    }
  },
  created () {
    L.Marker.prototype.options.icon = idleIcon
  },
  beforeRouteUpdate (_to, _from, next) {
    this.init()
    next()
  },
  mounted () {
    // console.log(`autoconf: ${process.env.BASE_URL}autoconf-https.json`)
    this.init()
  },
  methods: {
    onResize () {
      this.map._onResize()
    },
    init () {
      this.map.eachLayer(function (layer) {
        this.map.removeLayer(layer)
      })

      this.map.createPane('IGN')
      this.map.createPane('OSM')
      this.map.getPane('OSM').style.zIndex = 250
      this.map.getPane('IGN').style.zIndex = 200

      this.markerLayer = L.markerClusterGroup({
        showCoverageOnHover: false
      })

      this.map.addLayer(this.OSMLayer)
      // this.map.addLayer(this.CASSINILayer)
      this.map.addLayer(this.EtatMajorIGNLayer)
      this.map.addLayer(this.ParcellesCadastrales20082013IGNLayer)
      this.map.addLayer(this.TopoIGNLayer)

      this.map.addLayer(this.markerLayer)

      if (this.useHeatmap) {
        this.heatLayer = L.heatLayer([], {
          radius: 22,
          blur: 12,
          minOpacity: 0.25
        })
        // this.map.addLayer(this.heatLayer)
        this.toggleMarkerLayer()
        this.map.on('zoomend', this.toggleMarkerLayer)
      }

      this.switchableControl = L.geoportalControl.LayerSwitcher({
        layers: this.switchableLayers
      })
      this.map.addControl(this.switchableControl)

      if (this.onMapClick) {
        this.map.on('click', this.onMapClick)
      }

      this.setMarkers(this.mapmarkerItems)
      // this.map.setMaxBounds(this.map.getBounds())

      if (this.initialCenter) {
        this.flyToCoordinates(this.initialCenter)
      }
      if (this.initialZoom) {
        this.map.setZoom(this.initialZoom)
      }
      // if (this.selectedItem) {
      //  this.flyToCoordinates(this.selectedItem.coords)
      // }
      this.map.on('zoomend', this.saveZoom)
      this.map.on('dragend', this.saveZoom)

      this.saveZoom()

      console.log(this.map.getPanes())
    },
    addMarkers (markers) {
      const newMarkers = []
      for (const m of markers) {
        if (this.useMarkers) {
          const newMarker = L.marker(m.coordinates)
          newMarker.placeId = m.id
          if (m.label) {
            newMarker.bindTooltip(m.label, {
              direction: 'right',
              offset: L.point({ x: 16, y: -24 })
            })
          }

          if (this.onMarkerClick) {
            newMarker.on('click', () => {
              this.selectMarkerIcon(newMarker)
              this.onMarkerClick({ id: m.id, coordinates: m.coordinates })
            })
          }
          if (m.active) {
            this.selectMarkerIcon(newMarker)
          }
          newMarkers.push(newMarker)
        }
      }

      if (this.useMarkers) {
        this.markerLayer.addLayers(newMarkers)
        // console.log('add marker layer with markers', newMarkers)
      }
      if (this.useHeatmap) {
        const ll = markers.map(m => m.coordinates)
        if (this.heatLayer) {
          if (this.map.hasLayer(this.heatLayer)) {
            this.heatLayer.setLatLngs(ll)
          } else {
            this.heatLayer._latlngs = ll
          }
        }
      }
    },
    clearMarkers () {
      console.log('clear markers')
      // clear the heat map markers
      // using a trick to not trigger .redraw when the layer is not on the map
      if (this.heatLayer) {
        if (this.map.hasLayer(this.heatLayer)) {
          this.heatLayer.setLatLngs([])
        } else {
          this.heatLayer._latlngs = []
        }
      }
      // clear the place markers
      this.markerLayer.clearLayers()
    },
    selectMarkerIcon (marker) {
      this.markerLayer.eachLayer(m => {
        m.setIcon(idleIcon)
      })
      if (marker) {
        marker.setIcon(redIcon)
      }
    },
    setMarkers (markers) {
      this.clearMarkers()
      this.addMarkers(markers)
    },
    toggleMarkerLayer () {
      if (this.map) {
        if (this.map.getZoom() < 10) {
          this.map.removeLayer(this.markerLayer)
          if (!this.map.hasLayer(this.heatLayer)) {
            this.map.addLayer(this.heatLayer)
          }
        } else {
          this.map.removeLayer(this.heatLayer)
          if (!this.map.hasLayer(this.markerLayer)) {
            this.map.addLayer(this.markerLayer)
          }
        }
        if (this.map.hasLayer(this.heatLayer)) {
          this.heatLayer.redraw()
        }
      }
    },
    flyToCoordinates (coords, animation = false) {
      if (coords) {
        const latlgns = L.latLng(coords)
        const currentZoom = this.map.getZoom()
        const targetZoom = currentZoom > 13 ? currentZoom : 13
        if (this.useFlyAnimation || animation) {
          this.map.flyTo(latlgns, targetZoom, { easeLinearity: 0.8, duration: 1.0 })
        } else {
          console.log('pan to', coords, latlgns)
          // this.map.panTo(latlgns)
          this.map.panTo(latlgns)
        }
        this.saveZoom()
      }
    },
    saveZoom () {
      if (this.map && this.savePosition) {
        this.$store.dispatch('searchParameters/saveZoom', {
          zoom: this.map.getZoom(),
          center: this.map.getCenter()
        })
      }
    }
  },
  computed: {
    ...mapState('mapmarkers', {
      mapmarkerLoading: 'isLoading',
      flyToItem: 'flyToItem'
    }),
    ...mapState('places', ['selectedItem']),
    ...mapState('searchParameters', ['zoom', 'center']),
    OSMLayer () {
      return L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        pane: 'OSM',
        minZoom: 6,
        maxZoom: 20
      })
    },
    TopoIGNLayer () {
      return L.tileLayer('https://data.geopf.fr/private/wmts?' +
            '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
            '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
            '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}' +
            '&apikey=ign_scan_ws',
      {
        ignApiKey: process.env.VUE_APP_IGN_SCAN25_API_KEY,
        ignLayer: 'GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN25TOUR',
        style: 'normal',
        format: 'image/jpeg',
        service: 'WMTS',
        opacity: 1,
        pane: 'IGN',
        minZoom: 6,
        maxZoom: 16
      })
    },
    EtatMajorIGNLayer () {
      return L.tileLayer('https://data.geopf.fr/wmts?' +
            '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
            '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
            '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
      {
        ignLayer: 'GEOGRAPHICALGRIDSYSTEMS.ETATMAJOR40',
        style: 'normal',
        format: 'image/jpeg',
        service: 'WMTS',
        opacity: 1,
        pane: 'IGN',
        minZoom: 6,
        maxZoom: 15
      })
    }, // ignApiKey: 'cartes',
    ParcellesCadastrales20082013IGNLayer () {
      return L.tileLayer('https://data.geopf.fr/wmts?' +
            '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
            '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
            '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
      {
        ignLayer: 'CADASTRALPARCELS.HISTO.2008-2013.PARCELS',
        style: 'bdparcellaire',
        format: 'image/png',
        service: 'WMTS',
        opacity: 1,
        pane: 'IGN',
        minZoom: 6,
        maxZoom: 20
      })
    }, // ignApiKey: 'parcellaire',
    CASSINILayer () {
      return L.tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?' +
            '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
            '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
            '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
      {
        ignApiKey: process.env.VUE_APP_IGN_CASSINI_API_KEY,
        ignLayer: 'GEOGRAPHICALGRIDSYSTEMS.CASSINI',
        style: 'normal',
        format: 'image/jpeg',
        service: 'WMTS',
        opacity: 1,
        pane: 'IGN'
      })
    },

    switchableLayers () {
      const layers = [
        {
          layer: this.OSMLayer,
          config: {
            title: 'Open Street Map',
            description: 'Couche Open Street Maps'
          }
        },
        /* {
          layer: this.CASSINILayer,
          config: {
            title: 'Carte de Cassini',
            description: 'Fond de carte Cassini'
          }
        }, */
        {
          layer: this.ParcellesCadastrales20082013IGNLayer,
          config: {
            title: 'Parcelles cadastralles 2008-2013',
            description: 'Parcelles cadastralles 2008-2013'
          }
        },
        {
          layer: this.EtatMajorIGNLayer,
          config: {
            title: 'Etat major 40',
            description: 'Carte de l\'etat-major 1 : 40 000 (1820-1866)'
          }
        },
        {
          layer: this.TopoIGNLayer,
          config: {
            title: 'Carte topographique IGN',
            description: 'Carte topographique IGN'
          }
        }
      ]
      if (this.useHeatmap && this.heatLayer) {
        layers.push({
          layer: this.heatLayer,
          config: {
            title: 'Densité toponymique',
            description: 'Carte de densité des toponymes'
          }
        })
      }
      return layers
    },
    autoconfFile () {
      return `${process.env.BASE_URL}autoconf${
        location.protocol === 'https:' ? '-https' : ''
      }.json`
    },
    map () {
      return this.$refs.map.mapObject
    }
  },
  watch: {
    mapmarkerItems () {
      this.setMarkers(this.mapmarkerItems)
    },
    mapmarkerLoading () {
      if (this.mapmarkerLoading) {
        this.clearMarkers()
      }
    },
    flyToItem (val) {
      if (val) {
        this.flyToCoordinates(this.flyToItem.coordinates, true)
        const marker = this.markerLayer
          .getLayers()
          .find(l => l.placeId === this.flyToItem.id)
        this.selectMarkerIcon(marker)
      }
    },
    selectedItem (val) {
      if (!val) {
        this.selectMarkerIcon()
      }
    }
  }
}
</script>

<style>
.l-map {
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  background-color: lightgrey;
}

</style>
