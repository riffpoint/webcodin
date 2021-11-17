<template>
  <right-sidebar-layout pageClass="post-page">
    <template #top-content>
      <div class="banner" style="background-image: url(/images/registration-banner.jpg)">
        <div class="container container-md">
          <div v-if="post" class="banner-left banner-content">
            <p class="banner-title banner-title-small">{{ displayPost(post).title }}</p>
            <p v-if="post.user" class="banner-subtitle-small">{{ `${$t('vocabulary.by')} ${post.user.username}` }}</p>
          </div>
        </div>
      </div>
    </template>
    <template v-if="post" #main-content>
      <div class="post-breadcrumbs">
        <nuxt-link :to="localePath('/')"></nuxt-link>
      </div>
      <h2 class="post-title title color-primary bordered-bottom pb-10 mb-20">{{ displayPost(post).title }}</h2>
      <div class="post-info-wrap">
        <nuxt-link :to="localePath('/')" class="post-category">{{ post.categoryName }}</nuxt-link>
        <stars-rating
          :increment="0.1"
          :inline="true"
          :rating="post.rating.ratingsAvg"
          :read-only="true"
          :show-rating="true"
          active-color="#ff9b42"
          inactive-color="#9699a2"
          :star-points="[47.399903125,19.6044921875, 31.5063484375,17.926025, 25,3.3325203125, 18.493653125,17.926025, 2.6000984375,19.6044921875, 14.4714359375,30.3039546875, 11.1572265625,45.935059375, 25,37.9516609375, 38.8427734375,45.935059375, 35.5285640625,30.3039546875]"
        />
      </div>
      <div class="post-content" v-html="displayPost(post).content"></div>
      <div class="bordered-top mt-2">
        <div class="post-rating-wrap pt-2">
          <span class="post-rate-text">{{ $t('pages.post.rateIt') }}</span>
          <stars-rating
            :increment="1"
            :inline="true"
            :rating="postRating"
            :read-only="false"
            :show-rating="true"
            active-color="#ff9b42"
            inactive-color="#9699a2"
            :star-points="[47.399903125,19.6044921875, 31.5063484375,17.926025, 25,3.3325203125, 18.493653125,17.926025, 2.6000984375,19.6044921875, 14.4714359375,30.3039546875, 11.1572265625,45.935059375, 25,37.9516609375, 38.8427734375,45.935059375, 35.5285640625,30.3039546875]"
          />
        </div>
      </div>
    </template>
    <template #sidebar-content>
      <div class="sidebar-content">
        <div class="bordered mb-2" v-if="post">
          <div class="primary-bg pa-2 sidebar-user-info" v-if="post.user">
            <div class="avatar-wrap">
              <img class="is-block" :src="post.user.avatar || '/images/no-avatar.png'" :alt="post.user.username">
            </div>
            <p class="username text-center">{{ post.user.username }}</p>
          </div>
        </div>
        <div class="bordered pa-2 mb-2">
          <h3 class="title title-md mb-20 color-primary">{{ $t('vocabulary.recentPosts') }}</h3>
          <ul class="recent-posts-list">
            <li v-for="recent in recentPosts" :key="recent.id" class="recent-post">
              <span class="recent-date">{{ formatRecentDate(recent.created.seconds * 1000) }}</span>
              <nuxt-link :to="localePath({ name: 'post-id', params: { id: recent.id } })" class="recent-post-link">
                {{ displayPost(recent).title }}
              </nuxt-link>
            </li>
          </ul>
        </div>
      </div>
    </template>
  </right-sidebar-layout>
</template>

<script>
  import RightSidebarLayout from '~/components/global/RightSidebarLayout.vue'
  import { getDoc, doc, query, orderBy, limit, collection, getDocs } from "firebase/firestore"
  import { db } from "@/plugins/firebase"
  import translatePost from '@/mixins/translatePost'
  export default {
    name: 'Post',
    head () {
      return {
        title: this.post ? this.post[`title_${this.$i18n.locale}`] : ''
      }
    },
    mixins: [translatePost],
    data () {
      return {
        post: null,
        recentPosts: [],
        postRating: 1
      }
    },
    components: {
      RightSidebarLayout
    },
    async created () {
      // Get post from DB based on URL path
      const pathSplit = this.$route.path.split('/')
      const postRef = doc(db, "posts", pathSplit[pathSplit.length - 1])
      const post = await getDoc(postRef)
      const postData = { ...post.data() }
      const user = await getDoc(postData.author)

      // Get data about post author
      postData.user = user.data()
      this.post = postData

      // Get recent posts
      const postsRef = collection(db, 'posts')
      const recentQuery = query(postsRef, orderBy('created', 'desc'), limit(10))
      const recentSnapshots = await getDocs(recentQuery)
      recentSnapshots.forEach(doc => {
        this.recentPosts.push({ ...doc.data(), id: doc.id })
      })
    },
    computed: {
      
    },
    methods: {
      transformNumbers (n) {
        if(n.toString().length > 1) return n
        else return `0${n}`
      },
      formatRecentDate (date) {
        const createdDate = new Date(date)
        const today = new Date()

        if (today - createdDate < 86400000 && createdDate.getDate() === today.getDate()) {
          return `${this.transformNumbers(createdDate.getHours())}:${this.transformNumbers(createdDate.getMinutes())}`
        } else {
          return this.$options.filters.formatDate(createdDate)
        }
      },
    }
  }
</script>
