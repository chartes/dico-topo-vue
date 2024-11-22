<template>
  <v-select :items="uniqueDepartments" filled label="Départements" dense multiple
        style="min-width: 80px; width: 360px; max-width: 360px; padding-top: 26px; margin-left: 10px "
      color="rgb(211, 47, 47)">
    <template v-slot:selection="{ item, index }">
      <v-chip v-if="index === 0">
        <span>{{ item }}</span>
      </v-chip>
      <span v-if="index === 1" class="grey--text caption"
        >(+{{ value.length - 1 }} autres)</span
      >
    </template>
  </v-select>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'DepartmentFilterMenu',
  props: {},
  data () {
    return {
      model: false,
      select: []
    }
  },
  mounted () {},
  computed: {
    ...mapState('searchParameters', []),
    ...mapState('places', {
      uniqueDepartments: 'uniqueDepartments'
    })
  },
  watch: {},
  methods: {
    ...mapActions('searchParameters', [])
  }
}
</script>

<style lang="scss" scoped>
</style>
