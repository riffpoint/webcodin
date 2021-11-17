<template>
  <div class="post-card" v-if="post">
    <b-dropdown v-if="deletable || editable" aria-role="list">
      <template #trigger>
        <button class="btn-round-icon btn-round-icon-md dropdown-toggler" aria-label="Post Actions">
          <!-- <fa :icon="['fas', 'cogs']" /> -->
          <i class="las la-cog"></i>
        </button>
      </template>

      <b-dropdown-item class="link-inside" aria-role="listitem" v-if="editable"><nuxt-link :to="localePath({ name: 'post-id-editPost', params: { id: objectLink.params.id } })">{{ $t('vocabulary.edit') }}</nuxt-link></b-dropdown-item>
      <b-dropdown-item v-if="deletable" aria-role="listitem" class="color-red" @click="$emit('deleteObject', post.id)">{{ $t('vocabulary.delete') }}</b-dropdown-item>
    </b-dropdown>
    <nuxt-link class="post-card-image-wrap" :to="localePath(objectLink)">
      <img class="post-card-image" :src="post.previewImage || '/images/image-placeholder.jpg'" :alt="displayPost(post).title">
    </nuxt-link>
    <div class="post-card-info">
      <div class="post-category-wrap mb-1">
        <nuxt-link class="post-category" :to="localePath('/')">{{ category.name }}</nuxt-link>
      </div>
      <nuxt-link class="post-card-title" :to="localePath(objectLink)">
        {{ displayPost(post).title }}
      </nuxt-link>
      <div class="post-card-user-wrap is-flex justify-between align-center">
        <div class="post-card-user">
          <img class="post-card-user-image" :src="post.author.avatar || '/images/no-avatar.png'" :alt="`${post.user.firstname} ${post.user.lastname}`">
          <span class="post-card-user-name">{{ post.user.username }}</span>
        </div>
        <div class="post-card-user-right">
          {{ dateFormat(post.created.seconds * 1000) }}
        </div>
      </div>
      <div class="post-card-excerpt">
        <p>{{ excerpt }}</p>
      </div>
      <div class="post-card-rating-wrap">
        <stars-rating
          :increment="0.1"
          :rating="post.rating.ratingsAvg"
          :read-only="true"
          :show-rating="false"
          active-color="#ff9b42"
          inactive-color="#9699a2"
          :star-points="[47.399903125,19.6044921875, 31.5063484375,17.926025, 25,3.3325203125, 18.493653125,17.926025, 2.6000984375,19.6044921875, 14.4714359375,30.3039546875, 11.1572265625,45.935059375, 25,37.9516609375, 38.8427734375,45.935059375, 35.5285640625,30.3039546875]"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { doc, getDoc } from "firebase/firestore"
import translatePost from '@/mixins/translatePost'


export default {
  props: {
    post: {
      type: Object,
      required: true,
    },
    deletable: {
      type: Boolean,
      required: true,
    },
    editable: {
      type: Boolean,
      required: true
    }
  },
  mixins: [translatePost],
  data () {
    return {
      category: {}
    }
  },
  async created () {
    const doc = await getDoc(this.post.category)
    this.category = { ...doc.data() }
  },
  computed: {
    objectLink () {
      return { name: 'post-id', params: { id: this.post.id } }
    },
    title () {
      return `title_${this.$i18n.locale}`
    },
    excerpt () {
      const content = this.displayPost(this.post).content
      const temp = document.createElement('div')
      temp.innerHTML = content
      const tempExcerpt = temp.innerText
      const tempArray = tempExcerpt.split(' ')
      let excerpt = ''
      for(let i of tempArray) {
        if (!excerpt) {
          excerpt = i
        } else if (excerpt.length < 100) {
          excerpt = `${excerpt} ${i}`
        } else {
          break
        }
      }
      return `${excerpt}...`
    }
  },
  methods: {
    dateFormat (date) {
      return this.$options.filters.formatDate(new Date(date))
    },
  }
}
</script>
