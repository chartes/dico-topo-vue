<template>
  <v-breadcrumbs class="overline font-weight-small" :items="items">
    <template v-slot:item="{ item }">
      <li v-if="item.tooltip">
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-breadcrumbs-item v-on="on" :href="item.href" :disabled="item.disabled">
              {{ item.text.toUpperCase() }}
            </v-breadcrumbs-item>
          </template>
          <span>{{item.tooltip}}</span>
        </v-tooltip>
      </li>
      <v-breadcrumbs-item v-else :href="item.href" :disabled="item.disabled">
        {{ item.text.toUpperCase() }}
      </v-breadcrumbs-item>
    </template>
  </v-breadcrumbs>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'AdministrativeBreadcrumbs',
  components: {},

  computed: {
    ...mapState('commune', [
      'region',
      'arrondissement',
      'canton',
      'departement',
      'commune'
    ]),
    ...mapState('PlaceCard', ['placeItem']),
    items () {
      const items = []
      // departement
      if (this.departement) {
        items.push({
          text: `${this.departement.label} (${this.departement['insee-code']}) `,
          tooltip: 'Département'
        })
      }
      // canton
      if (this.canton) {
        items.push({
          text: this.canton.label,
          tooltip: this.canton['reference-type'] === 'CTNP' ? 'Canton non précisé' : 'Canton'
        })
      }
      // commune de rattachement
      if (this.commune.data) {
        const newItem = {
          text: this.commune.data.attributes.NCCENR,
          tooltip: 'Commune'
        }
        if (this.commune.data.attributes['place-id']) {
          const route = this.$router.resolve({
            name: 'place',
            params: { placeId: this.commune.data.attributes['place-id'] }
          })
          newItem.href = route.href
        }
        items.push(newItem)
      }
      // lieu
      /*
      if (this.placeItem) {
        if (
          this.commune.data &&
          this.commune.data.attributes['place-id'] !== this.placeItem.id
        ) {
          let newItem = {
            text: this.placeItem.label,
            tooltip: 'Lieu'
          }

          const route = this.$router.resolve({
            name: 'place',
            params: { placeId: this.placeItem.id }
          })
          newItem['href'] = route.href

          items.push(newItem)
        }

      }
      */
      return items
    }
  }
}
</script>

<style scoped>
ul {
  padding-left: 2px !important;
}
.v-breadcrumbs {
  padding-top: 10px;
}
</style>
