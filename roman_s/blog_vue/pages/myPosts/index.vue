<template>
  <left-sidebar-layout pageClass="my-objects-page">
    <template #top-content>
      <div class="banner" style="background-image: url(/images/registration-banner.jpg)">
        <div class="container container-md">
          <div class="banner-left banner-content">
            <p class="banner-title banner-title-small">{{ $t('pages.myPosts.bannerTitle') }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #sidebar-content>
      <div class="sidebar-content text-content">
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium optio voluptates, nulla iure, consequuntur explicabo ratione rem unde beatae dicta commodi natus praesentium vel quia recusandae esse aspernatur veritatis necessitatibus rerum repudiandae. Velit, inventore itaque nihil minima nobis magnam, atque veritatis adipisci esse, incidunt harum voluptatem molestias officiis odio deleniti!</p>
      </div>
    </template>
    <template #main-content>
      <div v-if="posts.length" class="posts-wrap">
        <post-grid
          :objects="posts"
          :total="postsTotal"
          :perRow="3"
          :deletable="true"
          :editable="true"
          @deleteItem="showDeleteConfirmation"
          @updateGrid="updateObjects"
        />
        <transition name="popup">
          <popup v-if="popupShown" @close-popup="popupShown = false">
            <template #popup-title><h2 class="title title-md color-primary mb-2 text-center">{{ $t('pages.myObjects.deletePopupTitle') }}</h2></template>
            <template>
              <p class="text-center mb-2">{{ $t('pages.myObjects.deletePopupText') }}</p>
              <div class="is-flex align-center justify-between bordered-top pt-2">
                <button class="btn btn-primary" @click="popupShown = false">{{ $t('vocabulary.back') }}</button>
                <button class="btn btn-error" @click="deleteObject(deleteId)">{{ $t('buttons.deleteObjectConfirm') }}</button>
              </div>
            </template>
          </popup>
        </transition>
      </div>
      <div v-else class="empty-objects">
        <p><span class="space-after">{{ $t('pages.myObjects.noObjects') }}</span><nuxt-link :to="localePath({ name: 'newObject' })">{{ $t('pages.myObjects.noObjectsLink') }}</nuxt-link></p>
      </div>
    </template>
  </left-sidebar-layout>
</template>

<script>
import LeftSidebarLayout from '@/components/global/LeftSidebarLayout'
import PostGrid from '@/components/global/PostGrid'
import Popup from '~/components/global/Popup.vue'
import { collection, query, where, getDocs, getDoc, deleteDoc, doc } from "firebase/firestore"
import { db } from "@/plugins/firebase"

export default {
  name: 'myObjects',
  head () {
    return {
      title: this.$t('pages.myPosts.title')
    }
  },
  components: {
    LeftSidebarLayout,
    PostGrid,
    Popup
  },
  middleware: ['check-user'],
  data () {
    return {
      deleteId: null,
      popupShown: false,
    }
  },
  async asyncData ({ store }) {
    let posts = [], postsTotal
    const postsRef = collection(db, "posts")
    const userRef = doc(db, "users", store.state['auth-custom'].user.uid)
    const postsQuery = query(postsRef, where('author', '==', userRef))
    const querySnapshot = await getDocs(postsQuery)
    querySnapshot.forEach(async (doc) => {
      const postData = { ...doc.data(), id: doc.id }
      const user = await getDoc(postData.author)
      postData.user = user.data()
      posts.push(postData)
    })
    postsTotal = posts.length
    return { posts, postsTotal }
  },
  computed: {
    
  },
  methods: {
    showDeleteConfirmation (id) {
      this.deleteId = id
      this.popupShown = true
    },
    async deletePost (id) {
      try {
        await deleteDoc(doc(db, 'posts', id))
      } catch (err) {
        console.log(err)
      }
    },
    async updateObjects () {
      await this.$axios.get('/posts', { page: 1, perPage: 10000, sort: 'createdAt' })
        .then(res => {
          this.posts = res.data.posts.sort((a,b) => a.id -b.id)
          this.postsTotal = res.data.postsTotal
        })
    },
  },
  watch: {
    
  }
}
</script>
