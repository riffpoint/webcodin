
export default {
  dev: process.env.NODE_ENV !== 'production',
  target: 'static',
  server: {
    port: 3000,
    host: '127.0.0.1'
  },
  /*
  ** Headers of the page
  */
  head () {
    return {
      htmlAttrs () {
        return {
          lang: this.$i18n.locale
        }
      },
      title: '',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@500&display=swap' },
        { rel: 'stylesheet', href: 'https://maxst.icons8.com/vue-static/landings/line-awesome/line-awesome/1.3.0/css/line-awesome.min.css' }
      ]
    }
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'buefy',
    '~/assets/sass/style.sass'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/Vuelidate' },
    { src: '~/plugins/v-mask.js' },
    { src: '~/plugins/filters.js' },
    { src: '~/plugins/star-rating.js', mode: 'client' },
    { src: '~/plugins/persistedState.client.js' },
    { src: '~/plugins/sanitize.js' },
    '~/plugins/firebase.js'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    '@nuxtjs/style-resources',
    '@nuxtjs/fontawesome'
  ],
  fontawesome: {
    component: 'fa',
    icons: {
      solid: true,
      regular: true,
      brands: true
    }
  },
  middleware: [],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://buefy.github.io/#/documentation
    'nuxt-buefy',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    [
      'nuxt-i18n', {
        strategy: 'prefix_except_default',
        lazy: true,
        seo: true,
        locales: [
          {
            code: 'en',
            iso: 'en-US',
            file: 'en.json',
            name: 'English'
          },
          {
            code: 'de',
            iso: 'de-DE',
            file: 'de.json',
            name: 'German'
          }
        ],
        loadLanguagesAsync: true,
        langDir: 'i18n/',
        detectBrowserLanguage: false,
        defaultLocale: 'de',
        parsePages: false,
        pages: {
          'index': {
            de: '/',
            en: '/'
          },
          'registration': {
            de: '/registrieren',
            en: '/register'
          },
          'registration/StepTwo': {
            de: '/registrieren2',
            en: '/register2'
          },
          'registration/StepThree': {
            de: '/registrieren3',
            en: '/register3'
          },
          'registration/StepFour': {
            de: '/registrieren4',
            en: '/register4'
          },
          'login/index': {
            de: '/einloggen',
            en: '/login'
          },
          'login/recoverPassword': {
            de: '/pwvergessen',
            en: '/pwreset'
          },
          'my-account/index': {
            de: '/meinkonto',
            en: '/myaccount'
          },
          'post/_id': {
            de: '/post/:id',
            en: '/post/:id'
          },
          'post/_id/editPost': {
            de: '/post/:id/bearbeiten',
            en: '/post/:id/edit'
          },
          'newPost/index': {
            de: '/posterstellen',
            en: '/createpost'
          },
          'myPosts/index': {
            de: '/meineposts',
            en: '/myposts'
          },
          // 'search/index': {
          //   de: '/suchen',
          //   en: '/search'
          // },
        }
      }
    ],
    ['v-sanitize/nuxt'],
    'cookie-universal-nuxt'
  ],
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
  },
  buefy: {
    materialDesignIcons: false,
    defaultIconPack: 'las',
    customIconPacks: {
      'las': {
        iconPrefix: 'la-',
        internalIcons: {
          'check': 'check',
          'information': 'info-circle',
          'check-circle': 'check-circle',
          'alert': 'exclamation',
          'alert-circle': 'exclamation-circle',
          'arrow-up': 'arrow-up',
          'chevron-right': 'angle-right',
          'chevron-left': 'angle-left',
          'chevron-down': 'arrow-down',
          'eye': 'eye',
          'eye-off': 'eye-slash',
          'menu-down': 'angle-down',
          'menu-up': 'angle-up',
          'close-circle': 'times-circle'
        }
      },
      'lar': {
        iconPrefix: 'la-',
        internalIcons: {
          'close-circle': 'times-circle'
        }
      },
    }
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: [
      'vuelidate'
    ],
    /*
    ** You can extend webpack config here
    */
    extend (config, ctx) {
    }
  }
}
