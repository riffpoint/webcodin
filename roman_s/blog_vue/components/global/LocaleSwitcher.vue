<template>
  <div class="locale-switcher"
    :class="{'switcher-is-opened': isOpened}"
    v-click-outside="outside"
  >
    <button
      class="locale-button locale-active"
      :class="`locale-${$i18n.locale}`"
      @click="isOpened = !isOpened"
    >
      {{ $i18n.locale }}
    </button>
    <div class="locale-dropdown" v-show="isOpened">
      <button
        v-for="locale in inactiveLocales"
        :key="locale.code"
        class="locale-button"
        :class="`locale-${locale.code}`"
        @click="changeLocale(locale.code)"
      >
        {{ locale.code }}
      </button>
    </div>
  </div>
</template>

<script>
import ClickOutside from 'vue-click-outside'
export default {
  directives: {
    ClickOutside
  },
  data () {
    return {
      isOpened: false
    }
  },
  computed: {
    inactiveLocales () {
      return this.$i18n.locales.filter(loc => loc.code !== this.$i18n.locale)
    }
  },
  methods: {
    changeLocale (code) {
      this.$router.push(this.switchLocalePath(code))
      this.isOpened = false
    },
    outside () {
      this.isOpened = false
    }
  },
}
</script>
