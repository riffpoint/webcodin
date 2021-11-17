<template>
  <div class="edit-post-page page-content-wrap">
    <div class="banner" style="background-image: url(/images/registration-banner.jpg)">
      <div class="container container-md">
        <div v-if="post" class="banner-left banner-content">
          <p class="banner-title banner-title-small">{{ post[`title_${$i18n.locale}`] }}</p>
        </div>
      </div>
    </div>
    <div class="page-content" v-if="post">
      <div class="container">
        <post-edit-form
          :post="post"
          @saveData="saveChanges"
        />
        <transition name="grow">
          <notification v-show="notificationShown" @closeNotification="notificationShown = false" :type="notificationType" :message="notificationMessage" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import { collection, query, where, getDocs, getDoc, doc, updateDoc } from "firebase/firestore"
  import { db } from "@/plugins/firebase"
  import PostEditForm from '@/components/posts/PostEditForm'
  import Notification from '@/components/ui/Notification'

  export default {
    name: 'EditPost',
    head () {
      return {
        title: this.post[`title_${this.$i18n.locale}`] || this.$t('pages.editPost.newPostTitle')
      }
    },
    props: {
      existingPost: {
        type: Object,
      }
    },
    middleware: ['check-user', 'check-author'],
    components: {
      PostEditForm,
      Notification
    },
    data () {
      return {
        post: {},
        notificationShown: false,
        notificationType: 'success',
        notificationMessage: 'Data saved successfully'
      }
    },
    async created () {
      if (this.existingPost) {
        this.post = { ...this.existingPost }
      } else {
        const postSnapshot = await getDoc(doc(db, 'posts', this.$route.params.id))
        this.post = { ...postSnapshot.data() }
      }
    },
    methods: {
      async saveChanges (data) {
        const newPost = { ...data }
        if (!newPost.category) {
          const catQuery = query(collection(db, 'categories'), where('name', '==', data.categoryName))
          const catSnapshot = await getDocs(catQuery)
          catSnapshot.forEach(cat => {
            newPost.category = doc(db, 'categories/', cat.id)
          })
        }
        try {
          await updateDoc(doc(db, 'posts', this.$route.params.id), newPost)
          console.log('updated successfuly')
          this.notificationShown = true
          setTimeout(() => {
            this.notificationShown = false
          }, 3000)
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>
