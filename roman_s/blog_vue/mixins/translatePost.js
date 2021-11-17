export default {
  methods: {
    displayPost (post) {
      const displayed = {}

      const currentLoc = this.$i18n.locale
      const defaultLoc = this.$i18n.defaultLocale

      
      function isLocalized (loc) {
        if (post[`title_${loc}`] && post[`content_${loc}`]) {
          return true
        }
        return false
      }


      if (post[`title_${currentLoc}`] && post[`content_${currentLoc}`]) {
        displayed.title = post[`title_${currentLoc}`]
        displayed.content = post[`content_${currentLoc}`]

        return displayed
      }

      if (currentLoc !== defaultLoc && isLocalized(defaultLoc)) {
        displayed.title = post[`title_${defaultLoc}`]
        displayed.content = post[`content_${defaultLoc}`]

        return displayed
      }

      for (let loc of this.$i18n.locales) {
        if (isLocalized(loc.code)) {
          displayed.title = post[`title_${loc.code}`]
          displayed.content = post[`content_${loc.code}`]
        }
      }

      return displayed
    }
  }
}
