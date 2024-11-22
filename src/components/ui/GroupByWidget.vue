<template>
  <!-- // version pour le tableau de resulta
  <v-tooltip top>
    <template v-slot:activator="{ on }">
      <v-switch class="mr-3" v-model="groupByOption" dense inset> </v-switch>
    </template>
    <span
      >Les résultats de la recherche ne sont pas groupés par lieu identifié mais
      par forme toponymique</span
    >
  </v-tooltip>
 !-->
  <span class="groupBy">
     <v-checkbox v-model="groupByOption" color="red darken-2">
      <template v-slot:label>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <span v-on="on">Regrouper par lieu</span>
          </template>
          <span
            >Les résultats de la recherche sont groupés par lieu
            identifié</span
          >
        </v-tooltip>
      </template>
    </v-checkbox>
  </span>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'GroupByWidget',
  data () {
    return {
      groupByOption: this.groupbyPlace
    }
  },
  mounted () {
    this.groupByOption = this.groupbyPlace
  },
  computed: {
    ...mapState('searchParameters', ['groupbyPlace'])
  },
  watch: {
    groupByOption () {
      this.setGroupbyPlace(this.groupByOption)
    }
  },
  methods: {
    ...mapActions('searchParameters', ['setGroupbyPlace'])
  }
}
</script>

<style lang="scss" scoped>
.groupBy {
  margin-right: 42px;
  .v-input {
    margin: 0px;
    position: relative;
    height: 10px;
    top: 5px;
    left: 12px;
    display: inline-flex;
  }
}

</style>
