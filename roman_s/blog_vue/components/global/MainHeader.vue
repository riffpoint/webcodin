<template>
  <header class="main-header">
    <div class="header-top">
      <div class="container">
        <social-list class="is-hidden-mobile" />
        <ul class="header-top-links is-hidden-mobile">
          <li class="header-top-links-item">
            <nuxt-link :to="localePath('/')" class="header-top-link">{{ $t('vocabulary.search') }}</nuxt-link>
          </li>
          <li class="header-top-links-item">
            <nuxt-link :to="localePath('/')" class="header-top-link">{{ $t('header.headerTopLinks.faq') }}</nuxt-link>
          </li>
          <li class="header-top-links-item">
            <nuxt-link :to="localePath('/')" class="header-top-link">{{ $t('header.headerTopLinks.contact') }}</nuxt-link>
          </li>
        </ul>
        <locale-switcher v-if="!showMobileMenu" />
        <div class="mobile-menu-wrap is-hidden-tablet">
          <button class="mobile-menu-toggler" :class="{'open': showMobileMenu}" @click="showMobileMenu = !showMobileMenu"></button>
          <div class="mobile-menu" :class="{'open': showMobileMenu}">
            <div class="mobile-menu-buttons">
              <nuxt-link :to="localePath('registration')" class="btn btn-primary mobile-menu-action-btn">{{ $t('buttons.registerButton') }}</nuxt-link>
              <nuxt-link :to="localePath('login')" class="btn btn-ghost-primary mobile-menu-action-btn">{{ $t('buttons.loginButton') }}</nuxt-link>
            </div>
            <p class="mobile-menu-title">{{ $t('footer.menu1.title') }}</p>
            <ul class="mobile-menu-list">
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu1.items.howWorks') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu1.items.faq') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu1.items.fairplay') }}</nuxt-link></li>
            </ul>
            <p class="mobile-menu-title">{{ $t('footer.menu2.title') }}</p>
            <ul class="mobile-menu-list">
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu2.items.team') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu2.items.contact') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu2.items.newsletter') }}</nuxt-link></li>
            </ul>
            <p class="mobile-menu-title">{{ $t('footer.menu3.title') }}</p>
            <ul class="mobile-menu-list">
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu3.items.about') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu3.items.terms') }}</nuxt-link></li>
              <li class="mobile-menu-item"><nuxt-link :to="localePath('/')" class="mobile-menu-link">{{ $t('footer.menu3.items.dataSecurity') }}</nuxt-link></li>
            </ul>
            <social-list />
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import LocaleSwitcher from './LocaleSwitcher.vue'
import SocialList from '../ui/SocialList'

export default {
  components: {
    LocaleSwitcher,
    SocialList
  },
  data () {
    return {
      showMobileMenu: false,
      user: {}
    }
  },
  methods: {
    disableScroll (disable) {
      const html = document.querySelector('html')
      if (disable) {
        html.classList.add('scroll-disabled')
      } else {
        html.classList.remove('scroll-disabled')
      }
    }
  },
  watch: {
    showMobileMenu (newVal) {
      this.disableScroll(newVal)
    },
    $route () {
      this.showMobileMenu = false
    }
  }
}
</script>
