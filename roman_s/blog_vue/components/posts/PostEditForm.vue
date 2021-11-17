<template>
  <div class="post-edit-wrap" v-if="post">
    <!-- <div class="multilang-check bordered-bottom mb-2 pb-2">
      <label class="checkbox-item-wrap">
        <input type="checkbox" class="checkbox-input">
        <span class="checkbox-input-label"><span class="checkbox-label-text">{{ $t('pages.editPost.multilangCheck') }}</span></span>
      </label>
    </div> -->
    <b-tabs
      vertical
      v-model="activeTab"
    >
      <b-tab-item v-for="lang in $i18n.locales" :value="lang.code" :key="lang.code" :label="lang.code">
        <div class="columns is-multiline">
          <div class="column">
            <div
              class="form-item-wrap"
              :class="{ 'form-item-error': errors[`title_${lang.code}`] && validated }"
            >
              <label class="form-label-top">
                {{ $t('vocabulary.title') }}
                <span class="color-red required-mark">*</span>
                <input type="text" class="form-item-input text-input bordered-input" v-model.trim="postData[`title_${lang.code}`]" @input="disableErrors(`title_${lang.code}`)" :placeholder="$t('forms.firstNamePlaceholder')">
              </label>
              <p class="error-message" v-if="errors[`title_${lang.code}`] && validated">{{ $t('forms.requiredError') }}</p>
            </div>
          </div>
          <div class="column">
            <div
              class="form-item-wrap"
              :class="{ 'form-item-error': errors.categoryName && validated }"
            >
              <label class="form-label-top">
                {{ $t('vocabulary.category') }}
                <span class="color-red required-mark">*</span></label>
              <div class="select-wrap form-item-input">
                <v-select
                  :options="categories"
                  v-model="postData.categoryName"
                  :components="{OpenIndicator}"
                  :searchable="false"
                  id="form-of-address"
                  @change="disableErrors('categoryName')"
                  label="category"
                />
              </div>
              <p class="error-message" v-if="errors.categoryName && validated">{{ $t('forms.requiredError') }}</p>
            </div>
          </div>
          <div class="column is-12">
            <div
              v-if="`content_${lang.code}` in postData"
              class="form-item-wrap"
              :class="{ 'form-item-error': errors[`content_${lang.code}`] && validated }"
            >
              <editor
                class="mt-6p post-edit-editor"
                v-model="postData[`content_${lang.code}`]"
                :controls="['bold', 'italic', 'bullet-list']"
                :emitLength="false"
                @input="disableErrors(`content_${lang.code}`)"
              />
              <p class="error-message" v-if="errors[`content_${lang.code}`] && validated">{{ $t('forms.requiredError') }}</p>
            </div>
          </div>
        </div>
      </b-tab-item>
    </b-tabs>
    <div class="bordered-top is-flex justify-between mt-2 pt-2">
      <button
        class="btn btn-ghost-grey cancel-button"
        @click="cancel"
      >
        <span class="is-hidden-mobile">{{ $t('forms.cancel') }}</span>
        <span class="is-hidden-tablet cross-icon"></span>
      </button>
      <button
        class="btn btn-primary next-btn"
        @click="saveData"
      >
        {{ $t('buttons.save') }}
      </button>
    </div>
  </div>
</template>

<script>
  import vSelect from 'vue-select'
  import Editor from '@/components/ui/Editor'
  import { collection, getDocs } from "firebase/firestore"
  import { db } from "@/plugins/firebase"

  export default {
    props: {
      post: {
        type: Object,
        required: true
      }
    },
    components: {
      vSelect,
      Editor
    },
    data () {
      return {
        activeTab: this.$i18n.locale,
        isMultilang: true,
        postData: {},
        OpenIndicator: {
          render: createElement => createElement('span', {class: {'select-caret': true}}),
        },
        categories: [],
        validated: false
      }
    },
    async created () {
      const categoriesCollection = await getDocs(collection(db, "categories"))
      categoriesCollection.forEach(cat => {
        this.categories.push(cat.data())
      })
      this.categories.sort((a,b) => a.order - b.order)
      this.categories = this.categories.map(cat => cat.name)
    },
    computed: {
      errors () {
        const errors = {}
        for (let lang of this.$i18n.locales) {
          if (!this.postData[`title_${lang.code}`] && this.postData[`content_${lang.code}`]) {
            errors[`title_${lang.code}`] = true
          }
          if (!this.postData[`content_${lang.code}`] && this.postData[`title_${lang.code}`]) {
            errors[`content_${lang.code}`] = true
          }
        }

        if (!this.postData.categoryName) {
          errors.categoryName = true
        }

        return errors
      }
    },
    methods: {
      saveData () {

        if (this.errors && Object.keys(this.errors).length) {
          console.log('errors', !!this.errors)
          this.validated = true

          const errorLocales = new Set()

          if (Object.keys(this.errors).length === 1 && this.errors.categoryName) {
            return
          } else {
            Object.keys(this.errors).forEach(err => {
              if (err === 'categoryName') return
              errorLocales.add(err.split('_')[1])
            })
          }

          console.log([...errorLocales][0], errorLocales)

          this.activeTab = [...errorLocales][0]

          return
        }

        if (this.postData.categoryName !== this.post.categoryName) {
          this.postData.category = null
        }
        this.$emit('saveData', this.postData)
      },
      cancel () {
        this.$emit('cancel')
      },
      disableErrors (field) {
        if (this.errors[field]) {
          this.validated = false
        }
      }
    },
    watch: {
      post: {
        immediate: true,
        handler(newPost) {
          this.postData = { ...newPost }
        }
      }
    }
  }
</script>
