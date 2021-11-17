<template>
  <div class="new-post-page page-content-wrap">
    <div class="banner" style="background-image: url(/images/registration-banner.jpg)">
      <div class="container container-md">
        <div v-if="post" class="banner-left banner-content">
          <p class="banner-title banner-title-small">{{ $t('pages.newPost.title') }}</p>
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
  import { collection, query, where, getDocs, addDoc, Timestamp, doc } from "firebase/firestore"
  import { db } from "@/plugins/firebase"
  import PostEditForm from '@/components/posts/PostEditForm'
  import Notification from '@/components/ui/Notification'

  export default {
    name: 'NewPost',
    head () {
      return {
        title: this.$t('pages.newPost.title')
      }
    },
    data () {
      return {
        post: {
          category: '',
          categoryName: '',
        },
        notificationShown: false,
        notificationType: 'success',
        notificationMessage: 'Data saved successfully'
      }
    },
    components: {
      PostEditForm,
      Notification
    },
    middleware: ['check-user'],
    created () {
      this.post.category = ''
      this.post.categoryName = ''
      for (let lang of this.$i18n.locales) {
        this.post[`title_${lang.code}`] = ''
        this.post[`content_${lang.code}`] = ''
      }
    },
    methods: {
      async saveChanges (data) {

        const newPost = {
          ...data,
          rating: {
            ratingsAvg: 0,
            ratingsTotal: 0
          },
          author: doc(db, 'users', this.$store.state['auth-custom'].user.uid),
          created: Timestamp.fromDate(new Date())
        }

        const catQuery = query(collection(db, 'categories'), where('name', '==', data.categoryName))
        const catSnapshot = await getDocs(catQuery)
        catSnapshot.forEach(cat => {
          newPost.category = doc(db, 'categories/', cat.id)
        })

        try {
          const newId = await addDoc(collection(db, 'posts'), newPost)
          this.notificationShown = true
          this.$router.push(this.localePath({ name: 'post-id', params: { id: newId.id } }))
        } catch (err) {
          console.log(err)
        }
      }
    }
  }
</script>