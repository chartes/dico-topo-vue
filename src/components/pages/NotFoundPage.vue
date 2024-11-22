<template>
  <default-layout>
    <v-container fluid>
      <span class="title text-xs-center red--text darken-2">Page non trouvée</span>
    </v-container>
  </default-layout>
</template>

<script>
import DefaultLayout from '../DefaultLayout'

export default {
  name: 'NotFoundPage',
  components: { DefaultLayout }
}
</script>

<style scoped>
  span {
    margin: 20px;
  }
</style>
