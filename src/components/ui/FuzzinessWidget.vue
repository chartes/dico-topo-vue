<template>
    <span class="fuzziness">
        <v-slider
        v-model="model"
        :max="2"
        step="1"
        dense
        color="red darken-2"
        track-color="grey"
        :label="thumbLabel"
      ></v-slider>
    </span>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'FuzzinessWidget',
  data () {
    return {
      model: 0
    }
  },
  computed: {
    ...mapState('searchParameters', ['fuzziness']),
    thumbLabel () {
      if (this.model <= 0) {
        return 'Exact'
      }
      if (this.model <= 1) {
        return 'Flou'
      }
      return 'Très flou'
    }
  },
  watch: {
    model () {
      this.setFuzziness(this.model)
    },
    fuzziness () {
      this.model = this.fuzziness
    }
  },
  mounted () {
    this.model = this.fuzziness
  },
  methods: {
    ...mapActions('searchParameters', ['setFuzziness'])
  }

}
</script>

<style lang="scss">
 .v-slider__thumb {
  height: 12px;
  width: 12px;
}
.fuzziness {
    margin-top: 2px;
    margin-right: 50px;
    .v-messages {
      display: none !important;
    }

  .v-label {
    margin-left: 8px !important;
  }

  .v-input__slot {
    flex-direction: row-reverse;
    justify-content: flex-end;
    min-width: inherit;
    .v-application--is-ltr & {
      .v-input--selection-controls__input {
        margin-right: 0;
        margin-left: 16px;
      }
    }
  }
}

.fuzziness {
  min-width: 150px;
}
</style>
