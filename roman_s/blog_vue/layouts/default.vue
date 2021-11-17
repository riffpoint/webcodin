<template>
  <div class="page-wrapper">
    <main-header />
    <header-nav />
    <nuxt />
    <back-to-top  />
    <main-footer />
  </div>
</template>

<script>
import mainHeader from '@/components/global/MainHeader'
import headerNav from '@/components/global/HeaderNav'
import mainFooter from '@/components/global/MainFooter'
import BackToTop from '@/components/ui/BackTotTop'
export default {
  data () {
    return {

    }
  },
  // middleware: ['check-user'],
  components: {
    mainHeader,
    headerNav,
    mainFooter,
    BackToTop
  }
}
</script>
