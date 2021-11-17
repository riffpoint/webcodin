<template>
  <left-sidebar-layout pageClass="login-page registration-page" sidebarClass="is-hidden-touch">
    <template #top-content>
      <div class="banner" style="background-image: url(/images/registration-banner.jpg)">
        <div class="container container-md">
          <div class="banner-left banner-content">
            <p class="banner-title banner-title-small">{{ $t('pages.login.bannerTitle') }}</p>
            <p class="banner-subtitle-small">{{ $t('pages.login.bannerSubtitle') }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #sidebar-content>
      <div class="registration-form-text">
        <p
          class="registration-form-title" 
          v-html="$t('pages.registration.formTitle', { name: `<span class='color-primary'>CompanyName</span>` })"
        ></p>
        <div class="registration-form-subtitle">
          <p>{{ $t('pages.login.sidebarText1') }}</p>
          <p>{{ $t('pages.login.sidebarText2') }}</p>
          <p>{{ $t('pages.login.sidebarText3') }}</p>
        </div>
        <nuxt-link :to="localePath('registration')" class="btn btn-secondary mb-2 btn-md">{{ $t('pages.homepage.banner.actionButton') }}</nuxt-link>
        <p class="title-text">-<span>{{ $t('vocabulary.or') }}</span>-</p>
        <button class="btn btn-with-icon facebook-button">
          <span class="btn-icon">
            <!-- <fa size="lg" :icon="['fab', 'facebook-f']"  /> -->
            <i class="lab la-facebook-f"></i>
          </span>
          <span class="btn-text">{{ $t('buttons.registerFacebook') }}</span>
        </button>
      </div>
    </template>
    <template #main-content>
      <div class="registration-form-column">
        <nuxt-child />
      </div>
    </template>
  </left-sidebar-layout>
</template>

<script>
import LeftSidebarLayout from '@/components/global/LeftSidebarLayout'
export default {
  name: 'Login',
  middleware: ['not-authenticated'],
  components: {
    LeftSidebarLayout,
  },
}
</script>
