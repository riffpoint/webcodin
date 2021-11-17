<template>
  <div class="page-home">
    <div class="banner homepage-banner" style="background-image: url(/images/banner-bg.jpg)">
      <div class="container container-narrow">
        <div class="banner-left">
          <p class="banner-title">{{ $t('pages.homepage.banner.title') }}</p>
          <p class="banner-subtitle">{{ $t('pages.homepage.banner.subtitle') }}</p>
          <nuxt-link :to="localePath({name: 'registration'})" class="btn btn-md btn-secondary">{{ $t('pages.homepage.banner.actionButton') }}</nuxt-link>
        </div>
        <div class="banner-right">
          <p class="download-title is-hidden-tablet" v-html="$t('pages.homepage.banner.downloadTitle')"></p>
          <div class="appstore-wrap">
            <div class="appstore-image-wrap is-hidden-mobile">
              <img src="/images/iPhone.png" alt="">
            </div>
            <a to="#" class="app-link">
              <img :src="$t('buttons.appstoreButton')" alt="">
            </a>
          </div>
          <div class="appstore-wrap">
            <div class="appstore-image-wrap is-hidden-mobile">
              <img src="/images/Pixel.png" alt="">
            </div>
            <a to="#" class="app-link">
              <img :src="$t('buttons.gplayButton')" alt="">
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="divider black-bg">
      <div class="container container-md">
        <p class="divider-title text-center">{{ $t('pages.homepage.searchTitle') }}</p>
        <div class="columns is-gapless is-desktop is-vcentered">
          <div class="column is-three-quarters-desktop">
            <div class="stripe-form">
              <input type="text" :placeholder="$t('forms.searchPlaceholder')" class="stripe-form-input text-input">
              <button class="search-submit stripe-form-btn primary-submit">
                <!-- <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32"><path d="M 19 3 C 13.488281 3 9 7.488281 9 13 C 9 15.394531 9.839844 17.589844 11.25 19.3125 L 3.28125 27.28125 L 4.71875 28.71875 L 12.6875 20.75 C 14.410156 22.160156 16.605469 23 19 23 C 24.511719 23 29 18.511719 29 13 C 29 7.488281 24.511719 3 19 3 Z M 19 5 C 23.429688 5 27 8.570313 27 13 C 27 17.429688 23.429688 21 19 21 C 14.570313 21 11 17.429688 11 13 C 11 8.570313 14.570313 5 19 5 Z"/></svg> -->
                <i class="las la-search"></i>
              </button>
            </div>
          </div>
          <div class="column">
            <div class="search-link">
              <span class="link-divider">{{ $t('vocabulary.or') }}</span>
              <nuxt-link :to="localePath('/')" class="btn btn-md btn-secondary">{{ $t('pages.homepage.searchLink') }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-section">
      <div class="container">
        <div class="columns is-gapless is-desktop">
          <div class="column">
            <div class="promo-box promo-box-primary primary-bg">
              <p class="promo-box-title">{{ $t('pages.homepage.promobox1.title') }}</p>
              <div class="promo-box-image-wrap">
                <img src="/images/promo-icon1.png" alt="">
              </div>
              <p class="promo-box-description">{{ $t('pages.homepage.promobox1.description') }}</p>
              <nuxt-link :to="localePath('/')" class="btn btn-ghost-white-primary promo-box-btn">{{ $t('pages.homepage.promobox1.button') }}</nuxt-link>
            </div>
          </div>
          <div class="column">
            <div class="promo-box promo-box-black black-bg">
              <p class="promo-box-title">{{ $t('pages.homepage.promobox2.title') }}</p>
              <div class="promo-box-image-wrap">
                <img src="/images/DieMobiliar.png" alt="">
              </div>
              <p class="promo-box-description">{{ $t('pages.homepage.promobox2.description') }}</p>
              <nuxt-link :to="localePath('/')" class="btn btn-ghost-white-black promo-box-btn">{{ $t('pages.homepage.promobox2.button') }}</nuxt-link>
            </div>
          </div>
          <div class="column">
            <div class="promo-box promo-box-primary primary-bg">
              <p class="promo-box-title">{{ $t('pages.homepage.promobox3.title') }}</p>
              <div class="promo-box-image-wrap">
                <img src="/images/promo-icon3.png" alt="">
              </div>
              <p class="promo-box-description">{{ $t('pages.homepage.promobox3.description') }}</p>
              <nuxt-link :to="localePath('/')" class="btn btn-ghost-white-primary promo-box-btn">{{ $t('pages.homepage.promobox3.button') }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="content-section small-spacing">
      <div class="container container-md">
        <p class="section-title color-primary">{{ $t('pages.homepage.objectsTitle') }}</p>
        <p class="section-subtitle">{{ $t('pages.homepage.objectsSubtitle') }}</p>
        <div class="tabs-wrap white-bg">
          <b-tabs type="is-toggle" v-model="activeTab">
            <b-tab-item :label="$t('pages.homepage.newObjectsTab')">
              <client-only>
                <post-grid
                  v-if="posts"
                  :objects="posts"
                  :total="postsTotal"
                  :perRow="4"
                  :perPage="8"
                  :deletable="false"
                  :editable="false"
                />
              </client-only>
            </b-tab-item>
            <b-tab-item :label="$t('pages.homepage.newEvents')">
              <h2>Section under development</h2>
            </b-tab-item>
          </b-tabs>
        </div>
      </div>
    </div>
    <div class="content-section large-spacing grey-bg">
      <div class="container container-md">
        <p class="section-title color-primary">{{ $t('pages.homepage.newsTitle') }}</p>
        <p class="section-subtitle">{{ $t('pages.homepage.newsSubtitle') }}</p>
        <div class="news-wrap">
          <h2>Section under development</h2>
        </div>
      </div>
    </div>
    <div class="content-section">
      <div class="container">
        <div class="columns is-gapless black-bg is-desktop">
          <div class="column is-one-third-desktop description-image is-hidden-mobile">
            <img src="/images/descr-text-image.jpg" alt="">
          </div>
          <div class="column">
            <div class="description-text">
              <h1 class="desciption-text-title section-title section-title-middle">{{ $t('pages.homepage.descriptionTitle') }}</h1>
              <p class="desciption-text-preview">{{ $t('pages.homepage.descriptionPreview') }}</p>
              <button class="btn btn-ghost-white-black" @click="showTextPopup">
                {{ $t('pages.homepage.showMore') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <transition name="popup">
      <popup v-if="popupShown" @close-popup="popupShown = false">
        <template v-if="popupTitle" v-slot:popup-title>{{ popupTitle }}</template>
        <div v-if="popupContent" v-html="popupContent"></div>
      </popup>
    </transition>
  </div>
</template>

<script>
import Popup from '@/components/global/Popup'
import PostGrid from '~/components/global/PostGrid.vue'
import { collection, query, orderBy, limit, getDocs, getDoc } from "firebase/firestore"
import { db } from "@/plugins/firebase"

export default {
  name: 'HomePage',
  components: {
    Popup,
    PostGrid,
  },
  head () {
    return {
      title: this.$t('globalTitle')
    }
  },
  data () {
    return {
      activeTab: 0,
      popupShown: false,
      popupTitle: '',
      popupContent: '',
      posts: [],
      postsTotal: 0
    }
  },
  async mounted () {
    try {
      const postsRef = collection(db, "posts")
      const postsQuery = query(postsRef, orderBy('rating.ratingsAvg', 'desc'), limit(8))
      const querySnapshot = await getDocs(postsQuery)

      querySnapshot.forEach(async (doc) => {
        const postData = { ...doc.data(), id: doc.id }
        const user = await getDoc(postData.author)
        postData.user = user.data()
        this.posts.push(postData)
        this.postsTotal = this.posts.length
      })
    } catch (err) {
      console.log(err)
    }
  },
  methods: {
    showTextPopup () {
      this.popupContent = this.$t('pages.homepage.descriptionContent')
      this.popupShown = true
    }
  }
}
</script>
