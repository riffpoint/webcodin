<template>
  <div class="footer-wrapper">
    <section class="pre-footer divider primary-bg">
      <div class="container">
        <h2 class="section-title section-title-small pre-footer-title is-hidden-mobile">{{ $t('pages.homepage.preFooterTitle') }}</h2>
        <social-list />
      </div>
    </section>
    <footer class="main-footer">
      <div class="container">
        <div class="columns">
          <div class="column footer-column">
            <img class="footer-logo" src="/images/placeholder-logo-2.png" :alt="$t('header.logoAlt')">
            <p class="footer-text footer-text-left">{{ $t('footer.footerText') }}</p>
          </div>
          <div class="column footer-column">
            <hr class="footer-divider is-hidden-tablet">
            <h3 class="footer-title">{{ $t('footer.menu1.title') }}</h3>
            <ul class="footer-menu">
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu1.items.howWorks') }}</nuxt-link></li>
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu1.items.faq') }}</nuxt-link></li>
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu1.items.fairplay') }}</nuxt-link></li>
            </ul>
            <h3 class="footer-title">{{ $t('footer.menu2.title') }}</h3>
            <ul class="footer-menu">
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu2.items.team') }}</nuxt-link></li>
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu2.items.contact') }}</nuxt-link></li>
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu2.items.newsletter') }}</nuxt-link></li>
            </ul>
          </div>
          <div class="column footer-column">
            <h3 class="footer-title">{{ $t('footer.menu3.title') }}</h3>
            <ul class="footer-menu">
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu3.items.about') }}</nuxt-link></li>
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu3.items.terms') }}</nuxt-link></li>
              <li class="footer-menu-item"><nuxt-link :to="localePath('/')" class="footer-menu-link">{{ $t('footer.menu3.items.dataSecurity') }}</nuxt-link></li>
            </ul>
            <hr class="footer-divider is-hidden-tablet">
            <h3 class="footer-title">{{ $t('footer.footerSubtitle') }}</h3>
            <p class="footer-text">
              <span>{{ $t('footer.footerSubtext1') }}</span>
              <a href="mailto:team@gmail.com">team@gmail.com</a>
              <span>{{ $t('footer.footerSubtext2') }}</span>
              <nuxt-link :to="localePath('/')">{{ $t('footer.footerTextLink') }}</nuxt-link>
              <span>{{ $t('footer.footerSubtext3') }}</span>
            </p>
          </div>
        </div>
      </div>
      <div class="copyright">
        <div class="container">
          <p class="copyright-text text-center">{{`&copy; ${new Date().getFullYear()}. ${$t('footer.copyright')}`}}</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import SocialList from '../ui/SocialList'

export default {
  components: {
    SocialList
  }
}
</script>
